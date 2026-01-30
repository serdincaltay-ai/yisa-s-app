/**
 * YİSA-S GitHub API istemcisi — Commit hazırlama / push (CTO, Patron onayı sonrası)
 * Otomatik deploy YAPMA; commit hazırla, push sadece Patron onayından sonra.
 * Tarih: 30 Ocak 2026
 */

const GITHUB_API = 'https://api.github.com'

function getKey(): string | undefined {
  const v = process.env.GITHUB_TOKEN
  return typeof v === 'string' ? v.trim() || undefined : undefined
}

function headers(): Record<string, string> {
  const token = getKey()
  return {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

export type GithubPrepareResult =
  | { ok: true; commitSha: string; ref: string; repo: string }
  | { ok: false; error: string }

/**
 * Repo'da commit hazırlar (blob + tree + commit). Push YAPMAZ.
 * Patron onayı sonrası ayrıca push() çağrılabilir.
 */
export async function githubPrepareCommit(params: {
  owner: string
  repo: string
  branch?: string
  message: string
  files: Array<{ path: string; content: string }>
}): Promise<GithubPrepareResult> {
  const token = getKey()
  if (!token) return { ok: false, error: 'GITHUB_TOKEN .env içinde tanımlı değil.' }

  const { owner, repo, branch = 'main', message, files } = params
  const repoPath = `${owner}/${repo}`

  try {
    const refRes = await fetch(`${GITHUB_API}/repos/${repoPath}/git/refs/heads/${branch}`, {
      headers: headers(),
    })
    if (!refRes.ok) {
      const err = await refRes.text()
      return { ok: false, error: `GitHub ref ${refRes.status}: ${err.slice(0, 200)}` }
    }
    const refData = (await refRes.json()) as { object?: { sha?: string } }
    const baseSha = refData.object?.sha
    if (!baseSha) return { ok: false, error: 'GitHub base SHA alınamadı.' }

    const blobShas: string[] = []
    for (const f of files) {
      const blobRes = await fetch(`${GITHUB_API}/repos/${repoPath}/git/blobs`, {
        method: 'POST',
        headers: { ...headers(), 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: Buffer.from(f.content, 'utf8').toString('base64'),
          encoding: 'base64',
        }),
      })
      if (!blobRes.ok) {
        const err = await blobRes.text()
        return { ok: false, error: `GitHub blob ${blobRes.status}: ${err.slice(0, 200)}` }
      }
      const blobData = (await blobRes.json()) as { sha?: string }
      if (blobData.sha) blobShas.push(blobData.sha)
    }

    const treeRes = await fetch(`${GITHUB_API}/repos/${repoPath}/git/trees`, {
      method: 'POST',
      headers: { ...headers(), 'Content-Type': 'application/json' },
      body: JSON.stringify({
        base_tree: baseSha,
        tree: files.map((f, i) => ({
          path: f.path,
          mode: '100644',
          type: 'blob',
          sha: blobShas[i],
        })),
      }),
    })
    if (!treeRes.ok) {
      const err = await treeRes.text()
      return { ok: false, error: `GitHub tree ${treeRes.status}: ${err.slice(0, 200)}` }
    }
    const treeData = (await treeRes.json()) as { sha?: string }
    if (!treeData.sha) return { ok: false, error: 'GitHub tree SHA alınamadı.' }

    const commitRes = await fetch(`${GITHUB_API}/repos/${repoPath}/git/commits`, {
      method: 'POST',
      headers: { ...headers(), 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        tree: treeData.sha,
        parents: [baseSha],
      }),
    })
    if (!commitRes.ok) {
      const err = await commitRes.text()
      return { ok: false, error: `GitHub commit ${commitRes.status}: ${err.slice(0, 200)}` }
    }
    const commitData = (await commitRes.json()) as { sha?: string }
    if (!commitData.sha) return { ok: false, error: 'GitHub commit SHA alınamadı.' }

    return {
      ok: true,
      commitSha: commitData.sha,
      ref: `heads/${branch}`,
      repo: repoPath,
    }
  } catch (e) {
    return { ok: false, error: `GitHub istek hatası: ${e instanceof Error ? e.message : String(e)}` }
  }
}

/**
 * Hazırlanan commit'i branch'e push eder (Patron onayı sonrası çağrılır).
 */
export async function githubPush(params: {
  owner: string
  repo: string
  branch?: string
  commitSha: string
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const token = getKey()
  if (!token) return { ok: false, error: 'GITHUB_TOKEN .env içinde tanımlı değil.' }

  const { owner, repo, branch = 'main', commitSha } = params
  const repoPath = `${owner}/${repo}`

  try {
    const res = await fetch(`${GITHUB_API}/repos/${repoPath}/git/refs/heads/${branch}`, {
      method: 'PATCH',
      headers: { ...headers(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ sha: commitSha }),
    })
    if (!res.ok) {
      const err = await res.text()
      return { ok: false, error: `GitHub push ${res.status}: ${err.slice(0, 200)}` }
    }
    return { ok: true }
  } catch (e) {
    return { ok: false, error: `GitHub push hatası: ${e instanceof Error ? e.message : String(e)}` }
  }
}

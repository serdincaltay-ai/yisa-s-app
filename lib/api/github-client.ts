import { Octokit } from '@octokit/rest'

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
})

/**
 * Commit hazırlar (tree ve commit oluşturur).
 */
export async function githubPrepareCommit(params: {
  owner: string
  repo: string
  branch?: string
  message: string
  files: Array<{ path: string; content: string }>
}): Promise<{ ok: true; commitSha: string } | { ok: false; error: string }> {
  const { owner, repo, branch = 'main', message, files } = params

  try {
    // 1. Mevcut branch'in son commit'ini al
    const { data: refData } = await octokit.git.getRef({
      owner,
      repo,
      ref: `heads/${branch}`,
    })
    const latestCommitSha = refData.object.sha

    // 2. Son commit'in tree'sini al
    const { data: commitData } = await octokit.git.getCommit({
      owner,
      repo,
      commit_sha: latestCommitSha,
    })
    const baseTreeSha = commitData.tree.sha

    // 3. Dosyalar için blob oluştur
    const blobs = await Promise.all(
      files.map(async (file) => {
        const { data: blob } = await octokit.git.createBlob({
          owner,
          repo,
          content: Buffer.from(file.content).toString('base64'),
          encoding: 'base64',
        })
        return { path: file.path, sha: blob.sha, mode: '100644' as const, type: 'blob' as const }
      })
    )

    // 4. Yeni tree oluştur
    const { data: newTree } = await octokit.git.createTree({
      owner,
      repo,
      base_tree: baseTreeSha,
      tree: blobs,
    })

    // 5. Yeni commit oluştur
    const { data: newCommit } = await octokit.git.createCommit({
      owner,
      repo,
      message,
      tree: newTree.sha,
      parents: [latestCommitSha],
    })

    return { ok: true, commitSha: newCommit.sha }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return { ok: false, error: `githubPrepareCommit failed: ${errorMessage}` }
  }
}

/**
 * Hazırlanan commit'i branch'e push eder.
 */
export async function githubPush(params: {
  owner: string
  repo: string
  branch: string
  commitSha: string
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const { owner, repo, branch, commitSha } = params

  try {
    await octokit.git.updateRef({
      owner,
      repo,
      ref: `heads/${branch}`,
      sha: commitSha,
    })
    return { ok: true }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return { ok: false, error: `githubPush failed: ${errorMessage}` }
  }
}

/**
 * Dosyaları oluşturup direkt push eder (CEO auto-deploy için).
 */
export async function githubCreateFiles(params: {
  owner: string
  repo: string
  branch?: string
  message: string
  files: Array<{ path: string; content: string }>
}): Promise<{ ok: true; commitSha: string } | { ok: false; error: string }> {
  const prepareResult = await githubPrepareCommit(params)
  if (!prepareResult.ok) {
    return { ok: false, error: prepareResult.error }
  }

  const pushResult = await githubPush({
    owner: params.owner,
    repo: params.repo,
    branch: params.branch ?? 'main',
    commitSha: prepareResult.commitSha,
  })

  if (!pushResult.ok) {
    return { ok: false, error: pushResult.error }
  }

  return { ok: true, commitSha: prepareResult.commitSha }
}

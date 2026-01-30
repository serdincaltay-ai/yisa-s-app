import { Octokit } from '@octokit/rest'

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
})

export async function githubPrepareCommit(params: {
  owner: string
  repo: string
  branch?: string
  message: string
  files: Array<{ path: string; content: string }>
}): Promise<{ ok: true; commitSha: string } | { ok: false; error: string }> {
  const { owner, repo, branch = 'main', message, files } = params

  try {
    const { data: refData } = await octokit.git.getRef({
      owner,
      repo,
      ref: `heads/${branch}`,
    })
    const latestCommitSha = refData.object.sha

    const { data: commitData } = await octokit.git.getCommit({
      owner,
      repo,
      commit_sha: latestCommitSha,
    })
    const baseTreeSha = commitData.tree.sha

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

    const { data: newTree } = await octokit.git.createTree({
      owner,
      repo,
      base_tree: baseTreeSha,
      tree: blobs,
    })

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
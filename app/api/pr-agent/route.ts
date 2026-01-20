import { NextRequest, NextResponse } from 'next/server';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN_FINEGRAINED;
const GITHUB_OWNER = process.env.GITHUB_OWNER || 'serdincaltay-ai';
const GITHUB_REPO = process.env.GITHUB_REPO || 'yisa-s-app';

export async function POST(request: NextRequest) {
  try {
    const { title, body, files, branch } = await request.json();

    if (!GITHUB_TOKEN) {
      return NextResponse.json({ error: 'GitHub token not configured' }, { status: 500 });
    }

    const branchName = branch || `pr-agent/${Date.now()}`;
    
    // 1. Get default branch SHA
    const repoRes = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}`, {
      headers: { Authorization: `Bearer ${GITHUB_TOKEN}` }
    });
    const repoData = await repoRes.json();
    const defaultBranch = repoData.default_branch;

    const refRes = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/ref/heads/${defaultBranch}`, {
      headers: { Authorization: `Bearer ${GITHUB_TOKEN}` }
    });
    const refData = await refRes.json();
    const baseSha = refData.object.sha;

    // 2. Create new branch
    await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/refs`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ref: `refs/heads/${branchName}`, sha: baseSha })
    });

    // 3. Create/update files
    for (const file of files) {
      await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${file.path}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: `Add ${file.path}`,
          content: Buffer.from(file.content).toString('base64'),
          branch: branchName
        })
      });
    }

    // 4. Create PR
    const prRes = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/pulls`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title,
        body,
        head: branchName,
        base: defaultBranch
      })
    });
    const prData = await prRes.json();

    return NextResponse.json({ 
      success: true, 
      pr_url: prData.html_url,
      pr_number: prData.number 
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

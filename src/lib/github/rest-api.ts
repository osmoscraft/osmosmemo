import { b64DecodeUnicode, b64EncodeUnicode } from "../utils/base64.js";

export async function getContentString({ accessToken, username, repo, filename }) {
  const contents = await getContentsOrCreateNew({ accessToken, username, repo, filename });
  const stringResult = b64DecodeUnicode(contents.content ?? "");

  return stringResult;
}

/**
 * Insert content at the first line of the file. An EOL character will be automatically added.
 * @return Updated full markdown string
 */
export async function updateContent(
  { accessToken, username, repo, filename },
  updateFunction: (previousContent: string) => string
) {
  // To reduce chance of conflict, the update function runs on fresh data from API
  const contents = await getContents({ accessToken, username, repo, filename });
  const previousContent = b64DecodeUnicode(contents.content ?? "");
  const resultContent = updateFunction(previousContent);

  await writeContent({ accessToken, username, repo, filename, previousSha: contents.sha, content: resultContent });

  return resultContent;
}

/** currently only work with public repos */
export async function getLibraryUrl({ accessToken, username, repo, filename }) {
  const defaultBranch = await getDefaultBranch({ accessToken, username, repo });

  return `https://github.com/login?return_to=${encodeURIComponent(
    `https://github.com/${username}/${repo}/blob/${defaultBranch}/${filename}`
  )}`;
}

async function writeContent({ accessToken, username, repo, filename, previousSha, content }) {
  return fetch(`https://api.github.com/repos/${username}/${repo}/contents/${filename}`, {
    method: "PUT",
    headers: new Headers({
      Authorization: "Basic " + btoa(`${username}:${accessToken}`),
      "Content-Type": "application/json",
    }),
    body: JSON.stringify({
      message: b64EncodeUnicode(content.substring(0,20)),
      content: b64EncodeUnicode(content),
      sha: previousSha,
    }),
  });
}

async function getContentsOrCreateNew({ accessToken, username, repo, filename }) {
  let response = await getContentsInternal({ accessToken, username, repo, filename });

  if (response.status === 404) {
    console.log(`[rest-api] ${filename} does not exist. Create new`);
    response = await writeContent({ accessToken, username, repo, filename, previousSha: undefined, content: "" });
  }

  if (!response.ok) throw new Error("create-contents-failed");

  return getContents({ accessToken, username, repo, filename });
}

async function getContents({ accessToken, username, repo, filename }) {
  const response = await getContentsInternal({ accessToken, username, repo, filename });
  if (!response.ok) throw new Error("get-contents-failed");

  return response.json();
}

async function getDefaultBranch({ accessToken, username, repo }): Promise<string | null> {
  try {
    const response = await fetch(`https://api.github.com/repos/${username}/${repo}/branches`, {
      headers: new Headers({
        Authorization: "Basic " + btoa(`${username}:${accessToken}`),
        "Content-Type": "application/json",
      }),
    });

    const branches = (await response.json()) as any[];
    if (branches?.length) {
      return branches[0].name as string;
    }
    throw new Error("No branch found");
  } catch (error) {
    return null;
  }
}

async function getContentsInternal({ accessToken, username, repo, filename }) {
  return await fetch(`https://api.github.com/repos/${username}/${repo}/contents/${filename}`, {
    headers: new Headers({
      Authorization: "Basic " + btoa(`${username}:${accessToken}`),
      "Content-Type": "application/json",
    }),
  });
}

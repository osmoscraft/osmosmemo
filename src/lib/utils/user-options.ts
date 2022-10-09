export interface UserOptions {
  tagOptions: string[];
  accessToken: string;
  username: string;
  repo: string;
  filename: string;
}

export async function getUserOptions(): Promise<UserOptions> {
  const options = await chrome.storage.sync.get(["accessToken", "tagOptions", "username", "repo", "filename"]);

  const { accessToken = "", username = "", repo = "", filename = "README.md", tagOptions = [] } = options;
  const safeOptions: UserOptions = {
    accessToken,
    username,
    repo,
    filename,
    tagOptions: tagOptions,
  };

  return safeOptions;
}

export async function setUserOptions(update: Partial<UserOptions>) {
  return chrome.storage.sync.set(update);
}

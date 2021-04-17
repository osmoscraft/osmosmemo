import { browser } from "webextension-polyfill-ts";

export interface UserOptions {
  tags: string[];
  accessToken: string;
  username: string;
  repo: string;
  filename: string;
}

export async function getUserOptions(): Promise<UserOptions> {
  const options = await browser.storage.sync.get(["accessToken", "tags", "username", "repo", "filename"]);

  const { accessToken = "", username = "", repo = "", filename = "", tags = [] } = options;
  const safeOptions: UserOptions = {
    accessToken,
    username,
    repo,
    filename,
    tags,
  };

  return safeOptions;
}

export async function setUserOptions(update: Partial<UserOptions>) {
  return browser.storage.sync.set(update);
}

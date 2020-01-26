import { b64DecodeUnicode } from '../utils/base64.js';

export async function getContent({ accessToken, username, repo, filename }) {
  const response = await fetch(`https://api.github.com/repos/${username}/${repo}/contents/${filename}`, {
    headers: new Headers({
      Authorization: 'Basic ' + btoa(`${username}:${accessToken}`),
      'Content-Type': 'application/json',
    }),
  });

  const responseObject = await response.json();
  const rawResult = responseObject.content;
  const stringResult = b64DecodeUnicode(rawResult);

  return stringResult;
}

export async function writeContent({ accessToken, username, repo, filename, content }) {}

export async function testConnection({ accessToken, username, repo, filename }) {
  const response = await fetch(`https://api.github.com/repos/${username}/${repo}/contents/${filename}`, {
    headers: new Headers({
      Authorization: 'Basic ' + btoa(`${username}:${accessToken}`),
      'Content-Type': 'application/json',
    }),
  });

  return response.ok;
}

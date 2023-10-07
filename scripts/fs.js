import { Dirent } from "fs";
import fs from "fs/promises";
import path from "path";

// credit: https://stackoverflow.com/questions/5827612/node-js-fs-readdir-recursive-directory-search
/**
 *
 * @param {string} dir root dir
 * @returns {Promise<string[]>} a promise of the array of file paths
 */
export async function getFilesRecursive(dir) {
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    dirents.map((dirent) => {
      const res = path.resolve(dir, dirent.name);
      return dirent.isDirectory() ? getFilesRecursive(res) : res;
    })
  );
  return files.flat();
}

/**
 *
 * @param {string} dir root dir
 * @returns {Promise<string[]>} a promise of the array of file paths
 */
export async function getDirsRecursive(dir) {
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  const dirs = await Promise.all(
    dirents.flatMap((dirent) => {
      const itemPath = path.resolve(dir, dirent.name);
      return dirent.isDirectory() ? [itemPath, getDirsRecursive(itemPath)] : [];
    })
  );
  return [path.resolve(dir), ...dirs].flat();
}

/**
 *
 * @param {string} dir
 * @param {(file: Dirent) => boolean} predicate including extension
 */
export async function filterDir(dir, predicate) {
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  return dirents.filter((file) => predicate(file));
}

/**
 *
 * @param {string} dir
 * @param {Dirent} entry
 * @returns {string}
 */
export function getDirEntryPath(dir, entry) {
  return path.join(dir, entry.name);
}

/**
 *
 * @param {string} srcDir
 * @param {string} targetDir
 */
export async function copyDir(srcDir, targetDir) {
  const srcPaths = await getFilesRecursive(srcDir);
  /** @type {string[]} */
  const targetPaths = [];

  await Promise.all(
    srcPaths.map(async (srcPath) => {
      const relativeToSrcDir = path.relative(srcDir, srcPath);
      const targetPath = path.join(targetDir, relativeToSrcDir);
      const targetPathParent = path.dirname(targetPath);
      await fs.mkdir(targetPathParent, { recursive: true });
      await fs.copyFile(srcPath, targetPath);
      targetPaths.push(targetPath);
    })
  );

  return {
    srcPaths,
    targetPaths,
  };
}

/**
 *
 * @param {string} dir
 */
export async function rmDir(dir) {
  try {
    await fs.stat(dir);
    await fs.rm(path.resolve(dir), { recursive: true });
  } catch {}
}

/**
 *
 * @param {string} path
 */
export async function readJson(path) {
  return JSON.parse(await fs.readFile(path, "utf-8"));
}

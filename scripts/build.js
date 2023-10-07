const path = require("path");
const fs = require("fs/promises");

const OUT_DIR = `dist`;
const UNPACKED_OUT_DIR = `dist/unpacked`;

const isDevMode = process.argv.includes("--dev");

async function build() {
  console.log("[build] start building extension...");

  console.log(`[build] remove ${OUT_DIR}`);
  await fs.rm(path.resolve(OUT_DIR), { recursive: true, force: true });

  await require("esbuild")
    .build({
      entryPoints: ["src/content-script.ts", "src/popup/popup.ts", "src/options/options.ts"],
      bundle: true,
      format: "esm",
      sourcemap: true,
      outdir: UNPACKED_OUT_DIR,
      watch: isDevMode
        ? {
            onRebuild: (error) => {
              if (error) {
                console.error(`[watch] rebuild error`, error);
              } else {
                console.log(`[watch] rebuild success`);
              }
            },
          }
        : false,
    })
    .catch(() => process.exit(1));

  const copyTasksAsync = [
    fs.cp(path.resolve("src/options.html"), path.join(UNPACKED_OUT_DIR, "options.html")),
    fs.cp(path.resolve("src/popup.html"), path.join(UNPACKED_OUT_DIR, "popup.html")),
    fs.cp(path.resolve("src/manifest.json"), path.join(UNPACKED_OUT_DIR, "manifest.json")),
    fs.cp(path.resolve("src/styles.css"), path.join(UNPACKED_OUT_DIR, "styles.css")),
    fs.cp(path.resolve("src/assets"), path.join(UNPACKED_OUT_DIR, "assets"), { recursive: true }),
  ];

  await Promise.all(copyTasksAsync);
  console.log("[build] assets copied");
}

build();

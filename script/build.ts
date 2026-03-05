import { build as esbuild } from "esbuild";
import { build as viteBuild } from "vite";
import { rm, readFile } from "fs/promises";

interface PackageManifest {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

// server deps to bundle to reduce openat(2) syscalls
// which helps cold start times
const allowlist = [
  "@google/generative-ai",
  "axios",
  "connect-pg-simple",
  "cors",
  "date-fns",
  "drizzle-orm",
  "drizzle-zod",
  "express",
  "express-rate-limit",
  "express-session",
  "jsonwebtoken",
  "memorystore",
  "multer",
  "nanoid",
  "nodemailer",
  "openai",
  "passport",
  "passport-local",
  "pg",
  "stripe",
  "stripe-replit-sync",
  "uuid",
  "ws",
  "xlsx",
  "zod",
  "zod-validation-error",
];

const forceExternals = [
  "adminjs",
  "@adminjs/express",
  "@adminjs/passwords",
  "@adminjs/upload",
  "adminjs-drizzle",
  "express-formidable",
];

async function buildAll() {
  await rm("dist", { recursive: true, force: true });

  console.log("building client...");
  await viteBuild();

  console.log("building server...");
  const pkg = JSON.parse(await readFile("package.json", "utf-8")) as PackageManifest;
  const allDeps = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.devDependencies || {}),
  ];
  const externals = Array.from(
    new Set([
      ...allDeps.filter((dep) => !allowlist.includes(dep)),
      ...forceExternals,
    ]),
  );

  await esbuild({
    entryPoints: ["server/index.ts"],
    platform: "node",
    bundle: true,
    format: "cjs",
    outfile: "dist/index.cjs",
    banner: {
      js: [
        `var __import_meta_url = typeof document === 'undefined' ? require('url').pathToFileURL(__filename).href : (document.currentScript && document.currentScript.src || new URL('index.cjs', document.baseURI).href);`,
        `var __import_meta_dirname = typeof __dirname !== 'undefined' ? __dirname : require('path').dirname(require('url').fileURLToPath(__import_meta_url));`,
      ].join("\n"),
    },
    define: {
      "process.env.NODE_ENV": '"production"',
      "import.meta.url": "__import_meta_url",
      "import.meta.dirname": "__import_meta_dirname",
    },
    minify: true,
    external: externals,
    logLevel: "info",
  });
}

buildAll().catch((err) => {
  console.error(err);
  process.exit(1);
});

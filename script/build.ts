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
  "drizzle-orm",
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
    format: "esm",
    outfile: "dist/index.mjs",
    banner: {
      js: [
        `import { createRequire as __createRequire } from 'module';`,
        `import { fileURLToPath as __fileURLToPath } from 'url';`,
        `import { dirname as __pathDirname } from 'path';`,
        `const require = __createRequire(import.meta.url);`,
        `const __filename = __fileURLToPath(import.meta.url);`,
        `const __dirname = __pathDirname(__filename);`,
      ].join("\n"),
    },
    define: {
      "process.env.NODE_ENV": '"production"',
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

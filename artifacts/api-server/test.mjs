import { build } from "esbuild";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const entry = fileURLToPath(new URL("./src/security.test.ts", import.meta.url));
const output = fileURLToPath(new URL("./dist/security.test.mjs", import.meta.url));
await build({
  entryPoints: [entry], outfile: output, bundle: true, platform: "node", format: "esm",
  external: ["pg-native", "pino", "pino-http"],
  banner: { js: "import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);" },
});
const result = spawnSync(process.execPath, [output], {
  stdio: "inherit", env: { ...process.env, NODE_ENV: "test", LOG_LEVEL: "silent" },
});
process.exit(result.status ?? 1);

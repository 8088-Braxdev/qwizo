const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");
const root = path.join(__dirname, "..");
const required = [
  "package.json", "tsconfig.json", "next.config.ts", "tailwind.config.ts",
  "src/app/layout.tsx", "src/app/page.tsx", "src/lib/data/store.ts",
];
for (const f of required) {
  assert.ok(fs.existsSync(path.join(root, f)), `missing ${f}`);
}
console.log("smoke: ok");

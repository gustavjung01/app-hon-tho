import { writeFileSync } from "node:fs";
import { join } from "node:path";

const builtAt = new Date().toISOString();
const version = {
  version: builtAt,
  builtAt
};

writeFileSync(
  join(process.cwd(), "public", "app-version.json"),
  JSON.stringify(version, null, 2) + "\n"
);

console.log("Generated app-version.json", version.version);

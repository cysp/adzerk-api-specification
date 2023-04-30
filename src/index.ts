import path from "node:path";
import { cwd } from "node:process";
import { applyFixes } from "./lib/apply-fixes";
import { embedRefs } from "./lib/embed-refs";
import { makeOperationId } from "./lib/operation-id";
import { readYamlFile, writeYamlFile } from "./lib/yaml-file";

async function main() {
  const base = path.join(cwd(), "adzerk-api-specification/management/");

  const combined = {
    openapi: "3.0.1",
    info: {
      title: "Adzerk Management API",
      description: "Adzerk Management API",
      version: "1.0",
    },
    servers: [
      {
        url: "https://api.adzerk.net",
      },
    ],
    paths: {},
    schemas: {},
    components: {
      schemas: {},
      securitySchemes: {
        ApiKeyAuth: {
          type: "apiKey",
          in: "header",
          name: "X-Adzerk-ApiKey",
        },
      },
    },
  };

  for (const entityName of [
    "ad-type",
    "channel",
    "channel-site-map",
    "creative-template",
    "site",
    "zone",
  ]) {
    const filename = `${entityName}.yaml`;
    const doc = await readYamlFile(path.join(base, filename));
    for (const [, operations] of Object.entries(doc.paths)) {
      for (const [, operation] of Object.entries(operations as any) as any) {
        operation.operationId = makeOperationId(
          operation.operationId,
          entityName,
          operation.operationId === "list" ? "plural" : "singular"
        );
      }
    }
    Object.assign(combined.paths, doc.paths);
  }

  await embedRefs(combined, base);

  applyFixes(combined);

  await writeYamlFile("management/openapi-3.yaml", combined);
}

void main();

import path from "node:path";
import { readYamlFile } from "./yaml-file";

export async function embedRefs(doc: any, base: string): Promise<void> {
  return _embedRefs(doc, doc, base);
}

async function _embedRefs(doc: any, obj: any, base: string): Promise<void> {
  if (typeof obj === "object") {
    if (obj.$ref) {
      const [referencePath, reference] = obj.$ref.split("#");
      if (referencePath) {
        const referencedDocument = await readYamlFile(
          path.join(base, referencePath)
        );
        Object.assign(doc.components.schemas, referencedDocument.schemas);
      }

      obj["$ref"] = `#/components${reference}`;
    } else {
      for (const [key, value] of Object.entries(obj)) {
        await _embedRefs(doc, value, base);
      }
    }
  }
}

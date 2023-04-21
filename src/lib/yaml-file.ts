import { readFile, writeFile } from "node:fs/promises";
import { parse, stringify } from "yaml";

export async function readYamlFile(path: string): Promise<any> {
  const src = await readFile(path, "utf8");
  return parse(src);
}

export async function writeYamlFile(file: string, value: any): Promise<void> {
  const data = stringify(value, { sortMapEntries: true });
  await writeFile(file, data);
}

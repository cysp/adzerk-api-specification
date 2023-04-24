export function applyFixes(doc: any) {
  for (const [, schema] of Object.entries(doc["components"]["schemas"])) {
    applySchemaFixes(schema);
  }

  for (const [, operations] of Object.entries(doc.paths)) {
    for (const [, operation] of Object.entries(operations as any) as any) {
      // const requiredProperties =
      //   requiredOperationRequestSchemaProperties[operation.operationId];

      const schema =
        operation["requestBody"]?.["content"]?.["application/json"]?.["schema"];

      const optionalRequestSchemaProperties =
        optionalOperationRequestSchemaProperties[operation.operationId];
      if (optionalRequestSchemaProperties) {
        for (const name of optionalRequestSchemaProperties) {
          schema["properties"][name]["nullable"] = true;
        }
      }

      if (schema) {
        applySchemaFixes(schema);
      }
      // if (requiredProperties) {
      //   operation["requestBody"]["content"]["application/json"]["schema"][
      //     "required"
      //   ] = requiredProperties;
      // }
    }
  }
}

const optionalOperationRequestSchemaProperties = {
  createChannel: ["AdTypes"],
  updateChannel: ["AdTypes"],
};

function applySchemaFixes(schema: any) {
  if (schema["properties"]["Id"]) {
    delete schema["properties"]["Id"]["nullable"];
  }
  if (!schema["required"]) {
    schema["required"] = Object.entries(schema["properties"])
      .filter(([, property]) => !property["nullable"])
      .map(([name]) => name);
  }
  for (const [, property] of Object.entries(schema["properties"])) {
    delete property["nullable"];
  }
}

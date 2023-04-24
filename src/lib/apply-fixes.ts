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

      if (schema) {
        const optionalRequestSchemaProperties =
          optionalOperationRequestSchemaProperties[operation.operationId];
        if (optionalRequestSchemaProperties) {
          for (const name of optionalRequestSchemaProperties) {
            const property = schema["properties"][name];
            if (property) {
              property["nullable"] = true;
            }
          }
        }

        applySchemaFixes(schema);
      }
    }
  }
}

const optionalOperationRequestSchemaProperties = {
  createAdType: ["Name"],
  createForChannelAdType: ["Name"],
  createChannel: ["AdTypes", "IsDeleted"],
  updateChannel: ["AdTypes", "IsDeleted"],
};

function applySchemaFixes(schema: any) {
  if (schema["properties"]["Id"]) {
    delete schema["properties"]["Id"]["nullable"];
  }

  schema["required"] = Object.entries(schema["properties"])
    .filter(([, property]) => !property["nullable"])
    .map(([name]) => name);

  for (const [, property] of Object.entries(schema["properties"])) {
    delete property["nullable"];
  }
}

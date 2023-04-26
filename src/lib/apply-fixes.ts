export function applyFixes(doc: any) {
  for (const [, schema] of Object.entries(doc["components"]["schemas"])) {
    applySchemaFixes(schema);
  }

  if (!doc["components"]["schemas"]["AnyValue"]) {
    doc["components"]["schemas"]["AnyValue"] = {};
  }

  if (doc["paths"]["/v2/creative-templates/{id}/update"]?.["post"]) {
    const creativeTemplateUpdateOperationSchema =
      doc["paths"]["/v2/creative-templates/{id}/update"]["post"].requestBody
        .content["application/json"].schema.properties.Updates.items;
    creativeTemplateUpdateOperationSchema.properties.Value = {
      $ref: "#/components/schemas/AnyValue",
    };
    creativeTemplateUpdateOperationSchema.required = ["Path", "Value"];
    doc["components"]["schemas"]["CreativeTemplateUpdateOperation"] =
      creativeTemplateUpdateOperationSchema;

    doc["paths"]["/v2/creative-templates/{id}/update"][
      "post"
    ].requestBody.content["application/json"].schema.properties.Updates.items =
      {
        $ref: "#/components/schemas/CreativeTemplateUpdateOperation",
      };
  }

  for (const [, operations] of Object.entries(doc.paths)) {
    for (const [, operation] of Object.entries(operations as any) as any) {
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
  createChannel: ["IsDeleted"],
  updateChannel: ["IsDeleted"],
};

function applySchemaFixes(schema: any) {
  if (schema["properties"]["Id"]) {
    delete schema["properties"]["Id"]["nullable"];
  }

  schema["required"] = Object.entries(schema["properties"])
    .filter(([, property]) => !property["nullable"])
    .map(([name]) => name)
    .sort();

  for (const [, property] of Object.entries(schema["properties"])) {
    delete property["nullable"];
  }
}

export function makeOperationId(
  operationId: string,
  entityName: string,
  n: "singular" | "plural"
) {
  const entityNameComponents = entityName.split("-");

  const operationEntityNameSuffix = entityNameComponents
    .map((part) => {
      return part[0].toUpperCase() + part.slice(1);
    })
    .join("");

  let suffix: string;
  switch (n) {
    case "singular":
      suffix = "";
      break;
    case "plural":
      suffix = "s";
      break;
  }

  return `${operationId}${operationEntityNameSuffix}${suffix}`;
}

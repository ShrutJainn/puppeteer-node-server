export class ReadPropertyFromJson {
  static async execute(inputs: Record<string, any>): Promise<string> {
    const json = inputs["JSON"];
    const propertyName = inputs["Property Name"];
    console.log("property name : ", propertyName);

    const parsedJson = JSON.parse(json);
    const property = parsedJson[propertyName];
    if (property === undefined) throw new Error("Property not found");
    return property;
  }
}

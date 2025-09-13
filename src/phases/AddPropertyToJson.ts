import { Browser, Page } from "puppeteer";

export class AddPropertyToJson {
  static async execute(inputs: Record<string, any>): Promise<string> {
    const json = inputs["JSON"];
    const propertyName = inputs["Property Name"];
    const propertyValue = inputs["Property Value"];

    if (!json || !propertyName || !propertyValue)
      throw new Error("Invalid inputs for Add Property to JSON task");

    const parsedJson = JSON.parse(json);
    parsedJson[propertyName] = propertyValue;
    return JSON.stringify(parsedJson);
  }
}

export class ExtractTextFromElement {
  static async execute(inputs: Record<string, any>): Promise<string> {
    const html = inputs["Html"];
    const selector = inputs["Selector"];

    const cheerio = require("cheerio");
    const $ = cheerio.load(html);

    const element = $(selector);
    if (element.length === 0) {
      return "Element Not found";
    }

    return element.text().trim() || "Element Not found";
  }
}

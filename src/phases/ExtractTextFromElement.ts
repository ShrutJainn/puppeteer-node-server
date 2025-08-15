export class ExtractTextFromElement {
  static async execute(inputs: Record<string, any>): Promise<string> {
    const html = inputs["Html"];
    const selector = inputs["Selector"];
    // Use DOM parsing or Cheerio here
    const cheerio = require("cheerio");
    const $ = cheerio.load(html);
    return $(selector).text();
  }
}

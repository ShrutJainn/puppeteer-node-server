import { Browser, Page } from "puppeteer";

export class PageToHtml {
  static async execute(inputs: Record<string, any>): Promise<string> {
    const page: Page = inputs["Web page"];
    return await page.content();
  }
}

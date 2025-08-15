import puppeteer, { Browser, Page } from "puppeteer";

export class LaunchBrowser {
  static async execute(inputs: Record<string, any>): Promise<Page> {
    const url = inputs["Website Url"];
    const browser: Browser = await puppeteer.launch({ headless: true });
    const page: Page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });
    return page;
  }
}

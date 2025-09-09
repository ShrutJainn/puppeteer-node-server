import puppeteer, { Browser, Page } from "puppeteer";

// export class LaunchBrowser {
//   static async execute(inputs: Record<string, any>): Promise<Page> {
//     const url = inputs["Website Url"];
//     const browser: Browser = await puppeteer.launch({ headless: true });
//     const page: Page = await browser.newPage();
//     await page.goto(url, { waitUntil: "networkidle2" });
//     return page;
//   }
// }

export class LaunchBrowser {
  static async execute(inputs: Record<string, any>): Promise<Page> {
    const inputUrl = inputs["Website Url"];
    const url = inputUrl.startsWith("https://")
      ? inputUrl
      : "https://" + inputUrl;
    const browser: Browser = await puppeteer.launch({ headless: false });
    const page: Page = await browser.newPage();
    try {
      await page.goto(url, { waitUntil: "networkidle2" });
    } catch (err: any) {
      await browser.close();
      throw new Error(
        "Invalid URL provided. The browser can't navigate to " + url
      );
    }
    return page;
  }
}

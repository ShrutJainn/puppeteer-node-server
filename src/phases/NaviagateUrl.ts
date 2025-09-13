import { Browser, Page } from "puppeteer";

export class NavigateUrl {
  static async execute(inputs: Record<string, any>): Promise<Page> {
    const page: Page = inputs["Web page"];
    const url = inputs["URL"];

    if (!page || !url)
      throw new Error("Invalid inputs for Add Property to JSON task");

    try {
      await page.goto(url, { waitUntil: "networkidle2" });
    } catch (err: any) {
      throw new Error(
        "Invalid URL provided. The browser can't navigate to " + url
      );
    }
    return page;
  }
}

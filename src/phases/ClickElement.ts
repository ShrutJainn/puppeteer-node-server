import { Page } from "puppeteer";

export class ClickElement {
  static async execute(inputs: Record<string, any>): Promise<Page> {
    const page: Page = inputs["Web page"];
    const selector: string = inputs["Selector"];

    await Promise.all([
      page.waitForNavigation({ waitUntil: "networkidle0" }),
      page.click(selector),
    ]);

    return page;
  }
}

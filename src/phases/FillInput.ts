import { Page } from "puppeteer";

export class FillInput {
  static async execute(inputs: Record<string, any>): Promise<Page> {
    const page: Page = inputs["Web page"];
    const selector: string = inputs["Selector"];
    const value: string = inputs["Value"];

    if (!selector) throw new Error("Selector is empty");
    if (!value) throw new Error("Value is empty");

    await page.evaluate((sel) => {
      const el = document.querySelector(sel) as HTMLInputElement;
      if (el) el.value = "";
    }, selector);

    await page.type(selector, value);
    return page;
  }
}

import { Page } from "puppeteer";

export class ScrollToElement {
  static async execute(inputs: Record<string, any>): Promise<Page> {
    const page: Page = inputs["Web page"];
    const selector: string = inputs["Selector"];

    // await Promise.all([
    //   page.waitForNavigation({ waitUntil: "networkidle0" }),
    //   page.click(selector),
    // ]);

    await page.evaluate((selector) => {
      const element = document.querySelector(selector);
      if (!element)
        throw new Error("Element not found in Scroll To Element task");
      const top = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top });
    }, selector);

    return page;
  }
}

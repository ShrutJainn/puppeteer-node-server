// src/phases/index.ts
import { LaunchBrowser } from "./LaunchBrowser";
import { PageToHtml } from "./PageToHtml";
import { ExtractTextFromElement } from "./ExtractTextFromElement";

export const phaseRegistry: Record<string, any> = {
  LAUNCH_BROWSER: LaunchBrowser,
  PAGE_TO_HTML: PageToHtml,
  EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElement,
};

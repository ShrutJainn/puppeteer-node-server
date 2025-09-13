import { LaunchBrowser } from "../phases/LaunchBrowser";
import { PageToHtml } from "../phases/PageToHtml";
import { ExtractTextFromElement } from "../phases/ExtractTextFromElement";
import { Environment } from "../types/Environment";
import { FillInput } from "../phases/FillInput";
import { ClickElement } from "../phases/ClickElement";
import { DeliverViaWebhook } from "../phases/DeliverViaWebhook";
import { ExtractDataWithAI } from "../phases/ExtractDataWithAI";
import { ReadPropertyFromJson } from "../phases/ReadPropertyFromJson";
import { TaskType } from "../types/TaskType";
import { AddPropertyToJson } from "../phases/AddPropertyToJson";
import { NavigateUrl } from "../phases/NaviagateUrl";
import { ScrollToElement } from "../phases/ScrollToElement";
import { Browser, Page } from "puppeteer";

export class PhaseExecutor {
  private static async resolveRef(env: Environment, ref: string) {
    const refId = ref.replace("$ref:", "");
    const output = env.phases[refId]?.outputs;
    if (output === undefined) {
      throw new Error(`Unresolved reference: ${ref} (no outputs found)`);
    }
    return output;
  }
  static async run(environment: Environment): Promise<Environment> {
    console.log("environment : ", environment);

    let browser: Browser | null = null;

    try {
      for (const [phaseId, phase] of Object.entries(environment.phases)) {
        const resolvedInputs: Record<string, any> = {};
        for (const [key, value] of Object.entries(phase.inputs ?? {})) {
          resolvedInputs[key] =
            typeof value === "string" && value.startsWith("$ref:")
              ? await this.resolveRef(environment, value)
              : value;
        }

        let output: any;
        switch (phase.type) {
          case TaskType.LAUNCH_BROWSER: {
            const { browser: b, page } = await LaunchBrowser.execute(
              resolvedInputs
            );
            browser = b;
            output = page;
            break;
          }
          case TaskType.PAGE_TO_HTML:
            output = await PageToHtml.execute(resolvedInputs);
            break;
          case TaskType.EXTRACT_TEXT_FROM_ELEMENT:
            output = await ExtractTextFromElement.execute(resolvedInputs);
            break;
          case TaskType.FILL_INPUT:
            output = await FillInput.execute(resolvedInputs);
            break;
          case TaskType.CLICK_ELEMENT:
            output = await ClickElement.execute(resolvedInputs);
            break;
          case TaskType.DELIVER_VIA_WEBHOOK:
            output = await DeliverViaWebhook.execute(resolvedInputs);
            break;
          case TaskType.EXTRACT_DATA_WITH_AI:
            output = await ExtractDataWithAI.execute(resolvedInputs);
            break;
          case TaskType.READ_PROPERTY_FROM_JSON:
            output = await ReadPropertyFromJson.execute(resolvedInputs);
            break;
          case TaskType.ADD_PROPERTY_TO_JSON:
            output = await AddPropertyToJson.execute(resolvedInputs);
            break;
          case TaskType.NAVIGATE_URL:
            output = await NavigateUrl.execute(resolvedInputs);
            break;
          case TaskType.SCROLL_TO_ELEMENT:
            output = await ScrollToElement.execute(resolvedInputs);
            break;
          default:
            throw new Error(`Unknown phase type: ${phase.type}`);
        }

        phase.outputs = output;
      }

      const resultEnv: Environment = JSON.parse(JSON.stringify(environment));

      for (const [phaseId, phase] of Object.entries(resultEnv.phases)) {
        if (
          phase.type === "LAUNCH_BROWSER" ||
          phase.type === "FILL_INPUT" ||
          phase.type === "CLICK_ELEMENT" ||
          phase.type === "NAVIGATE_URL" ||
          phase.type === "SCROLL_TO_ELEMENT"
        ) {
          phase.outputs = "Browser Page";
        }
      }

      return resultEnv;
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }
}

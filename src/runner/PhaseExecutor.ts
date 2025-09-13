import { LaunchBrowser } from "../phases/LaunchBrowser";
import { PageToHtml } from "../phases/PageToHtml";
import { ExtractTextFromElement } from "../phases/ExtractTextFromElement";
import { Environment } from "../types/Environment";
import { FillInput } from "../phases/FillInput";
import { ClickElement } from "../phases/ClickElement";
import { DeliverViaWebhook } from "../phases/DeliverViaWebhook";
import { ExtractDataWithAI } from "../phases/ExtractDataWithAI";
import { ReadPropertyFromJson } from "../phases/ReadPropertyFromJson";

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
    for (const [phaseId, phase] of Object.entries(environment.phases)) {
      try {
        const resolvedInputs: Record<string, any> = {};
        for (const [key, value] of Object.entries(phase.inputs ?? {})) {
          resolvedInputs[key] =
            typeof value === "string" && value.startsWith("$ref:")
              ? await this.resolveRef(environment, value)
              : value;
        }

        let output: any;
        switch (phase.type) {
          case "LAUNCH_BROWSER":
            output = await LaunchBrowser.execute(resolvedInputs);
            break;
          case "PAGE_TO_HTML":
            output = await PageToHtml.execute(resolvedInputs);
            break;
          case "EXTRACT_TEXT_FROM_ELEMENT":
            output = await ExtractTextFromElement.execute(resolvedInputs);
            break;
          case "FILL_INPUT":
            output = await FillInput.execute(resolvedInputs);
            break;
          case "CLICK_ELEMENT":
            output = await ClickElement.execute(resolvedInputs);
            break;
          case "DELIVER_VIA_WEBHOOK":
            output = await DeliverViaWebhook.execute(resolvedInputs);
            break;
          case "EXTRACT_DATA_WITH_AI":
            output = await ExtractDataWithAI.execute(resolvedInputs);
            break;
          case "READ_PROPERTY_FROM_JSON":
            output = await ReadPropertyFromJson.execute(resolvedInputs);
            break;
          default:
            throw new Error(`Unknown phase type: ${phase.type}`);
        }

        phase.outputs = output;
      } catch (err: any) {
        console.log("err : ", err);
        const friendlyMessage =
          phase.type === "LAUNCH_BROWSER" &&
          err?.message?.includes("Cannot navigate")
            ? "Invalid URL provided. The browser can't navigate to " +
              phase.inputs["Website Url"]
            : err?.message || "Phase execution failed";

        phase.error = friendlyMessage;

        throw new Error(friendlyMessage);
      }
    }

    const resultEnv: Environment = JSON.parse(JSON.stringify(environment));

    for (const [phaseId, phase] of Object.entries(resultEnv.phases)) {
      if (
        phase.type === "LAUNCH_BROWSER" ||
        phase.type === "FILL_INPUT" ||
        phase.type === "CLICK_ELEMENT"
      ) {
        phase.outputs = "Browser Page";
      }
    }

    return resultEnv;
  }
}

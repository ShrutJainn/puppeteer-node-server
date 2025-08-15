import { LaunchBrowser } from "../phases/LaunchBrowser";
import { PageToHtml } from "../phases/PageToHtml";
import { ExtractTextFromElement } from "../phases/ExtractTextFromElement";
import { Environment } from "../types/Environment";

export class PhaseExecutor {
  private static async resolveRef(env: Environment, ref: string) {
    const refId = ref.replace("$ref:", "");
    return env.phases[refId]?.outputs;
  }

  static async run(environment: Environment): Promise<Environment> {
    for (const [phaseId, phase] of Object.entries(environment.phases)) {
      const resolvedInputs: Record<string, any> = {};

      const inputs = phase.inputs ?? {};

      // Resolve all inputs (handling $ref)
      for (const [key, value] of Object.entries(inputs)) {
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
        default:
          throw new Error(`Unknown phase type: ${phase.type}`);
      }

      phase.outputs = output;
    }

    return environment;
  }
}

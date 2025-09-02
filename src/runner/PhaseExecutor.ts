import { LaunchBrowser } from "../phases/LaunchBrowser";
import { PageToHtml } from "../phases/PageToHtml";
import { ExtractTextFromElement } from "../phases/ExtractTextFromElement";
import { Environment } from "../types/Environment";

export class PhaseExecutor {
  private static async resolveRef(env: Environment, ref: string) {
    const refId = ref.replace("$ref:", "");
    return env.phases[refId]?.outputs;
  }

  // static async run(environment: Environment): Promise<Environment> {
  //   for (const [phaseId, phase] of Object.entries(environment.phases)) {
  //     const resolvedInputs: Record<string, any> = {};

  //     const inputs = phase.inputs ?? {};

  //     // Resolve all inputs (handling $ref)
  //     for (const [key, value] of Object.entries(inputs)) {
  //       resolvedInputs[key] =
  //         typeof value === "string" && value.startsWith("$ref:")
  //           ? await this.resolveRef(environment, value)
  //           : value;
  //     }

  //     let output: any;

  //     switch (phase.type) {
  //       case "LAUNCH_BROWSER":
  //         output = await LaunchBrowser.execute(resolvedInputs);
  //         break;
  //       case "PAGE_TO_HTML":
  //         output = await PageToHtml.execute(resolvedInputs);
  //         break;
  //       case "EXTRACT_TEXT_FROM_ELEMENT":
  //         output = await ExtractTextFromElement.execute(resolvedInputs);
  //         break;
  //       default:
  //         throw new Error(`Unknown phase type: ${phase.type}`);
  //     }

  //     phase.outputs = output;
  //   }

  //   for (const [phaseId, phase] of Object.entries(environment.phases)) {
  //     if (phase.type === "LAUNCH_BROWSER") phase.outputs = "Browser";
  //   }

  //   return environment;
  // }

  static async run(environment: Environment): Promise<Environment> {
    console.log("hi there");
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
          default:
            throw new Error(`Unknown phase type: ${phase.type}`);
        }

        phase.outputs = output;
      } catch (err: any) {
        console.log("err : ", err);
        const friendlyMessage =
          phase.type === "LAUNCH_BROWSER" &&
          err?.message?.includes("Cannot navigate")
            ? "Invalid URL provided. The browser can't navigate to" +
              phase.inputs["Website Url"]
            : err?.message || "Phase execution failed";

        phase.error = friendlyMessage;

        throw new Error(friendlyMessage);
      }
    }

    return environment;
  }
}

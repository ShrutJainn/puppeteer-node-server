import { phaseRegistry } from "../phases";
import { Environment } from "../types/environment";

export class EnvironmentExecutor {
  constructor(private environment: Environment) {}

  private resolveInput(value: any): any {
    if (typeof value === "string" && value.startsWith("$ref:")) {
      const refId = value.replace("$ref:", "");
      return this.environment.phases[refId].outputs;
    }
    return value;
  }

  async executeAll(): Promise<Environment> {
    for (const [phaseId, phase] of Object.entries(this.environment.phases)) {
      const handler = phaseRegistry[phase.type];
      if (!handler) throw new Error(`No handler found for type: ${phase.type}`);

      const resolvedInputs: Record<string, any> = {};
      for (const [key, val] of Object.entries(phase.inputs)) {
        resolvedInputs[key] = this.resolveInput(val);
      }

      const output = await handler.execute(resolvedInputs);
      this.environment.phases[phaseId].outputs = output;
    }
    return this.environment;
  }
}

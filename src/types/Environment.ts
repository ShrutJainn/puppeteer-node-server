export interface Phase {
  type: string;
  inputs: Record<string, any>;
  outputs: any;
}

export interface Environment {
  phases: Record<string, Phase>;
}

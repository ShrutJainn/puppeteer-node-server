export interface Phase {
  type: string;
  inputs: Record<string, any>;
  outputs: any;
  error?: string;
}

export interface Environment {
  phases: Record<string, Phase>;
}

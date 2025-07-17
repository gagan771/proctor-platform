// In: utils/types.ts

export interface ProblemExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface ProblemDescription {
  main: string;
  examples: ProblemExample[];
  constraints: string[];
} 
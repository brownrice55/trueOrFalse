export type Inputs = {
  category: string;
  type: string;
  question: string;
  answer: string;
  numberOfOptions: number;
  options: [number, string][];
  explanation: string;
  priority: string;
};

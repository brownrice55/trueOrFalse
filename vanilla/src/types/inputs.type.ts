export type Inputs = {
  category: string;
  type: string;
  question: string;
  answer: number;
  numberOfOptions: number;
  options: [boolean, string][];
  explanation: string;
  priority: string;
  notes: string;
  numberOfCorrectAnswers: number;
  numberOfAnswers: number;
};

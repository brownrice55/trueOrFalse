export type InputsForResult = {
  id: number;
  type: string;
  question: string;
  answer: number;
  numberOfOptions: number;
  options: [boolean, string][];
  explanation: string;
  notes: string;
  isCorrectAnswer: boolean;
  answerForDisplay: string;
};

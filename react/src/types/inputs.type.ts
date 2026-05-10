export type Inputs = {
  id: number;
  category: number;
  type: number;
  question: string;
  answer: boolean[];
  numberOfOptions: number;
  options: { isActive: boolean; value: string }[];
  explanation: string;
  priority: number;
  notes: string;
  areCorrectAnswers: boolean[] | [];
};

export type InputsOmit = Omit<Inputs, "areCorrectAnswers">;

export type InputsForResult = {
  id: number;
  type: number;
  question: string;
  answer: boolean[];
  numberOfOptions: number;
  options: { isActive: boolean; value: string }[];
  explanation: string;
  notes: string;
  isCorrectAnswer: boolean;
  answerForDisplay: string;
};

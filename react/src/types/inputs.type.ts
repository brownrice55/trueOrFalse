export type Inputs = {
  category: number;
  type: number;
  question: string;
  answer: boolean[];
  explanation: string;
  priority: number;
  numberOfOptions: number;
  notes: string;
  areCorrectAnswers: boolean[] | [];
};

export type InputsOmit = Omit<Inputs, "answer" | "areCorrectAnswers">;

import type { Inputs, InputsForResult } from "../types/inputs.type";
import { answerArrayText } from "./labels";

const getAnswerOfSelectionForDisplay = (aCurrentVal: Inputs) => {
  let answerOfSelection = "";
  aCurrentVal.options.forEach((arr) => {
    if (arr.isActive === true) {
      if (answerOfSelection) {
        answerOfSelection += "、";
      }
      answerOfSelection += arr.value;
    }
  });
  return answerOfSelection;
};

const getRandomIndexArray = function (aLength: number) {
  const len = aLength;
  const array = [];
  for (let cnt = 0; cnt < len; ++cnt) {
    array[cnt] = cnt;
  }
  for (let cnt = len - 1; cnt > 0; --cnt) {
    const random = Math.floor(Math.random() * (cnt + 1));
    [array[cnt], array[random]] = [array[random], array[cnt]];
  }
  return array;
};

const retrieveNecessaryData = (
  aQuizData: Map<number, Inputs>,
  aCategory: number,
  aType: number,
  aNumberOfQuestions: number,
  aPriority: number,
) => {
  const necessaryData: Map<number, InputsForResult> = new Map();
  const keys: number[] = [...aQuizData.keys()];
  const randomIndices: number[] =
    aPriority === 0 ? getRandomIndexArray(keys.length) : [];

  const data =
    aPriority === 0
      ? new Map(aQuizData)
      : new Map(
          [...aQuizData.entries()]
            .sort((a, b) => b[1].priority - a[1].priority)
            .map(([_, val], cnt) => [cnt, val]),
        );

  let cnt = 0;
  data.forEach((val: Inputs, idx: number) => {
    const currentVal =
      aPriority === 0
        ? (data.get(keys[randomIndices[idx - 1]]) as Inputs)
        : val;

    if (currentVal) {
      if (
        (aCategory === currentVal.category || aCategory === 100000) &&
        (aType === currentVal.type || aType === 100000) &&
        (cnt < aNumberOfQuestions || aNumberOfQuestions === 100000)
      ) {
        const newVal: InputsForResult = {
          id: currentVal.id,
          type: currentVal.type,
          question: currentVal.question,
          answer: currentVal.answer,
          numberOfOptions: currentVal.numberOfOptions,
          options: currentVal.options,
          explanation: currentVal.explanation,
          notes: currentVal.notes,
          isCorrectAnswer: false,
          areCorrectAnswers: currentVal.areCorrectAnswers,
          answerForDisplay:
            currentVal.type === 0
              ? answerArrayText[currentVal.answer[0] ? 0 : 1]
              : getAnswerOfSelectionForDisplay(currentVal),
        };
        necessaryData.set(cnt, newVal);
        ++cnt;
      }
    }
  });
  return necessaryData;
};

export function getQuizDataForPractice(
  aQuizData: Map<number, Inputs>,
  aCategory: number,
  aType: number,
  aNumberOfQuestions: number,
  aPriority: number,
) {
  return retrieveNecessaryData(
    aQuizData,
    aCategory,
    aType,
    aNumberOfQuestions,
    aPriority,
  );
}

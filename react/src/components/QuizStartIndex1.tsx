import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import type { InputsForResult } from "../types/inputs.type";
import { answerArrayText } from "../utils/labels";

type QuizStartIndex1Props = {
  onUpdate: (
    nextPageNumber?: number,
    categoryValue?: number,
    typeValue?: number,
    numberOfQuestions?: number,
    priorityValue?: number,
    currentQuizDataForPractice?: InputsForResult,
  ) => void;

  currentQuizDataForPractice: InputsForResult;
};

export default function QuizStartIndex1({
  onUpdate,
  currentQuizDataForPractice,
}: QuizStartIndex1Props) {
  const [answerArray, setAnswerArray] = useState<boolean[]>([false, false]);

  const [options, setOptions] = useState<
    { isActive: boolean; value: string }[] | []
  >(
    currentQuizDataForPractice.options.map((val) => ({
      ...val,
      isActive: false,
    })),
  );

  const handleAnswerForTrueandfalse = (aIndex: number) => {
    const resetArray = answerArray.map((_, idx) => idx === aIndex);
    setAnswerArray(resetArray);
  };

  const handleAnswerForSelection = (aIndex: number) => {
    const newOptions = [...options];
    newOptions[aIndex].isActive = !options[aIndex].isActive;
    setOptions(newOptions);
  };

  const handleSaveAndUpdatePageNo = () => {
    const displayAnswers = !currentQuizDataForPractice.type
      ? answerArray[0]
        ? "まる"
        : answerArray[1]
          ? "ばつ"
          : ""
      : options
        ? options
            .filter((val) => val.isActive === true)
            .map((val) => val.value)
            .join("、")
        : "";

    currentQuizDataForPractice.isCorrectAnswer =
      currentQuizDataForPractice.answerForDisplay === displayAnswers;
    (currentQuizDataForPractice?.areCorrectAnswers as boolean[]).push(
      currentQuizDataForPractice.isCorrectAnswer,
    );

    onUpdate(
      2,
      undefined,
      undefined,
      undefined,
      undefined,
      currentQuizDataForPractice,
    );
  };

  return (
    <>
      <h2>Question</h2>
      <p>{currentQuizDataForPractice.question}</p>

      {!currentQuizDataForPractice.type ? (
        <Form.Group className="mb-3">
          <div className="d-flex">
            {answerArrayText.map((val, index) => (
              <Form.Check
                type="radio"
                key={index}
                id={`answer-${index}`}
                label={val}
                name="answer"
                className="pe-4"
                onChange={() => handleAnswerForTrueandfalse(index)}
              />
            ))}
          </div>
        </Form.Group>
      ) : (
        currentQuizDataForPractice.options.map((val, index) => (
          <Form.Check
            type="checkbox"
            key={index}
            id={`options-${index}`}
            label={val.value}
            name="answer"
            className="pe-4"
            onChange={() => handleAnswerForSelection(index)}
          />
        ))
      )}

      <div className="text-center">
        <Button
          variant="primary"
          className="py-2 px-3 mt-3"
          onClick={() => handleSaveAndUpdatePageNo()}
        >
          答えを確認する
        </Button>
      </div>
    </>
  );
}

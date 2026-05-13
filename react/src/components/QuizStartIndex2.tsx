import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import type { InputsForResult } from "../types/inputs.type";
import { getAccuracyRate } from "../utils/common";

type QuizStartIndex2Props = {
  onUpdate: (
    nextPageNumber?: number,
    categoryValue?: number,
    typeValue?: number,
    numberOfQuestions?: number,
    priorityValue?: number,
    currentQuizDataForPractice?: InputsForResult,
  ) => void;
  currentQuizDataForPractice: InputsForResult;
  isLastQuestion: boolean;
};

export default function QuizStartIndex2({
  onUpdate,
  currentQuizDataForPractice,
  isLastQuestion,
}: QuizStartIndex2Props) {
  const [notes, setNotes] = useState<string>(currentQuizDataForPractice.notes);

  const handleUpdatePageNo = () => {
    currentQuizDataForPractice.notes = notes;
    onUpdate(
      3,
      undefined,
      undefined,
      undefined,
      undefined,
      currentQuizDataForPractice,
    );
  };

  const handleNotes = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.currentTarget.value);
  };

  return (
    <>
      <h2>Answer</h2>
      <p>
        {currentQuizDataForPractice.isCorrectAnswer ? "正解" : "不正解"}
        ！答えは「{currentQuizDataForPractice.answerForDisplay}」です。
      </p>

      <p>
        解説
        <br />
        {currentQuizDataForPractice.explanation}
      </p>

      <p>
        この問題の現在の正解率は「{getAccuracyRate(currentQuizDataForPractice)}
        」です。
      </p>
      <label>何かメモしておきたいことがあったら書いてください</label>

      <Form.Group className="mb-3">
        <Form.Control
          id="notes"
          as="textarea"
          rows={5}
          defaultValue={notes}
          onChange={handleNotes}
        />
      </Form.Group>

      <div className="text-center mt-3">
        <Button variant="primary" className="py-2 px-3 mt-3 me-3">
          クイズを終了する
        </Button>
        <Button
          variant="primary"
          className="py-2 px-3 mt-3"
          onClick={() => handleUpdatePageNo()}
        >
          {isLastQuestion ? "結果を見る" : "次の問題を解く"}
        </Button>
      </div>
    </>
  );
}

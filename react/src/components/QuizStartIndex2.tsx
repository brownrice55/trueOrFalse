import Button from "react-bootstrap/Button";
import FormgroupTextarea from "./formgroups/FormgroupTextarea";
import type { InputsForResult } from "../types/inputs.type";
import { getAccuracyRate } from "../utils/common";

type QuizStartIndex2Props = {
  onUpdate: (nextPageNumber: number) => void;
  currentQuizDataForPractice: InputsForResult;
};

export default function QuizStartIndex2({
  onUpdate,
  currentQuizDataForPractice,
}: QuizStartIndex2Props) {
  const handleUpdatePageNo = () => {
    onUpdate(3);
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
      <FormgroupTextarea
        label={"メモ"}
        name={"notes"}
        selectedValue={currentQuizDataForPractice.notes}
      />

      <div className="text-center mt-3">
        <Button variant="primary" className="py-2 px-3 mt-3 me-3">
          クイズを終了する
        </Button>
        <Button
          variant="primary"
          className="py-2 px-3 mt-3"
          onClick={() => handleUpdatePageNo()}
        >
          次の問題を解く
        </Button>
      </div>
    </>
  );
}

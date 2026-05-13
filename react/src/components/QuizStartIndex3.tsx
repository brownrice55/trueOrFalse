import Button from "react-bootstrap/Button";
import type { InputsForResult } from "../types/inputs.type";

type QuizStartIndex3Props = {
  onUpdate: (nextPageNumber: number) => void;
  quizDataForPractice: Map<number, InputsForResult>;
  currentQuestionIndex: number;
  isCompleted: boolean;
};

export default function QuizStartIndex3({
  onUpdate,
  quizDataForPractice,
  currentQuestionIndex,
  isCompleted,
}: QuizStartIndex3Props) {
  const handleUpdatePageNo = () => {
    onUpdate(0);
  };

  return (
    <>
      <h2>Result</h2>
      <p>
        お疲れ様でした。
        <br />
        正解率「100％」でした。
        <br />
        見直しをしましょう。
      </p>

      {[...quizDataForPractice]
        .filter(([idx]) => isCompleted || idx < currentQuestionIndex)
        .map(([idx, val]) => {
          const classname = val.isCorrectAnswer
            ? "bg-success-subtle mb-4 p-4 pb-3"
            : "bg-secondary-subtle mb-4 p-4 pb-3";
          return (
            <div className={classname} key={idx}>
              問題{idx + 1}（{val.isCorrectAnswer ? "正解" : "不正解"}）
              <br /> 問題：{val.question}
              <br />
              答え：{val.answerForDisplay} <br />
              解説：{val.explanation}
              {val.notes && (
                <>
                  <br />
                  メモ：{val.notes}
                </>
              )}
            </div>
          );
        })}

      <div className="text-center mt-3">
        <Button
          variant="primary"
          className="py-2 px-3 mt-3"
          onClick={() => handleUpdatePageNo()}
        >
          終了する
        </Button>
      </div>
    </>
  );
}

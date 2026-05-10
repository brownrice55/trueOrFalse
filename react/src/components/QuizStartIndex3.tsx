import Button from "react-bootstrap/Button";

type QuizStartIndex3Props = {
  onUpdate: (nextPageNumber: number) => void;
};

export default function QuizStartIndex3({ onUpdate }: QuizStartIndex3Props) {
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

      <div className="bg-success-subtle mb-4 p-4 pb-3">
        問題1（正解）
        <br /> 問題：文言が入ります。 <br />
        答え：まる <br />
        解説：解説が入ります。 <br />
        メモ：メモが入ります。
      </div>

      <div className="bg-secondary-subtle mb-4 p-4 pb-3">
        問題1（正解）
        <br /> 問題：文言が入ります。 <br />
        答え：まる <br />
        解説：解説が入ります。 <br />
        メモ：メモが入ります。
      </div>

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

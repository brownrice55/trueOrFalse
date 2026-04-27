import Button from "react-bootstrap/Button";

type QuizStartIndex1Props = {
  onUpdate: (aNextPageNumber: number) => void;
};

export default function QuizStartIndex1({ onUpdate }: QuizStartIndex1Props) {
  const handleUpdatePageNo = () => {
    onUpdate(2);
  };

  return (
    <>
      <h2>Question</h2>
      <p>問題名</p>

      <div className="text-center">
        <Button
          variant="primary"
          className="py-2 px-3 mt-3"
          onClick={() => handleUpdatePageNo()}
        >
          答えを確認する
        </Button>
      </div>
    </>
  );
}

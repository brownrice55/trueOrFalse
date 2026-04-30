import Button from "react-bootstrap/Button";
import FormgroupTextarea from "./formgroups/FormgroupTextarea";

type QuizStartIndex2Props = {
  onUpdate: (aNextPageNumber: number) => void;
};

export default function QuizStartIndex2({ onUpdate }: QuizStartIndex2Props) {
  const handleUpdatePageNo = () => {
    onUpdate(3);
  };

  return (
    <>
      <h2>Answer</h2>
      <p>不正解！答えは「文言が入ります」です。</p>

      <p>
        解説
        <br />
        文言が入ります。文言が入ります。文言が入ります。文言が入ります。
      </p>

      <p>この問題の現在の正解率は「33%」です。</p>
      <label>何かメモしておきたいことがあったら書いてください</label>
      <FormgroupTextarea label={"メモ"} name={"notes"} selectedValue={""} />

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

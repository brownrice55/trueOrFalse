import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import FormgroupSelect from "./formgroups/FormgroupSelect";
import { getData } from "../utils/common";
import { typeOptionArray, categoryNameArray } from "../utils/labels";

type QuizStartIndex0Props = {
  onUpdate: (aNextPageNumber: number) => void;
};

export default function QuizStartIndex0({ onUpdate }: QuizStartIndex0Props) {
  const data = getData();
  const length = Math.floor(data.size / 5);
  const handleUpdatePageNo = () => {
    onUpdate(1);
  };

  return (
    <>
      <FormgroupSelect
        register={null}
        textArray={categoryNameArray}
        label={"カテゴリー"}
        name={"category"}
        selectedValue={0}
      />
      <FormgroupSelect
        register={null}
        textArray={typeOptionArray}
        label={"クイズの種類"}
        name={"type"}
        selectedValue={0}
      />
      <Form.Group className="mb-3">
        <Form.Label>問題数</Form.Label>
        <Form.Select>
          {Array(length)
            .fill("")
            .map((_, index: number) => {
              const value = 5 * index + 5;
              return (
                <option value={value} key={value}>
                  {value}
                </option>
              );
            })}
          {length * 5 < data.size && (
            <option value={data.size} key={data.size}>
              全て（{data.size}問）
            </option>
          )}
        </Form.Select>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>優先順位</Form.Label>
        <Form.Select>
          <option value="random">指定しない（ランダムで表示）</option>
          <option value="highPriority">優先順位が高いものから表示</option>
        </Form.Select>
      </Form.Group>

      <div className="text-center">
        <Button
          variant="primary"
          className="py-2 px-3 mt-3"
          onClick={() => handleUpdatePageNo()}
        >
          スタート
        </Button>
      </div>
    </>
  );
}

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import FormgroupSelect from "./formgroups/FormgroupSelect";
import { typeOptionArray, categoryNameArray } from "../utils/labels";
import type { Inputs, InputsForResult } from "../types/inputs.type";

type QuizStartIndex0Props = {
  onUpdate: (
    nextPageNumber?: number,
    categoryValue?: number,
    typeValue?: number,
    numberOfQuestions?: number,
    priorityValue?: number,
  ) => void;
  quizDataForPractice?: Map<number, Inputs> | Map<number, InputsForResult>;
};

export default function QuizStartIndex0({
  onUpdate,
  quizDataForPractice,
}: QuizStartIndex0Props) {
  const remainder = (quizDataForPractice?.size ?? 0) % 5;
  const length = remainder
    ? Math.floor((quizDataForPractice?.size ?? 0) / 5) + 1
    : Math.floor((quizDataForPractice?.size ?? 0) / 5);

  const handleUpdatePageNo = () => {
    onUpdate(1);
  };

  const handleSelectValue = (
    e: React.ChangeEvent<HTMLSelectElement>,
    aName: string,
  ) => {
    if (aName === "numberOfQuestions") {
      onUpdate(
        undefined,
        undefined,
        undefined,
        parseInt(e.target.value),
        undefined,
      );
    } else {
      onUpdate(
        undefined,
        undefined,
        undefined,
        undefined,
        parseInt(e.target.value),
      );
    }
  };

  const handleSelectedValueFromForm = (
    aSelectedValue: number,
    aName: string | undefined,
  ) => {
    if (aName === "category") {
      onUpdate(undefined, aSelectedValue, undefined, undefined, undefined);
    } else if (aName === "type") {
      onUpdate(undefined, undefined, aSelectedValue, undefined, undefined);
    }
  };

  return (
    <>
      <FormgroupSelect
        textArray={categoryNameArray}
        label={"カテゴリー"}
        name={"category"}
        selectedValue={100000}
        isLabelNeeded={true}
        from={"quizStart"}
        onUpdate={handleSelectedValueFromForm}
      />
      <FormgroupSelect
        textArray={typeOptionArray}
        label={"クイズの種類"}
        name={"type"}
        selectedValue={100000}
        isLabelNeeded={true}
        from={"quizStart"}
        onUpdate={handleSelectedValueFromForm}
      />
      <Form.Group className="mb-3">
        <Form.Label>問題数</Form.Label>
        <Form.Select
          onChange={(e) => handleSelectValue(e, "numberOfQuestions")}
          disabled={!quizDataForPractice?.size}
        >
          {quizDataForPractice?.size ? (
            quizDataForPractice?.size <= 5 ? (
              <option value="100000" key="100000">
                全て（{quizDataForPractice && quizDataForPractice.size}
                問）
              </option>
            ) : (
              Array(length)
                .fill("")
                .map((_, index: number) => {
                  const value = 5 * index + 5;
                  if (value <= quizDataForPractice?.size) {
                    return (
                      <option value="100000" key="100000">
                        全て（{quizDataForPractice && quizDataForPractice.size}
                        問）
                      </option>
                    );
                  } else {
                    return (
                      <option value={value} key={value}>
                        {value}問
                      </option>
                    );
                  }
                })
            )
          ) : (
            <option value="0" key="0">
              問題がありません。条件を変更してください。
            </option>
          )}
        </Form.Select>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>優先順位</Form.Label>
        <Form.Select
          onChange={(e) => handleSelectValue(e, "priority")}
          disabled={!quizDataForPractice?.size}
        >
          <option value="0">指定しない（ランダムで表示）</option>
          <option value="1">優先順位が高いものから表示</option>
        </Form.Select>
      </Form.Group>

      <div className="text-center">
        <Button
          variant="primary"
          className="py-2 px-3 mt-3"
          onClick={() => handleUpdatePageNo()}
          disabled={!quizDataForPractice?.size}
        >
          スタート
        </Button>
      </div>
    </>
  );
}

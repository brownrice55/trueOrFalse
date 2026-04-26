import { useState } from "react";
import QuestionDetailParts from "./QuestionDetailParts";
import { getData, getCategories } from "../utils/common";
import type { Inputs } from "../types/inputs.type";
import { typeOptionArray, priorityOptionArray } from "../utils/labels";
import Button from "react-bootstrap/Button";

type QuestionDetailProps = {
  selectedKey: number;
  onUpdate: (updatedData: Map<number, Inputs> | null) => void;
};

export default function QuestionDetail({
  selectedKey,
  onUpdate,
}: QuestionDetailProps) {
  const [data, setData] = useState(getData());
  const [indexNoUnderEdit, setIndexNoUnderEdit] = useState<number>(0);

  const originalCategories = getCategories();
  const categoryNameArray = [...originalCategories.categories].map(
    (val) => val.categoryName,
  );

  const handleGoToList = () => {
    onUpdate(null);
  };
  const handleDelete = () => {
    const newMap = new Map(data);
    newMap.delete(selectedKey);
    localStorage.setItem("TrueOrFalseData", JSON.stringify([...newMap]));
    setData(newMap);
    onUpdate(newMap);
  };

  return (
    <>
      <QuestionDetailParts
        selectedKey={selectedKey}
        indexNoUnderEdit={indexNoUnderEdit}
        formType={"select"}
        formInfo={[null, categoryNameArray, "カテゴリー", "category"]}
      />
      <QuestionDetailParts
        selectedKey={selectedKey}
        indexNoUnderEdit={indexNoUnderEdit}
        formType={"select"}
        formInfo={[null, typeOptionArray, "クイズの種類", "type"]}
      />
      <QuestionDetailParts
        selectedKey={selectedKey}
        indexNoUnderEdit={indexNoUnderEdit}
        formType={"textarea"}
        formInfo={[null, [], "問題", "question"]}
      />
      {/* <QuestionDetailParts
        selectedKey={selectedKey}
        indexNoUnderEdit={indexNoUnderEdit}
        formType={"other"}
        formInfo={[null, categoryNameArray, "答え", "answer"]}
      /> */}
      <QuestionDetailParts
        selectedKey={selectedKey}
        indexNoUnderEdit={indexNoUnderEdit}
        formType={"textarea"}
        formInfo={[null, [], "解説", "explanation"]}
      />
      <QuestionDetailParts
        selectedKey={selectedKey}
        indexNoUnderEdit={indexNoUnderEdit}
        formType={"select"}
        formInfo={[null, priorityOptionArray, "優先順位", "priority"]}
      />
      <QuestionDetailParts
        selectedKey={selectedKey}
        indexNoUnderEdit={indexNoUnderEdit}
        formType={"textarea"}
        formInfo={[null, [], "メモ", "notes"]}
      />
      <div className="text-center mt-5">
        <Button
          variant="primary"
          className="py-2 px-3 me-3"
          onClick={() => handleGoToList()}
        >
          一覧に戻る
        </Button>
        <Button
          variant="primary"
          type="submit"
          className="py-2 px-3"
          onClick={() => handleDelete()}
        >
          削除する
        </Button>
      </div>
    </>
  );
}

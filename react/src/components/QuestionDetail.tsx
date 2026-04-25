import { useState } from "react";
import QuestionDetailParts from "./QuestionDetailParts";
import { getCategories } from "../utils/common";
import { typeOptionArray, priorityOptionArray } from "../utils/labels";

type QuestionDetailProps = {
  selectedKey: number;
};

export default function QuestionDetail({ selectedKey }: QuestionDetailProps) {
  const [indexNoUnderEdit, setIndexNoUnderEdit] = useState<number>(0);

  const originalCategories = getCategories();
  const categoryNameArray = [...originalCategories.categories].map(
    (val) => val.categoryName,
  );

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
    </>
  );
}

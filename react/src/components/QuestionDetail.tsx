import { useState, useContext, memo } from "react";
import type { Dispatch, SetStateAction } from "react";
import QuestionDetailParts from "./QuestionDetailParts";
import QuestionDetailPartsForCorrectAnswers from "./QuestionDetailPartsForCorrectAnswers";
import { DataContext } from "../contexts/context";
import type { DataContextType } from "../types/dataContextType.type";
import type { Inputs } from "../types/inputs.type";
import Button from "react-bootstrap/Button";

type QuestionDetailProps = {
  selectedKey: number;
  onUpdate: (updatedData: Map<number, Inputs> | null) => void;
};
function QuestionDetail({ selectedKey }: QuestionDetailProps) {
  const { data } = useContext(DataContext) as DataContextType;
  const [selectedVal, setSelectedVal] = useState<Inputs | undefined>(
    data.get(selectedKey),
  );

  return (
    <>
      <QuestionDetailParts
        nameJp="カテゴリー"
        property="category"
        formType="select"
        selectedKey={selectedKey}
        selectedVal={selectedVal as Inputs}
        setSelectedVal={setSelectedVal as Dispatch<SetStateAction<Inputs>>}
      />
      <QuestionDetailParts
        nameJp="クイズの種類"
        property="type"
        formType="select"
        selectedKey={selectedKey}
        selectedVal={selectedVal as Inputs}
        setSelectedVal={setSelectedVal as Dispatch<SetStateAction<Inputs>>}
      />
      <QuestionDetailParts
        nameJp="問題"
        property="question"
        formType="textarea"
        selectedKey={selectedKey}
        selectedVal={selectedVal as Inputs}
        setSelectedVal={setSelectedVal as Dispatch<SetStateAction<Inputs>>}
      />
      <QuestionDetailParts
        nameJp="答え"
        property="answer"
        formType="answer"
        selectedKey={selectedKey}
        selectedVal={selectedVal as Inputs}
        setSelectedVal={setSelectedVal as Dispatch<SetStateAction<Inputs>>}
      />
      <QuestionDetailParts
        nameJp="解説"
        property="explanation"
        formType="textarea"
        selectedKey={selectedKey}
        selectedVal={selectedVal as Inputs}
        setSelectedVal={setSelectedVal as Dispatch<SetStateAction<Inputs>>}
      />
      <QuestionDetailParts
        nameJp="優先順位"
        property="priority"
        formType="select"
        selectedKey={selectedKey}
        selectedVal={selectedVal as Inputs}
        setSelectedVal={setSelectedVal as Dispatch<SetStateAction<Inputs>>}
      />
      <QuestionDetailParts
        nameJp="メモ"
        property="notes"
        formType="textarea"
        selectedKey={selectedKey}
        selectedVal={selectedVal as Inputs}
        setSelectedVal={setSelectedVal as Dispatch<SetStateAction<Inputs>>}
      />
      <QuestionDetailPartsForCorrectAnswers originalSelectedVal={selectedVal} />
      <div className="text-center mt-5">
        <Button variant="primary" className="py-2 px-3 me-3">
          一覧に戻る
        </Button>
        <Button variant="primary" type="submit" className="py-2 px-3">
          削除する
        </Button>
      </div>
    </>
  );
}

export default memo(QuestionDetail);

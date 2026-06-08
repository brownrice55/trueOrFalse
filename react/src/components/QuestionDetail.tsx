import { useState, useContext } from "react";
import QuestionDetailParts from "./QuestionDetailParts";
import QuestionDetailPartsForCorrectAnswers from "./QuestionDetailPartsForCorrectAnswers";
import { getCategories } from "../utils/common";
import { DataContext } from "../contexts/context";
import type { DataContextType } from "../types/dataContextType.type";
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
  const { data, setData } = useContext(DataContext) as DataContextType;
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const selectedVal = data.get(selectedKey);
  const [typeValue, setTypeValue] = useState<number | undefined>(
    selectedVal?.type,
  );

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

  const [isIndex1UnderEdit, setIsIndex1UnderEdit] = useState<boolean>(false);
  const [answerArray, setAnswerArray] = useState<boolean[]>(
    selectedVal?.answer ?? [true, false],
  );
  const [numberOfOptions, setNumberOfOptions] = useState<number>(
    selectedVal?.numberOfOptions ?? 2,
  );
  const [options, setOptions] = useState<
    { isActive: boolean; value: string }[]
  >(
    structuredClone(selectedVal?.options) ?? [
      { isActive: false, value: "" },
      { isActive: false, value: "" },
    ],
  );

  const [isChangedForAnswersInEditMode, setIsChangedForAnswersInEditMode] =
    useState<boolean>(false);
  const [isCanceledForIndex1, setIsCanceledForIndex1] =
    useState<boolean>(false);
  const [isOverwirttenForIndex1, setIsOverwirttenForIndex1] =
    useState<boolean>(false);

  const handleIsDisabled = (
    aIsUnderEdit?: boolean,
    aTypeValue?: number,
    aIsFormOpened?: boolean,
    aAnswerArray?: boolean[] | { isActive: boolean; value: string }[],
    aNumberOfOptions?: number,
    aAreAnswersChanged?: boolean,
    aIsCanceled?: boolean,
    aIsOverwirtten?: boolean,
  ) => {
    if (aIsUnderEdit !== undefined) {
      setIsDisabled(aIsUnderEdit);
    }
    if (aTypeValue !== undefined) {
      setTypeValue(aTypeValue);
    }
    if (aIsFormOpened !== undefined) {
      setIsIndex1UnderEdit(aIsFormOpened);
    }
    if (aAnswerArray !== undefined) {
      if (aTypeValue === 0) {
        setAnswerArray(aAnswerArray as boolean[]);
      } else if (aTypeValue === 1) {
        setOptions(aAnswerArray as { isActive: boolean; value: string }[]);
      }
    }
    if (aNumberOfOptions !== undefined) {
      setNumberOfOptions(aNumberOfOptions);
    }
    if (aAreAnswersChanged !== undefined) {
      setIsChangedForAnswersInEditMode(aAreAnswersChanged);
    }
    if (aIsCanceled !== undefined) {
      // when property==='type'
      setIsCanceledForIndex1(true);
    }
    if (aTypeValue !== undefined && aIsOverwirtten !== undefined) {
      setIsOverwirttenForIndex1(aIsOverwirtten);
      setTypeValue(aTypeValue);
    }
  };

  return (
    <>
      <QuestionDetailParts
        selectedKey={selectedKey}
        originalSelectedVal={selectedVal}
        isDisabled={isDisabled}
        onUpdate={handleIsDisabled}
        formType={"select"}
        formInfo={[null, categoryNameArray, "カテゴリー", "category"]}
      />
      <QuestionDetailParts
        selectedKey={selectedKey}
        originalSelectedVal={selectedVal}
        isDisabled={isDisabled}
        onUpdate={handleIsDisabled}
        formType={"select"}
        formInfo={[null, typeOptionArray, "クイズの種類", "type"]}
        answerArrayForIndex1={answerArray}
        numberOfOptions={numberOfOptions}
        optionsForIndex1={options}
        typeValue={typeValue}
        isChangedForAnswersInEditMode={isChangedForAnswersInEditMode}
        setIsChangedForAnswersInEditMode={setIsChangedForAnswersInEditMode}
      />
      <QuestionDetailParts
        selectedKey={selectedKey}
        originalSelectedVal={selectedVal}
        isDisabled={isDisabled}
        onUpdate={handleIsDisabled}
        formType={"textarea"}
        formInfo={[null, [], "問題", "question"]}
      />
      <QuestionDetailParts
        selectedKey={selectedKey}
        originalSelectedVal={selectedVal}
        isDisabled={isDisabled}
        isIndex1UnderEdit={isIndex1UnderEdit}
        onUpdate={handleIsDisabled}
        formType={"answer"}
        formInfo={[null, [], "答え", "answer"]}
        typeValue={typeValue}
        answerArrayForIndex1={answerArray}
        numberOfOptions={numberOfOptions}
        isCanceledForIndex1={isCanceledForIndex1}
        setIsCanceledForIndex1={setIsCanceledForIndex1}
        isOverwirttenForIndex1={isOverwirttenForIndex1}
        setIsOverwirttenForIndex1={setIsOverwirttenForIndex1}
      />
      <QuestionDetailParts
        selectedKey={selectedKey}
        originalSelectedVal={selectedVal}
        isDisabled={isDisabled}
        onUpdate={handleIsDisabled}
        formType={"textarea"}
        formInfo={[null, [], "解説", "explanation"]}
      />
      <QuestionDetailParts
        selectedKey={selectedKey}
        originalSelectedVal={selectedVal}
        isDisabled={isDisabled}
        onUpdate={handleIsDisabled}
        formType={"select"}
        formInfo={[null, priorityOptionArray, "優先順位", "priority"]}
      />
      <QuestionDetailParts
        selectedKey={selectedKey}
        originalSelectedVal={selectedVal}
        isDisabled={isDisabled}
        onUpdate={handleIsDisabled}
        formType={"textarea"}
        formInfo={[null, [], "メモ", "notes"]}
      />
      <QuestionDetailPartsForCorrectAnswers originalSelectedVal={selectedVal} />
      <div className="text-center mt-5">
        <Button
          variant="primary"
          className="py-2 px-3 me-3"
          onClick={() => handleGoToList()}
          disabled={isDisabled}
        >
          一覧に戻る
        </Button>
        <Button
          variant="primary"
          type="submit"
          className="py-2 px-3"
          onClick={() => handleDelete()}
          disabled={isDisabled}
        >
          削除する
        </Button>
      </div>
    </>
  );
}

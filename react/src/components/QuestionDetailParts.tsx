import { useState, useContext, useEffect } from "react";
import FormgroupSelect from "./formgroups/FormgroupSelect";
import FormgroupTextarea from "./formgroups/FormgroupTextarea";
import FormgroupForAnswer from "./formgroups/FormgroupForAnswer";
import type { Inputs, InputsOmit } from "../types/inputs.type";
import { DataContext } from "../contexts/context";
import type { DataContextType } from "../types/dataContextType.type";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

type QuestionDetailPartsProps = {
  selectedKey: number;
  originalSelectedVal?: Inputs;
  isDisabled: boolean;
  onUpdate: (
    value: boolean | undefined,
    value2: number | undefined,
    value3: boolean | undefined,
    value4: boolean[] | { isActive: boolean; value: string }[] | undefined,
    value5: number | undefined,
    value6: string | undefined,
    aAreAnswersChanged?: boolean,
  ) => void;
  formType: string;
  formInfo: [any, any, string, keyof InputsOmit];
  typeValue?: number;
  isIndex1UnderEdit?: boolean;
  answerArrayForIndex1?: boolean[];
  numberOfOptions?: number;
  options?: { isActive: boolean; value: string }[];
  displayAnswersForSelection?: string;
  isChangedForAnswersInEditMode?: boolean;
};
export default function QuestionDetailParts({
  selectedKey,
  originalSelectedVal,
  isDisabled,
  onUpdate,
  formType,
  formInfo,
  typeValue,
  isIndex1UnderEdit,
  answerArrayForIndex1,
  numberOfOptions,
  options,
  displayAnswersForSelection,
  isChangedForAnswersInEditMode,
}: QuestionDetailPartsProps) {
  const { data, setData } = useContext(DataContext) as DataContextType;
  const [selectedVal, setSelectedVal] = useState<Inputs | undefined>(
    originalSelectedVal,
  );
  const [isUnderEdit, setIsUnderEdit] = useState<boolean>(false);
  const [questionTypeNumber, setQuestionTypeNumber] = useState<
    number | undefined
  >(typeValue);

  const [answerArray, setAnswerArray] = useState<boolean[]>(
    selectedVal?.answer ?? [true, false],
  );

  const handleEdit = (aProperty: string) => {
    setIsUnderEdit((prev) => !prev);
    const isFormOpened = aProperty === "type" ? true : undefined;
    onUpdate(
      !isUnderEdit,
      undefined,
      isFormOpened,
      undefined,
      undefined,
      undefined,
    );
  };

  const handleOverwrite = (
    e: React.MouseEvent<HTMLButtonElement>,
    aFormType: string,
    aProperty: string,
  ) => {
    const targetElm =
      e.currentTarget?.parentNode?.parentNode?.parentNode?.querySelector(
        aFormType,
      ) as HTMLSelectElement | HTMLTextAreaElement;
    if (selectedVal) {
      const newVal = { ...selectedVal } as Inputs;
      if (aProperty !== "type" && aProperty !== "answer") {
        (newVal as any)[aProperty] =
          aProperty === "category" || aProperty === "priority"
            ? (parseInt(targetElm.value) as number)
            : (targetElm?.value as string);
      } else {
        if (aProperty === "type") {
          newVal.type = parseInt(targetElm.value);
          if (newVal.type === 0) {
            onUpdate(
              undefined,
              newVal.type,
              undefined,
              answerArray,
              undefined,
              undefined,
            );
          } else {
            const newDisplayAnswersForSelection = selectedVal?.type
              ? selectedVal.options
                ? selectedVal.options
                    .filter((val) => val.isActive)
                    .map((val) => val.value)
                    .join("、")
                : ""
              : "";
            onUpdate(
              undefined,
              undefined,
              undefined,
              undefined,
              undefined,
              newDisplayAnswersForSelection,
            );
          }
        } else {
          // aProperty === answer
          newVal.answer =
            typeValue === 0 ? (answerArray as boolean[]) : [true, false];
          newVal.numberOfOptions = (
            typeValue === 1 ? numberOfOptions : 2
          ) as number;
          newVal.options = (
            typeValue === 1
              ? options
              : [
                  { isActive: false, value: "" },
                  { isActive: false, value: "" },
                ]
          ) as { isActive: boolean; value: string }[];
        }
      }
      if (aProperty !== "type") {
        data.set(selectedKey, newVal);
        setData(data);
        setSelectedVal(newVal);
        localStorage.setItem("TrueOrFalseData", JSON.stringify([...data]));
      }
    }

    setIsUnderEdit((prev) => !prev);
    const type =
      aFormType === "select" && aProperty === "type"
        ? parseInt(targetElm.value)
        : undefined;
    const isFormOpened = aProperty === "type" ? false : undefined;
    onUpdate(!isUnderEdit, type, isFormOpened, undefined, undefined, undefined);
  };

  const handleCancel = (aProperty: string) => {
    setIsUnderEdit((prev) => !prev);
    const isFormOpened = aProperty === "type" ? false : undefined;
    onUpdate(
      !isUnderEdit,
      typeValue,
      isFormOpened,
      undefined,
      undefined,
      undefined,
    );
  };

  const [lookupKey, setLookupKey] = useState<
    | string
    | number
    | boolean[]
    | { isActive: boolean; value: string }[]
    | undefined
  >(selectedVal?.[formInfo[3]]);

  const handleSwitchTypeForAnswers = (aTypeValue: number) => {
    onUpdate(undefined, aTypeValue, undefined, undefined, undefined, undefined);
  };

  const handleUpdateFromAnswerForm = (
    aTypeValue: number,
    aAnswerArray: boolean[] | { isActive: boolean; value: string }[],
    aNumberOfOptions: number,
  ) => {
    onUpdate(
      undefined,
      aTypeValue,
      undefined,
      aAnswerArray,
      aNumberOfOptions,
      undefined,
    );
  };

  useEffect(() => {
    setQuestionTypeNumber(typeValue);
  }, [typeValue]);

  const [isEditBtnDisabled, setIsEditBtnDisabled] =
    useState<boolean>(isUnderEdit);
  const handleValidation = (aIsEmpty: boolean) => {
    setIsEditBtnDisabled(aIsEmpty);
  };

  useEffect(() => {
    setIsEditBtnDisabled(isUnderEdit);
  }, [isUnderEdit]);

  useEffect(() => {
    if (answerArrayForIndex1) {
      setAnswerArray(answerArrayForIndex1);
    }
    // property===type
    if (formInfo[3] === "type") {
      const newVal = { ...selectedVal } as Inputs;
      newVal.type = typeValue as number;
      if (!typeValue) {
        // trueOrFalse
        if (answerArrayForIndex1) {
          newVal.answer = answerArrayForIndex1;
        }
      }
      data.set(selectedKey, newVal);
      setData(data);
      setSelectedVal(newVal);
      localStorage.setItem("TrueOrFalseData", JSON.stringify([...data]));
      setLookupKey(newVal?.["type"]);
    }
  }, [answerArrayForIndex1, typeValue]);

  const handleSelectValidation = (aIsChanged: boolean) => {
    setIsEditBtnDisabled(!aIsChanged);
  };

  const handleValidationForAnswers = (
    aAreAnswersChanged: boolean,
    aResetArray?: boolean[],
  ) => {
    if (isUnderEdit) {
      if (aResetArray) {
        setAnswerArray(aResetArray);
      }
      setIsEditBtnDisabled(!aAreAnswersChanged);
    } else {
      onUpdate(
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        aAreAnswersChanged,
      );
    }
  };

  return (
    <>
      <div>
        <Row className="pt-2 border-top">
          <Col className="align-top">{formInfo[2]}</Col>
          {isUnderEdit ? (
            <Col className="align-top text-end">
              <Button
                variant="primary"
                className="py-1 px-2 me-2"
                onClick={(e) => handleOverwrite(e, formType, formInfo[3])}
                disabled={
                  isUnderEdit
                    ? isChangedForAnswersInEditMode
                      ? !isChangedForAnswersInEditMode && formInfo[3] === "type"
                      : isEditBtnDisabled
                    : isEditBtnDisabled
                }
              >
                上書きする
              </Button>
              <Button
                variant="secondary"
                className="py-1 px-2"
                onClick={() => handleCancel(formInfo[3])}
              >
                キャンセル
              </Button>
            </Col>
          ) : (
            <Col className="align-top text-end">
              <Button
                variant="primary"
                className="py-1 px-2"
                onClick={() => handleEdit(formInfo[3])}
                disabled={
                  isUnderEdit
                    ? formType === "textarea" || formType === "select"
                      ? isEditBtnDisabled
                      : isDisabled
                    : isDisabled
                }
              >
                編集する
              </Button>
            </Col>
          )}
        </Row>
        <Row className="mb-3">
          {isUnderEdit || isIndex1UnderEdit ? (
            <Col className="pt-2">
              {formType === "select" ? (
                <FormgroupSelect
                  register={formInfo[0]}
                  textArray={formInfo[1]}
                  label={formInfo[2]}
                  name={formInfo[3]}
                  selectedValue={
                    selectedVal && (selectedVal[formInfo[3]] as number)
                  }
                  onUpdate={handleSwitchTypeForAnswers}
                  from={"quizList"}
                  onUpdateForList={handleSelectValidation}
                />
              ) : formType === "textarea" ? (
                <FormgroupTextarea
                  register={formInfo[0]}
                  label={formInfo[2]}
                  name={formInfo[3]}
                  selectedValue={
                    selectedVal && (selectedVal[formInfo[3]] as string)
                  }
                  from={"quizList"}
                  onUpdate={handleValidation}
                />
              ) : (
                <FormgroupForAnswer
                  questionTypeNumber={questionTypeNumber as number}
                  onUpdate={handleUpdateFromAnswerForm}
                  answerArray={answerArray as boolean[]}
                  numberOfOptions={numberOfOptions as number}
                  options={options as { isActive: boolean; value: string }[]}
                  onUpdateForList={handleValidationForAnswers}
                />
              )}
            </Col>
          ) : (
            <Col>
              {formType === "select"
                ? selectedVal &&
                  (typeof lookupKey === "string" ||
                    typeof lookupKey === "number") &&
                  formInfo[1][lookupKey]
                : formType === "textarea"
                  ? selectedVal && lookupKey
                  : !questionTypeNumber
                    ? answerArray[0]
                      ? "まる"
                      : "ばつ"
                    : displayAnswersForSelection}
            </Col>
          )}
        </Row>
      </div>
    </>
  );
}

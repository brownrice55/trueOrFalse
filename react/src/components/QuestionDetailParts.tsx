import { useState, useContext, useEffect, useRef } from "react";
import type { Dispatch, SetStateAction } from "react";
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
    aIsCanceled?: boolean,
  ) => void;
  formType: string;
  formInfo: [any, any, string, keyof InputsOmit];
  typeValue?: number;
  isIndex1UnderEdit?: boolean;
  answerArrayForIndex1?: boolean[];
  numberOfOptions?: number;
  optionsForIndex1?: { isActive: boolean; value: string }[];
  displayAnswersForSelectionForIndex1?: string;
  isChangedForAnswersInEditMode?: boolean;
  setIsChangedForAnswersInEditMode?: Dispatch<SetStateAction<boolean>>;
  isCanceledForIndex1?: boolean;
  setIsCanceledForIndex1?: Dispatch<SetStateAction<boolean>>;
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
  optionsForIndex1,
  displayAnswersForSelectionForIndex1,
  isChangedForAnswersInEditMode,
  setIsChangedForAnswersInEditMode,
  isCanceledForIndex1,
  setIsCanceledForIndex1,
}: QuestionDetailPartsProps) {
  const originalVal = useRef(structuredClone(originalSelectedVal));
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

  const [options, setOptions] = useState<
    { isActive: boolean; value: string }[]
  >(
    structuredClone(selectedVal?.options) ?? [
      { isActive: false, value: "" },
      { isActive: false, value: "" },
    ],
  );

  const [displayAnswersForSelection, setDisplayAnswersForSelection] = useState<
    string | undefined
  >(displayAnswersForSelectionForIndex1);

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

  const [isOverWrite, setIsOverWrite] = useState<boolean>(false);
  const handleOverwrite = (
    e: React.MouseEvent<HTMLButtonElement>,
    aFormType: string,
    aProperty: string,
  ) => {
    setReset(true);
    setIsOverWrite(true);
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
              newVal.type,
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
          if (typeValue === 1) {
            const newDisplayAnswersForSelection = typeValue
              ? newVal.options
                ? newVal.options
                    .filter((val) => val.isActive)
                    .map((val) => val.value)
                    .join("、")
                : ""
              : "";

            setDisplayAnswersForSelection(newDisplayAnswersForSelection);
          }
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
    setReset(true);
    setIsUnderEdit((prev) => !prev);
    if (formInfo[3] === "answer" && originalSelectedVal) {
      setOptions(originalSelectedVal?.options);
    }
    const isFormOpened = aProperty === "type" ? false : undefined;
    const isCanceled = aProperty === "type" ? true : undefined;
    onUpdate(
      !isUnderEdit,
      typeValue,
      isFormOpened,
      undefined,
      undefined,
      undefined,
      undefined,
      isCanceled,
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
      const newVal = { ...selectedVal, type: typeValue } as Inputs;
      if (isOverWrite) {
        if (typeValue === 0 && answerArrayForIndex1) {
          // trueOrFalse
          newVal.answer = answerArrayForIndex1;
        } else if (typeValue === 1 && optionsForIndex1) {
          // selection
          setOptions(optionsForIndex1);
        }
        data.set(selectedKey, newVal);
        setData(data);
        setSelectedVal(newVal);
        localStorage.setItem("TrueOrFalseData", JSON.stringify([...data]));
        setLookupKey(newVal?.["type"]);
        setIsOverWrite(false);
      }
    } else if (formInfo[3] === "answer") {
      if (displayAnswersForSelectionForIndex1) {
        setDisplayAnswersForSelection(displayAnswersForSelectionForIndex1);
      }
    }
  }, [
    answerArrayForIndex1,
    typeValue,
    displayAnswersForSelectionForIndex1,
    optionsForIndex1,
    isOverWrite,
  ]);

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

  const [reset, setReset] = useState<boolean>(false);
  useEffect(() => {
    if (reset && setIsChangedForAnswersInEditMode) {
      setIsChangedForAnswersInEditMode(false);
      setReset(false);
    }
  }, [reset]);

  useEffect(() => {
    if (isCanceledForIndex1 && originalVal.current) {
      setOptions(originalVal?.current?.options);
      if (setIsCanceledForIndex1) {
        setIsCanceledForIndex1(false);
      }
    } else {
      originalVal.current = structuredClone(originalSelectedVal);
    }
  }, [isCanceledForIndex1]);

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

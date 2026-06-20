import { useState, useContext, memo, useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";
import FormgroupSelectForList from "./formgroups/FormgroupSelectForList";
import FormgroupTextareaForList from "./formgroups/FormgroupTextareaForList";
import FormgroupForAnswer from "./formgroups/FormgroupForAnswer";
import { textArrays } from "../utils/labels";
import type { textArraysType } from "../utils/labels";
import type { Inputs, OptionsType } from "../types/inputs.type";
import { DataContext } from "../contexts/context";
import type { DataContextType } from "../types/dataContextType.type";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

type QuestionDetailPartsProps = {
  nameJp: string;
  property: string;
  formType: string;
  selectedKey: number;
  selectedVal: Inputs;
  setSelectedVal: Dispatch<SetStateAction<Inputs>>;
  underEditProperty: string;
  setUnderEditProperty: Dispatch<SetStateAction<string>>;
  type?: number;
  setType?: Dispatch<SetStateAction<number>>;
};

function QuestionDetailParts({
  nameJp,
  property,
  formType,
  selectedKey,
  selectedVal,
  setSelectedVal,
  underEditProperty,
  setUnderEditProperty,
  type,
  setType,
}: QuestionDetailPartsProps) {
  const { data, setData } = useContext(DataContext) as DataContextType;

  const [isUnderEdit, setIsUnderEdit] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(true);

  const [updatedValue, setUpdatedValue] = useState<Inputs[keyof Inputs]>(
    (selectedVal as Inputs)[property as keyof Inputs],
  );

  const [numberOfOptions, setNumberOfOptions] = useState<number>(
    structuredClone(selectedVal.numberOfOptions),
  );
  const [options, setOptions] = useState<OptionsType>(
    structuredClone(selectedVal.options),
  );

  const handleEdit = () => {
    setIsUnderEdit(true);
    setUnderEditProperty(property);
  };

  const handleOverwrite = () => {
    setIsUnderEdit(false);
    setIsDisabled(true);

    const newVal =
      property === "answer" && selectedVal.type === 1
        ? {
            ...selectedVal,
            numberOfOptions: numberOfOptions,
            options: options,
          }
        : { ...selectedVal, [property]: updatedValue };

    setSelectedVal(newVal as Inputs);

    const newMap = new Map(data).set(selectedKey, newVal);
    setData(newMap);
    localStorage.setItem("TrueOrFalseData", JSON.stringify([...newMap]));
    setUnderEditProperty("");
  };

  const handleCancel = () => {
    setIsUnderEdit(false);
    setIsDisabled(true);
    setUpdatedValue(selectedVal[property as keyof Inputs]);
    if (property === "answer") {
      setOptions(structuredClone(selectedVal.options));
      setNumberOfOptions(structuredClone(selectedVal.numberOfOptions));
    }
    setUnderEditProperty("");
  };

  const handleUpdateFromTextAreaOrSelect = (aNewValue: string | number) => {
    const newValue =
      formType === "textarea" ? aNewValue : parseInt(aNewValue as string);
    const hasChangedFromOriginal =
      newValue !== selectedVal[property as keyof Inputs];
    setIsDisabled(!hasChangedFromOriginal);
    setUpdatedValue(newValue);
    if (property === "type" && setType) {
      setType(newValue as number);
    }
  };

  const handleUpdateFromAnswer = (
    aNewValue: string | boolean | boolean[] | OptionsType | number,
    aProperty?: string,
  ) => {
    if (aProperty === "answer" || aProperty === "options") {
      const hasChangedFromOriginal =
        JSON.stringify(aNewValue) !==
        JSON.stringify(selectedVal[aProperty as keyof Inputs]);
      setIsDisabled(!hasChangedFromOriginal);
      setUpdatedValue(aNewValue as boolean[]);
    } else {
      //numberOfOptions
      const hasChangedFromOriginal =
        aNewValue !== selectedVal[aProperty as keyof Inputs];
      setIsDisabled(!hasChangedFromOriginal);
      setNumberOfOptions(aNewValue as number);
    }
  };

  useEffect(() => {
    const [isOK, isOK2] =
      options.length > 0
        ? [
            options.some((val) => val.isActive),
            options.every((val) => val.value !== ""),
          ]
        : [false, false];
    if (!isOK || !isOK2) {
      setIsDisabled(true);
    }
  }, [options]);

  const [displayAnswersForSelection, setDisplayAnswersForSelection] = useState<
    string | undefined
  >("");
  useEffect(() => {
    if (property === "answer") {
      setDisplayAnswersForSelection(
        selectedVal?.type
          ? selectedVal.options
            ? selectedVal.options
                .filter((val) => val.isActive)
                .map((val) => val.value)
                .join("、")
            : ""
          : "",
      );
      setOptions(structuredClone(selectedVal.options));
      setNumberOfOptions(structuredClone(selectedVal.numberOfOptions));
    }
  }, [selectedVal.options]);

  const [displayAnswerForTrueOrFalse, setDisplayAnswerForTrueOrFalse] =
    useState<string | undefined>("");
  useEffect(() => {
    if (property === "answer") {
      setDisplayAnswerForTrueOrFalse(selectedVal.answer[0] ? "まる" : "ばつ");
    }
  }, [selectedVal.answer]);

  const [isDisabledForEdit, setIsDisabledForEdit] = useState<boolean>(false);
  const [isUnderEditForType, setIsUnderEditForType] = useState<boolean>(false);
  useEffect(() => {
    if (underEditProperty) {
      setIsDisabledForEdit(property !== underEditProperty);
    } else {
      setIsDisabledForEdit(false);
    }
    if (property === "answer") {
      setIsUnderEditForType(underEditProperty ? true : false);
    }
  }, [underEditProperty]);

  return (
    <>
      <div>
        <Row className="pt-2 border-top">
          <Col className="align-top">{nameJp}</Col>
          {isUnderEdit ? (
            <Col className="align-top text-end">
              <Button
                variant="primary"
                className="py-1 px-2 me-2"
                onClick={handleOverwrite}
                disabled={isDisabled}
              >
                上書きする
              </Button>
              <Button
                variant="secondary"
                className="py-1 px-2"
                onClick={handleCancel}
              >
                キャンセル
              </Button>
            </Col>
          ) : (
            <Col className="align-top text-end">
              <Button
                variant="primary"
                className="py-1 px-2"
                onClick={handleEdit}
                disabled={isDisabledForEdit}
              >
                編集する
              </Button>
            </Col>
          )}
        </Row>
        <Row className="mb-3">
          {isUnderEdit || isUnderEditForType ? (
            <Col className="pt-2">
              {formType === "select" ? (
                <FormgroupSelectForList
                  property={property}
                  value={updatedValue as number}
                  onUpdate={handleUpdateFromTextAreaOrSelect}
                />
              ) : formType === "textarea" ? (
                <FormgroupTextareaForList
                  property={property}
                  value={updatedValue as string}
                  onUpdate={handleUpdateFromTextAreaOrSelect}
                />
              ) : (
                <FormgroupForAnswer
                  type={type as number}
                  numberOfOptions={numberOfOptions}
                  setNumberOfOptions={setNumberOfOptions}
                  options={options as OptionsType}
                  setOptions={setOptions}
                  answer={updatedValue as boolean[]}
                  onUpdate={handleUpdateFromAnswer}
                />
              )}
            </Col>
          ) : (
            <div>
              {formType === "textarea"
                ? (selectedVal[property as keyof Inputs] as string)
                : formType === "select"
                  ? textArrays[property as keyof textArraysType][
                      selectedVal[property as keyof Inputs] as number
                    ]
                  : type === 0
                    ? displayAnswerForTrueOrFalse
                    : displayAnswersForSelection}
            </div>
          )}
        </Row>
      </div>
    </>
  );
}

export default memo(QuestionDetailParts);

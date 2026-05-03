import { useState } from "react";
import FormgroupSelect from "./formgroups/FormgroupSelect";
import FormgroupTextarea from "./formgroups/FormgroupTextarea";
import FormgroupForAnswer from "./formgroups/FormgroupForAnswer";
import type { Inputs, InputsOmit } from "../types/inputs.type";
import { getData } from "../utils/common";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

type QuestionDetailPartsProps = {
  selectedKey: number;
  isDisabled: boolean;
  onUpdate: (
    value: boolean,
    value2: number | undefined,
    value3: boolean | undefined,
  ) => void;
  formType: string;
  formInfo: [any, any, string, keyof InputsOmit];
  typeValue?: number;
  isIndex1UnderEdit?: boolean;
};
export default function QuestionDetailParts({
  selectedKey,
  isDisabled,
  onUpdate,
  formType,
  formInfo,
  typeValue,
  isIndex1UnderEdit,
}: QuestionDetailPartsProps) {
  const data = getData();
  const [selectedVal, setSelectedVal] = useState<Inputs | undefined>(
    data.get(selectedKey),
  );
  const [isUnderEdit, setIsUnderEdit] = useState<boolean>(false);

  const handleEdit = (aProperty: string) => {
    setIsUnderEdit((prev) => !prev);
    const isFormOpened = aProperty === "type" ? true : undefined;
    onUpdate(!isUnderEdit, undefined, isFormOpened);
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
    if (selectedVal && targetElm) {
      const newVal = { ...selectedVal, [aProperty]: targetElm.value };
      setSelectedVal(newVal);
      data.set(selectedKey, newVal);
      localStorage.setItem("TrueOrFalseData", JSON.stringify([...data]));
    }
    setIsUnderEdit((prev) => !prev);
    const type =
      aFormType === "select" && aProperty === "type"
        ? parseInt(targetElm.value)
        : undefined;
    const isFormOpened = aProperty === "type" ? false : undefined;
    onUpdate(!isUnderEdit, type, isFormOpened);
  };

  const handleCancel = (aProperty: string) => {
    setIsUnderEdit((prev) => !prev);
    const isFormOpened = aProperty === "type" ? false : undefined;
    onUpdate(!isUnderEdit, typeValue, isFormOpened);
  };

  const lookupKey = selectedVal?.[formInfo[3]];

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
                disabled={isDisabled}
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
                />
              ) : formType === "textarea" ? (
                <FormgroupTextarea
                  register={formInfo[0]}
                  label={formInfo[2]}
                  name={formInfo[3]}
                  selectedValue={
                    selectedVal && (selectedVal[formInfo[3]] as string)
                  }
                />
              ) : (
                <FormgroupForAnswer
                  register={formInfo[0]}
                  selectedValues={[selectedVal?.answer, selectedVal?.options]}
                  questionTypeNumber={typeValue as number}
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
                  : !typeValue
                    ? selectedVal?.answer[0]
                      ? "まる"
                      : "ばつ"
                    : "selection"}
            </Col>
          )}
        </Row>
      </div>
    </>
  );
}

import { useState } from "react";
import FormgroupSelect from "./formgroups/FormgroupSelect";
import FormgroupTextarea from "./formgroups/FormgroupTextarea";
import type { Inputs } from "../types/inputs.type";
import { getData } from "../utils/common";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

type InputsOmit = Omit<Inputs, "answer" | "areCorrectAnswers">;

type QuestionDetailPartsProps = {
  selectedKey: number;
  indexNoUnderEdit: number;
  formType: string;
  formInfo: [any, any, string, keyof InputsOmit];
};
export default function QuestionDetailParts({
  selectedKey,
  indexNoUnderEdit,
  formType,
  formInfo,
}: QuestionDetailPartsProps) {
  const data = getData();
  const selectedVal: Inputs | undefined = data.get(selectedKey);

  const [isUnderEdit, setIsUnderEdit] = useState<boolean>(false);

  const handleEdit = () => {
    console.log("edit");
    setIsUnderEdit((prev) => !prev);
  };

  const handleOverwrite = () => {
    console.log("overwrite");
    setIsUnderEdit((prev) => !prev);
  };

  const handleCancel = () => {
    setIsUnderEdit((prev) => !prev);
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
                onClick={() => handleOverwrite()}
              >
                上書きする
              </Button>
              <Button
                variant="secondary"
                className="py-1 px-2"
                onClick={() => handleCancel()}
              >
                キャンセル
              </Button>
            </Col>
          ) : (
            <Col className="align-top text-end">
              <Button
                variant="primary"
                className="py-1 px-2"
                onClick={() => handleEdit()}
              >
                編集する
              </Button>
            </Col>
          )}
        </Row>
        <Row className="mb-3">
          {isUnderEdit ? (
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
                  errors={null}
                  label={formInfo[2]}
                  name={formInfo[3]}
                  selectedValue={
                    selectedVal && (selectedVal[formInfo[3]] as string)
                  }
                />
              ) : (
                ""
              )}
            </Col>
          ) : (
            <Col>
              {formType === "select"
                ? selectedVal && formInfo[1][selectedVal[formInfo[3]]]
                : formType === "textarea"
                  ? selectedVal && selectedVal[formInfo[3]]
                  : ""}
            </Col>
          )}
          {formInfo[3]}
        </Row>
      </div>
    </>
  );
}

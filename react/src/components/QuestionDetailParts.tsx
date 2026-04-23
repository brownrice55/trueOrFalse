import { useState } from "react";
import FormgroupSelect from "./formgroups/FormgroupSelect";
import FormgroupTextarea from "./formgroups/FormgroupTextarea";
import type { Inputs } from "../types/inputs.type";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

type QuestionDetailPartsProps = {
  selectedVal: Inputs;
  indexNoUnderEdit: number;
  formType: string;
  formInfo: [any, any, string, string];
};
export default function QuestionDetailParts({
  selectedVal,
  indexNoUnderEdit,
  formType,
  formInfo,
}: QuestionDetailPartsProps) {
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
                  selectedValue={selectedVal[formInfo[3]]}
                />
              ) : formType === "textarea" ? (
                <FormgroupTextarea
                  register={formInfo[0]}
                  errors={null}
                  label={formInfo[2]}
                  name={formInfo[3]}
                  selectedValue={selectedVal[formInfo[3]]}
                />
              ) : (
                ""
              )}
            </Col>
          ) : (
            <Col>
              {formType === "select"
                ? formInfo[1][selectedVal[formInfo[3]]]
                : selectedVal[formInfo[3]]}
            </Col>
          )}
        </Row>
      </div>
    </>
  );
}

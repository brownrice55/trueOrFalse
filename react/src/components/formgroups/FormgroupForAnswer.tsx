import { memo } from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { answerArrayText } from "../../utils/labels";
import type { OptionsType } from "../../types/inputs.type";

type FormgroupForAnswerProps = {
  type: number;
  numberOfOptions: number;
  options: OptionsType;
  answer: boolean[];
  onUpdate: (
    value: string | boolean | boolean[],
    index?: number,
    property?: string,
  ) => void;
};
function FormgroupForAnswer({
  type,
  numberOfOptions,
  options,
  answer,
  onUpdate,
}: FormgroupForAnswerProps) {
  const handleAnswer = (
    e: React.ChangeEvent<HTMLInputElement>,
    aProperty: string,
  ) => {
    const targetValue = e.currentTarget.value;
    if (onUpdate) {
      onUpdate(targetValue, undefined, aProperty);
    }
  };

  const handleNumberOfOptions = (
    e: React.ChangeEvent<HTMLSelectElement>,
    aProperty: string,
  ) => {
    const targetValue = e.currentTarget.value;
    if (onUpdate) {
      onUpdate(targetValue, undefined, aProperty);
    }
  };
  const handleOptions = (
    e: React.ChangeEvent<HTMLInputElement>,
    aIndex: number,
    aAnswersProperty: string,
  ) => {
    const targetValue =
      aAnswersProperty === "isActive"
        ? e.currentTarget.checked
        : e.currentTarget.value;
    if (onUpdate) {
      onUpdate(targetValue, aIndex, aAnswersProperty);
    }
  };

  return type === 0 ? (
    <Form.Group className="mb-3">
      <div className="d-flex">
        {answerArrayText.map((val, index) => (
          <Form.Check
            type="radio"
            key={index}
            id={`answer-${index}`}
            label={val}
            className="pe-4"
            checked={answer[index]}
            onChange={(e) => handleAnswer(e, "answer")}
          />
        ))}
      </div>
    </Form.Group>
  ) : (
    <Form.Group className="mb-3">
      <Form.Label>選択肢の数</Form.Label>
      <Form.Select
        defaultValue={numberOfOptions}
        onChange={(e) => handleNumberOfOptions(e, "numberOfOptions")}
      >
        {Array(9)
          .fill(0)
          .map((_, index) => (
            <option value={index + 2} key={index + 2}>
              {index + 2}
            </option>
          ))}
      </Form.Select>
      <p className="pt-2">
        選択肢を入力して、正解の選択肢にチェックを入れてください。
      </p>
      {(options as OptionsType).map(
        (val: { isActive: boolean; value: string }, index: number) => (
          <Row className="mb-3" key={index}>
            <Col md={1}>
              <Form.Check
                type="checkbox"
                id=""
                label=""
                defaultChecked={val.isActive}
                onChange={(e) => handleOptions(e, index, "isActive")}
              />
            </Col>
            <Col md={9}>
              <Form.Control
                type="text"
                defaultValue={val.value}
                onChange={(e) =>
                  handleOptions(
                    e as React.ChangeEvent<HTMLInputElement>,
                    index,
                    "value",
                  )
                }
              />
            </Col>
          </Row>
        ),
      )}
    </Form.Group>
  );
}

export default memo(FormgroupForAnswer);

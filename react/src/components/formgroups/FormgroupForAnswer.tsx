import { memo } from "react";
import type { Dispatch, SetStateAction } from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { answerArrayText } from "../../utils/labels";
import type { OptionsType } from "../../types/inputs.type";

type FormgroupForAnswerProps = {
  type: number;
  numberOfOptions: number;
  setNumberOfOptions: Dispatch<SetStateAction<number>>;
  options: OptionsType;
  setOptions: Dispatch<SetStateAction<OptionsType>>;
  answer: boolean[];
  onUpdate: (
    value: string | boolean | boolean[] | OptionsType | number,
    property?: string,
  ) => void;
};
function FormgroupForAnswer({
  type,
  numberOfOptions,
  setNumberOfOptions,
  options,
  setOptions,
  answer,
  onUpdate,
}: FormgroupForAnswerProps) {
  const handleAnswer = (aIndex: number, aProperty: string) => {
    const resetAnswer = Array(2).fill(false);
    resetAnswer[aIndex] = true;
    if (onUpdate) {
      onUpdate(resetAnswer, aProperty);
    }
  };

  const handleNumberOfOptions = (
    e: React.ChangeEvent<HTMLSelectElement>,
    aProperty: string,
  ) => {
    const newNumberOfOption = parseInt(e.currentTarget.value);
    if (onUpdate) {
      onUpdate(newNumberOfOption, aProperty);
    }
    setNumberOfOptions(newNumberOfOption);

    const newOptions = Array.from(
      { length: newNumberOfOption },
      (_, idx) => options[idx] ?? { isActive: false, value: "" },
    );
    setOptions(newOptions);
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

    const newOptions = structuredClone(options);
    const targetOption = newOptions[aIndex!];
    if (!targetOption) return;
    if (aAnswersProperty === "isActive" && typeof targetValue === "boolean") {
      targetOption[aAnswersProperty] = targetValue;
    } else if (
      aAnswersProperty === "value" &&
      typeof targetValue === "string"
    ) {
      targetOption[aAnswersProperty] = targetValue;
    }
    setOptions(newOptions);

    if (onUpdate) {
      onUpdate(newOptions, "options");
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
            onChange={() => handleAnswer(index, "answer")}
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
      {Array(numberOfOptions)
        .fill("")
        .map((_, idx: number) => (
          <Row className="mb-3" key={idx}>
            <Col md={1}>
              <Form.Check
                type="checkbox"
                id=""
                label=""
                defaultChecked={options[idx].isActive ?? false}
                onChange={(e) => handleOptions(e, idx, "isActive")}
              />
            </Col>
            <Col md={9}>
              <Form.Control
                type="text"
                defaultValue={options[idx].value ?? ""}
                onChange={(e) =>
                  handleOptions(
                    e as React.ChangeEvent<HTMLInputElement>,
                    idx,
                    "value",
                  )
                }
              />
            </Col>
          </Row>
        ))}
    </Form.Group>
  );
}

export default memo(FormgroupForAnswer);

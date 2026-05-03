import { useState } from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import type { UseFormRegister } from "react-hook-form";
import { answerArrayText } from "../../utils/labels";
import type { Inputs } from "../../types/inputs.type";

type FormgroupForAnswerProps = {
  register?: UseFormRegister<Inputs>;
  selectedValues: any;
  onUpdate?: (value: number) => void;
  questionTypeNumber?: number;
};

export default function FormgroupForAnswer({
  register,
  selectedValues,
  onUpdate,
  questionTypeNumber,
}: FormgroupForAnswerProps) {
  const [answerArray, setAnswerArray] = useState<boolean[]>([true, false]);

  const [theNumberOfOptions, setTheNumberOfOptions] = useState<number>(2);
  const handleNumberOfOptions = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTheNumberOfOptions(parseInt(e.target.value));
  };

  const handleAnswer = (aIndex: number) => {
    const resetArray = Array(2).fill(false);
    resetArray[aIndex] = true;
    setAnswerArray(resetArray);
  };

  // const handleOnChange = (
  //   e: React.ChangeEvent<HTMLRadioElement>,
  //   aName: string,
  // ) => {
  //   if (aName !== "type") {
  //     return;
  //   }
  //   const eventTargetValue = (e.currentTarget as HTMLSelectElement).value;
  //   if (onUpdate) {
  //     onUpdate(parseInt(eventTargetValue));
  //   }
  // };

  return questionTypeNumber === 0 ? (
    <Form.Group className="mb-3">
      {register && <Form.Label>答え</Form.Label>}
      <div className="d-flex">
        {answerArrayText.map((val, index) => (
          <Form.Check
            type="radio"
            key={index}
            id={`answer-${index}`}
            label={val}
            className="pe-4"
            {...(register && register(`answer`))}
            checked={answerArray[index]}
            onChange={() => handleAnswer(index)}
          />
        ))}
      </div>
    </Form.Group>
  ) : (
    <Form.Group className="mb-3">
      <Form.Label>選択肢の数</Form.Label>
      <Form.Select
        {...(register && register("numberOfOptions"))}
        onChange={(e) => handleNumberOfOptions(e)}
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
      {Array(theNumberOfOptions)
        .fill("")
        .map((_, index) => (
          <Row className="mb-3" key={index}>
            <Col md={1}>
              <Form.Check
                type="checkbox"
                id=""
                label=""
                {...(register && register(`options.${index}.isActive`))}
              />
            </Col>
            <Col md={9}>
              <Form.Control
                type="text"
                {...(register && register(`options.${index}.value`))}
              />
            </Col>
          </Row>
        ))}
    </Form.Group>
  );
}

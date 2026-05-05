import { useState } from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { answerArrayText } from "../../utils/labels";

type FormgroupForAnswerProps = {
  questionTypeNumber: number;
  onUpdate: (value: boolean[]) => void;
  answerArray: boolean[];
};

export default function FormgroupForAnswer({
  questionTypeNumber,
  onUpdate,
  answerArray,
}: FormgroupForAnswerProps) {
  const [radioValue, setRadioValue] = useState<boolean[]>(answerArray);

  const [theNumberOfOptions, setTheNumberOfOptions] = useState<number>(2);
  const handleNumberOfOptions = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTheNumberOfOptions(parseInt(e.target.value));
  };

  const handleAnswer = (aIndex: number) => {
    const resetArray = Array(2).fill(false);
    resetArray[aIndex] = true;
    setRadioValue(resetArray);
    onUpdate(resetArray);
  };

  return questionTypeNumber === 0 ? (
    <Form.Group className="mb-3">
      <div className="d-flex">
        {answerArrayText.map((val, index) => (
          <Form.Check
            type="radio"
            key={index}
            id={`answer-${index}`}
            label={val}
            className="pe-4"
            checked={radioValue[index]}
            onChange={() => handleAnswer(index)}
          />
        ))}
      </div>
    </Form.Group>
  ) : (
    <Form.Group className="mb-3">
      <Form.Label>選択肢の数</Form.Label>
      <Form.Select onChange={(e) => handleNumberOfOptions(e)}>
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
              <Form.Check type="checkbox" id="" label="" />
            </Col>
            <Col md={9}>
              <Form.Control type="text" />
            </Col>
          </Row>
        ))}
    </Form.Group>
  );
}

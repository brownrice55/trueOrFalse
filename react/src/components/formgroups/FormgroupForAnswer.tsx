import { useState } from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { answerArrayText } from "../../utils/labels";

type FormgroupForAnswerProps = {
  questionTypeNumber: number;
  onUpdate: (
    value: number,
    value2: boolean[] | { isActive: boolean; value: string }[],
    value3: number,
  ) => void;
  answerArray: boolean[];
  numberOfOptions: number;
  options: { isActive: boolean; value: string }[];
};

export default function FormgroupForAnswer({
  questionTypeNumber,
  onUpdate,
  answerArray,
  numberOfOptions,
  options,
}: FormgroupForAnswerProps) {
  const [radioValue, setRadioValue] = useState<boolean[]>(answerArray);
  const [selectionValue, setSelectionValue] =
    useState<{ isActive: boolean; value: string }[]>(options);

  const [numberOfOptionsValue, setNumberOfOptionsValue] =
    useState<number>(numberOfOptions);

  const [errorMsg, setErrorMsg] = useState<string>("");
  const [errorMsgForValue, setErrorMsgForValue] = useState<string>("");

  const handleNumberOfOptions = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newNumberOfOptions = parseInt(e.target.value);
    setNumberOfOptionsValue(newNumberOfOptions);
    onUpdate(questionTypeNumber, [true, false], newNumberOfOptions);
  };

  const handleAnswer = (aIndex: number) => {
    const resetArray = Array(2).fill(false);
    resetArray[aIndex] = true;
    setRadioValue(resetArray);
    onUpdate(questionTypeNumber, resetArray, 2);
  };

  const handleOptions = (
    aValue: boolean | string,
    aIndexIsActive: number | undefined,
    aIndexValue: number | undefined,
  ) => {
    const newOptions = Array.from(
      { length: numberOfOptions },
      (_, idx) => options[idx] ?? { isActive: false, value: "" },
    );

    if (aIndexIsActive !== undefined) {
      //checkbox
      newOptions[aIndexIsActive].isActive = aValue as boolean;
    }
    if (aIndexValue !== undefined) {
      //input
      newOptions[aIndexValue].value = aValue as string;
    }

    const { isActives, values } = newOptions.reduce(
      (acc, val) => {
        acc.isActives.push(val.isActive);
        acc.values.push(val.value);
        return acc;
      },
      { isActives: [] as boolean[], values: [] as string[] },
    );

    const uniqueValues = [...new Set(values)];
    setSelectionValue(newOptions);
    const allFalse = isActives.every((val) => !val);
    const areBlanks = values.some((val) => !val);
    if (allFalse || areBlanks || uniqueValues.length !== options.length) {
      if (allFalse) {
        setErrorMsg("正解の選択肢にチェックを入れてください。");
      } else {
        setErrorMsg("");
      }
      if (areBlanks || uniqueValues.length !== options.length) {
        let errorMsg = "";
        if (areBlanks) {
          errorMsg = "選択肢を入力してください。";
        }
        if (uniqueValues.length !== options.length) {
          errorMsg += "異なる選択肢を入力してください。";
        }
        setErrorMsgForValue(errorMsg);
      }
    } else {
      setErrorMsg("");
      setErrorMsgForValue("");
      onUpdate(questionTypeNumber, newOptions, numberOfOptions);
    }
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
      <Form.Select
        defaultValue={numberOfOptions}
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
        <span className="text-danger d-block small ms-2 mt-2">
          {errorMsg}
          {errorMsgForValue}
        </span>
      </p>
      {Array(numberOfOptionsValue)
        .fill("")
        .map((_, index) => (
          <Row className="mb-3" key={index}>
            <Col md={1}>
              <Form.Check
                type="checkbox"
                id=""
                label=""
                checked={
                  selectionValue.length
                    ? selectionValue[index]
                      ? selectionValue[index].isActive
                      : false
                    : false
                }
                onChange={(e) =>
                  handleOptions(e.target.checked, index, undefined)
                }
              />
            </Col>
            <Col md={9}>
              <Form.Control
                type="text"
                defaultValue={
                  selectionValue.length
                    ? selectionValue[index]
                      ? selectionValue[index].value
                      : ""
                    : ""
                }
                onChange={(e) =>
                  handleOptions(e.target.value, undefined, index)
                }
              />
            </Col>
          </Row>
        ))}
    </Form.Group>
  );
}

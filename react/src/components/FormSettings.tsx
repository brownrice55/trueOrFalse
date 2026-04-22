import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import type { SubmitHandler, SubmitErrorHandler } from "react-hook-form";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import { getData, getCategories } from "../utils/common";
import type { Inputs } from "../types/inputs.type";
import type { InputCategoryCategories } from "../types/inputsCategory.type";

export default function FormSettings() {
  const data = getData();
  const originalCategories = getCategories();

  const keysArray: number[] = data.size ? Array.from(data.keys()) : [];
  const nextId: number = data.size ? keysArray[keysArray.length - 1] + 1 : 1;

  const defaultValues = {
    category: 0,
    type: 0,
    question: "",
    explanation: "",
    priority: 1,
    answer: [true, false],
    numberOfOptions: 2,
  };

  const typeOptionArray = ["まるばつクイズ", "選択問題"];
  const priorityOptionArray = ["低い", "普通", "高い"];
  const answerArrayText = ["まる", "ばつ"];
  const [answerArray, setAnswerArray] = useState<boolean[]>([true, false]);

  const handleAnswer = (aIndex: number) => {
    const resetArray = Array(2).fill(false);
    resetArray[aIndex] = true;
    setAnswerArray(resetArray);
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm({
    defaultValues,
    mode: "onChange",
  });

  const onsubmit: SubmitHandler<Inputs> = (values) => {
    data.set(nextId, values);
    values.answer = answerArray;
    localStorage.setItem("trueOrFalseData", JSON.stringify([...data]));
  };
  const onerror: SubmitErrorHandler<Inputs> = (err) => console.log(err);

  const [questionTypeNumber, setQuestionTypeNumber] = useState<number>(0);
  const handleTypeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQuestionTypeNumber(parseInt(e.target.value));
  };

  const [theNumberOfOptions, setTheNumberOfOptions] = useState<number>(2);
  const handleNumberOfOptions = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTheNumberOfOptions(parseInt(e.target.value));
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  return (
    <Form onSubmit={handleSubmit(onsubmit, onerror)} noValidate>
      <Form.Group className="mb-3">
        <Form.Label>カテゴリー</Form.Label>
        <Form.Select {...register("category")}>
          {originalCategories.categories.map(
            (val: InputCategoryCategories, index) => (
              <option value={index} key={index}>
                {val.categoryName}
              </option>
            ),
          )}
          <option value="">カテゴリーを追加する</option>
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>クイズの種類</Form.Label>
        <Form.Select
          {...register("type")}
          onChange={(e) => handleTypeSelect(e)}
        >
          {typeOptionArray.map((val, index) => (
            <option value={index} key={index}>
              {val}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="question">
          問題
          <span className="text-danger small ms-2 mt-2">
            {errors.question?.message}
          </span>
        </Form.Label>
        <Form.Control
          id="question"
          as="textarea"
          rows={5}
          {...register("question", {
            required: "必須です",
          })}
        />
      </Form.Group>

      {questionTypeNumber === 0 ? (
        <Form.Group className="mb-3">
          <Form.Label>答え</Form.Label>
          <div className="d-flex">
            {answerArrayText.map((val, index) => (
              <Form.Check
                type="radio"
                key={index}
                id={`answer-${index}`}
                label={<label htmlFor={`answer-${index}`}>{val}</label>}
                className="pe-4"
                {...register(`answer.${index}`)}
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
            {...register("numberOfOptions")}
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
                  <Form.Check type="checkbox" id="" label="" />
                </Col>
                <Col md={9}>
                  <Form.Control type="text" />
                </Col>
              </Row>
            ))}
        </Form.Group>
      )}

      <Form.Group className="mb-3">
        <Form.Label htmlFor="explanation">
          解説
          <span className="text-danger small ms-2 mt-2">
            {errors.explanation?.message}
          </span>
        </Form.Label>
        <Form.Control
          id="explanation"
          as="textarea"
          rows={5}
          {...register("explanation", {
            required: "必須です",
          })}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>優先順位</Form.Label>
        <Form.Select {...register("priority")}>
          {priorityOptionArray.map((val, index) => (
            <option value={index} key={index}>
              {val}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <div className="text-center">
        <Button variant="primary" type="submit" className="py-2 px-3">
          登録する
        </Button>
      </div>
    </Form>
  );
}

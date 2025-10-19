import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import type { SubmitHandler, SubmitErrorHandler } from "react-hook-form";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { getData } from "../utils/common";
import type { Inputs } from "../types/inputs.type";

export default function FormSettings() {
  const data = getData();

  const keysArray: number[] = data.size ? Array.from(data.keys()) : [];
  const nextId: number = data.size ? keysArray[keysArray.length - 1] + 1 : 1;

  const defaultValues = {
    question: "",
    explanation: "",
    priority: 1,
    answer: [true, false],
  };

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

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  return (
    <Form onSubmit={handleSubmit(onsubmit, onerror)} noValidate>
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
        <Button variant="primary" type="submit" className="py-3 px-5">
          登録する
        </Button>
      </div>
    </Form>
  );
}

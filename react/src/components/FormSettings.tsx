import { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import type { SubmitHandler, SubmitErrorHandler } from "react-hook-form";
import FormgroupSelect from "./formgroups/FormgroupSelect";
import FormgroupTextarea from "./formgroups/FormgroupTextarea";
import { DataContext } from "../contexts/context";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import {
  typeOptionArray,
  priorityOptionArray,
  categoryNameArray,
} from "../utils/labels";
import type { Inputs } from "../types/inputs.type";

export default function FormSettings() {
  const originalData = useContext(DataContext);
  if (!originalData) return null; //******later */

  const { data, setData } = originalData;

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
    notes: "",
    areCorrectAnswers: [false],
  };

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
    localStorage.setItem("TrueOrFalseData", JSON.stringify([...data]));
    setData(data);
  };
  const onerror: SubmitErrorHandler<Inputs> = (err) => console.log(err);

  const [questionTypeNumber, setQuestionTypeNumber] = useState<number>(0);

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
      <FormgroupSelect
        register={register}
        textArray={categoryNameArray}
        label={"カテゴリー"}
        name={"category"}
        selectedValue={0}
      />
      <FormgroupSelect
        register={register}
        textArray={typeOptionArray}
        label={"クイズの種類"}
        name={"type"}
        selectedValue={0}
      />
      <FormgroupTextarea
        register={register}
        errors={errors}
        label={"問題"}
        name={"question"}
        selectedValue={""}
      />
      {questionTypeNumber === 0 ? (
        <Form.Group className="mb-3">
          <Form.Label>答え</Form.Label>
          <div className="d-flex">
            {answerArrayText.map((val, index) => (
              <Form.Check
                type="radio"
                key={index}
                id={`answer`}
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
      <FormgroupTextarea
        register={register}
        errors={errors}
        label={"解説"}
        name={"explanation"}
        selectedValue={""}
      />
      <FormgroupSelect
        register={register}
        textArray={priorityOptionArray}
        label={"優先順位"}
        name={"priority"}
        selectedValue={0}
      />
      <Form.Control type="hidden" {...register("notes")} value="" />
      <Form.Control
        type="hidden"
        {...register("areCorrectAnswers")}
        value={[]}
      />
      <div className="text-center">
        <Button variant="primary" type="submit" className="py-2 px-3">
          登録する
        </Button>
      </div>
    </Form>
  );
}

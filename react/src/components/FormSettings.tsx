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
  answerArrayText,
} from "../utils/labels";
import type { Inputs } from "../types/inputs.type";
import type { DataContextType } from "../types/dataContextType.type";

export default function FormSettings() {
  const { data, setData } = useContext(DataContext) as DataContextType;

  const keysArray: number[] = data.size ? Array.from(data.keys()) : [];
  const [nextId, setNextId] = useState<number>(
    data.size ? keysArray[keysArray.length - 1] + 1 : 1,
  );

  const defaultValues = {
    id: nextId,
    category: 0,
    type: 0,
    question: "",
    answer: [true, false],
    numberOfOptions: 2,
    options: [{ isActive: false, value: "" }],
    explanation: "",
    priority: 1,
    notes: "",
    areCorrectAnswers: [false],
  };

  const [answerArray, setAnswerArray] = useState<boolean[]>([true, false]);

  const handleAnswer = (aIndex: number) => {
    const resetArray = answerArray.map((_, idx) => idx === aIndex);
    setAnswerArray(resetArray);
  };

  const {
    register,
    watch,
    trigger,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isSubmitSuccessful },
  } = useForm({
    defaultValues,
    mode: "onChange",
  });

  const onsubmit: SubmitHandler<Inputs> = (values) => {
    values.id = nextId;
    data.set(nextId, values);
    values.answer = answerArray;
    localStorage.setItem("TrueOrFalseData", JSON.stringify([...data]));
    setData(data);
    setQuestionTypeNumber(0);
    setNextId((prev) => prev + 1);
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

  const handleUpdate = (aNumber: number) => {
    setQuestionTypeNumber(aNumber);
  };

  const optionValues = watch("options") || [];

  return (
    <Form onSubmit={handleSubmit(onsubmit, onerror)} noValidate>
      <FormgroupSelect
        register={register}
        textArray={categoryNameArray}
        label={"カテゴリー"}
        name={"category"}
        selectedValue={0}
        isLabelNeeded={true}
      />
      <FormgroupSelect
        register={register}
        textArray={typeOptionArray}
        label={"クイズの種類"}
        name={"type"}
        selectedValue={0}
        onUpdate={handleUpdate}
        isLabelNeeded={true}
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
            .map((_, index) => {
              const errorMsg = errors?.options?.[index]?.value?.message;
              const errorMsgForIsActive =
                errors?.options?.[index]?.isActive?.message;
              return (
                <Row className="mb-3" key={index}>
                  <Col md={1}>
                    <Form.Check
                      type="checkbox"
                      id=""
                      label=""
                      {...register(`options.${index}.isActive`, {
                        onChange: () => {
                          trigger("options");
                        },
                        validate: () => {
                          const atLeastOneChecked = optionValues.some(
                            (val) => val?.isActive,
                          );
                          return atLeastOneChecked
                            ? true
                            : "正解の選択肢にチェックを入れてください。";
                        },
                      })}
                    />
                  </Col>
                  <Col md={9}>
                    <Form.Control
                      type="text"
                      {...register(`options.${index}.value`, {
                        required: "必須です。",
                        validate: (currentVal) => {
                          const allOptions = getValues("options") || [];
                          const duplicates = allOptions.filter(
                            (item) => item.value === currentVal,
                          );
                          if (duplicates.length > 1) {
                            return "異なる選択肢を入力してください。";
                          }
                          return true;
                        },
                      })}
                    />
                    <span className="text-danger small ms-2 mt-2">
                      {errorMsg}
                      {errorMsgForIsActive}
                    </span>
                  </Col>
                </Row>
              );
            })}
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
        isLabelNeeded={true}
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

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import type { SubmitHandler, SubmitErrorHandler } from "react-hook-form";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import type { InputsCategory } from "../types/inputsCategory.type";

const getCategories = (): InputsCategory => {
  const raw = localStorage.getItem("TrueOrFalseCategory");
  const data: {
    categoryId: number;
    categoryName: string;
    isActive: boolean;
  }[] = raw
    ? JSON.parse(raw)
    : [{ categoryId: 0, categoryName: "", isActive: false }];
  return { categories: data };
};

export default function FormCategory() {
  const originalCategories = getCategories();
  const [categoryData, setCategoryData] =
    useState<InputsCategory>(originalCategories);
  const defaultValues = categoryData;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm<InputsCategory>({
    defaultValues,
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray<InputsCategory>({
    control,
    name: "categories",
  });

  const onsubmit: SubmitHandler<InputsCategory> = (values) => {
    const inputData = values.categories.map((val) => ({
      ...val,
      categoryId: val.categoryId,
    }));
    localStorage.setItem("TrueOrFalseCategory", JSON.stringify(inputData));
    setCategoryData({ categories: inputData });
  };

  const onerror: SubmitErrorHandler<InputsCategory> = (err) => console.log(err);

  const handleCancel = () => {
    reset();
  };

  const handleEdit = () => {
    console.log("edit");
  };

  const handleDelete = (aIndex: number) => {
    remove(aIndex);
  };

  const handleAddField = () => {
    const nextId = categoryData.categories.length + 1 || 1;
    append({ categoryId: nextId, categoryName: "", isActive: false });
  };

  return (
    <>
      <Form onSubmit={handleSubmit(onsubmit, onerror)} noValidate>
        {fields.map((field: any, index: number) => (
          <Form.Group className="my-4" key={index}>
            {field.isActive && <span>問題に設定済みのカテゴリー名</span>}
            <div className={field.isActive ? "position-relative" : ""}>
              <Form.Control
                size="lg"
                id={`categories${index}`}
                as="input"
                {...register(`categories.${index}.categoryName`)}
                defaultValue={field.categoryName}
                disabled={field.isActive}
              />
              <Form.Control
                type="hidden"
                {...register(`categories.${index}.categoryId`, {
                  valueAsNumber: true,
                })}
                value={field.categoryId ?? index}
              />
              <Form.Control
                type="hidden"
                {...register(`categories.${index}.isActive`)}
                value={field.isActive ?? false}
              />
              <div className="text-danger pt-2">
                {!index && errors.categories?.[index]?.categoryName?.message}
              </div>
              {field.isActive && (
                <div className="position-absolute top-0 end-0 mt-2 me-2">
                  <Button
                    variant="primary"
                    className="py-1 px-2 me-2"
                    onClick={handleEdit}
                  >
                    編集
                  </Button>
                  <Button
                    variant="primary"
                    className="py-1 px-2"
                    onClick={() => handleDelete(index)}
                  >
                    削除
                  </Button>
                </div>
              )}
            </div>
          </Form.Group>
        ))}

        <div className="text-end">
          <Button
            variant="primary"
            className="py-1 px-2"
            onClick={handleAddField}
          >
            追加する
          </Button>
        </div>
        <div className="text-center mt-5">
          <Button
            variant="primary"
            className="py-2 px-3 me-3"
            onClick={handleCancel}
          >
            キャンセルする
          </Button>
          <Button
            variant="primary"
            type="submit"
            className="py-2 px-3"
            disabled={!isDirty || !isValid}
          >
            保存する
          </Button>
        </div>
      </Form>
    </>
  );
}

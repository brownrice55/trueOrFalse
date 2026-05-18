import Form from "react-bootstrap/Form";
import type { UseFormRegister } from "react-hook-form";
import type { Inputs } from "../../types/inputs.type";

type FormgroupTextareaProps = {
  register?: UseFormRegister<Inputs>;
  errors?: any;
  label: string;
  name: keyof Inputs;
  selectedValue: string | undefined;
  from?: string;
  onUpdate?: (isEmpty: boolean) => void;
};

export default function FormgroupTextarea({
  register,
  errors,
  label,
  name,
  selectedValue,
  from,
  onUpdate,
}: FormgroupTextareaProps) {
  const handleValidation = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (from !== "quizList") {
      return;
    }
    const targetValue = e.currentTarget.value;
    if (onUpdate) {
      onUpdate(targetValue === "" || targetValue === selectedValue);
    }
  };

  return (
    <Form.Group className="mb-3">
      {register && (
        <Form.Label htmlFor={name}>
          {label}
          <span className="text-danger small ms-2 mt-2">
            {errors[name]?.message}
          </span>
        </Form.Label>
      )}
      <Form.Control
        id={name}
        as="textarea"
        rows={5}
        defaultValue={selectedValue}
        {...(register &&
          register(name, {
            required: "必須です。",
          }))}
        onChange={(e) =>
          handleValidation(e as React.ChangeEvent<HTMLTextAreaElement>)
        }
      />
    </Form.Group>
  );
}

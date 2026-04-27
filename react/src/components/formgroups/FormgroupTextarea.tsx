import Form from "react-bootstrap/Form";
import type { UseFormRegister } from "react-hook-form";
import type { Inputs } from "../../types/inputs.type";

type FormgroupTextareaProps = {
  register: UseFormRegister<Inputs> | null;
  errors: any;
  label: string;
  name: keyof Inputs;
  selectedValue: string | undefined;
};

export default function FormgroupTextarea({
  register,
  errors,
  label,
  name,
  selectedValue,
}: FormgroupTextareaProps) {
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
        id="question"
        as="textarea"
        rows={5}
        defaultValue={selectedValue}
        {...(register &&
          register(name, {
            required: "必須です",
          }))}
      />
    </Form.Group>
  );
}

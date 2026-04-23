import Form from "react-bootstrap/Form";

type FormgroupTextareaProps = {
  register: any;
  errors: any;
  label: string;
  name: string;
  value: string;
};

export default function FormgroupTextarea({
  register,
  errors,
  label,
  name,
  value,
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
        defaultValue={value}
        {...(register &&
          register(name, {
            required: "必須です",
          }))}
      />
    </Form.Group>
  );
}

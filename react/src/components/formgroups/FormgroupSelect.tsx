import Form from "react-bootstrap/Form";
import type { UseFormRegister } from "react-hook-form";
import type { Inputs } from "../../types/inputs.type";

type FormgroupSelectProps = {
  register: UseFormRegister<Inputs> | null;
  textArray: string[];
  label: string;
  name: keyof Inputs;
  selectedValue: number | undefined;
};

export default function FormgroupSelect({
  register,
  textArray,
  label,
  name,
  selectedValue,
}: FormgroupSelectProps) {
  return (
    <Form.Group className="mb-3">
      {label && <Form.Label>{label}</Form.Label>}
      <Form.Select
        {...(register && register(name))}
        defaultValue={selectedValue}
      >
        {textArray.map((val: string, index) => (
          <option value={index} key={index}>
            {val}
          </option>
        ))}
        {label === "カテゴリー" && (
          <option value="">カテゴリーを追加する</option>
        )}
      </Form.Select>
    </Form.Group>
  );
}

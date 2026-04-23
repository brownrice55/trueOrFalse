import Form from "react-bootstrap/Form";

type FormgroupSelectProps = {
  register: any;
  textArray: string[];
  label: string;
  name: string;
  selectedValue: number;
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
      {register && <Form.Label>{label}</Form.Label>}
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

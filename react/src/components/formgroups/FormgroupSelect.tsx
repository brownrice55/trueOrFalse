import Form from "react-bootstrap/Form";
import type { UseFormRegister } from "react-hook-form";
import type { Inputs } from "../../types/inputs.type";

type FormgroupSelectProps = {
  register?: UseFormRegister<Inputs>;
  textArray: string[];
  label: string;
  name: keyof Inputs;
  selectedValue: number | undefined;
  onUpdate?: (value: number) => void;
  isLabelNeeded?: boolean;
};

export default function FormgroupSelect({
  register,
  textArray,
  label,
  name,
  selectedValue,
  onUpdate,
  isLabelNeeded,
}: FormgroupSelectProps) {
  const handleOnChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    aName: string,
  ) => {
    if (aName !== "type") {
      return;
    }
    const eventTargetValue = (e.currentTarget as HTMLSelectElement).value;
    if (onUpdate) {
      onUpdate(parseInt(eventTargetValue));
    }
  };

  return (
    <Form.Group className="mb-3">
      {isLabelNeeded && <Form.Label>{label}</Form.Label>}
      <Form.Select
        {...(register && register(name))}
        defaultValue={selectedValue}
        onChange={(e) => handleOnChange(e, name)}
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

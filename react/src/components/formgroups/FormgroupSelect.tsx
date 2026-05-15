import Form from "react-bootstrap/Form";
import type { UseFormRegister } from "react-hook-form";
import type { Inputs } from "../../types/inputs.type";

type FormgroupSelectProps = {
  register?: UseFormRegister<Inputs>;
  textArray: string[];
  label: string;
  name: keyof Inputs;
  selectedValue?: number;
  onUpdate?: (value: number, value2?: string) => void;
  isLabelNeeded?: boolean;
  from?: string;
  onUpdateForList?: (isChanged: boolean) => void;
};

export default function FormgroupSelect({
  register,
  textArray,
  label,
  name,
  selectedValue,
  onUpdate,
  isLabelNeeded,
  from,
  onUpdateForList,
}: FormgroupSelectProps) {
  const handleOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (from === "quizList" && onUpdateForList) {
      onUpdateForList(parseInt(e.currentTarget.value) !== selectedValue);
    } else if (name !== "type" && from !== "quizStart") {
      return;
    }
    const eventTargetValue = (e.currentTarget as HTMLSelectElement).value;
    if (from === "quizStart") {
      if (onUpdate) {
        onUpdate(parseInt(eventTargetValue), name);
      }
    } else {
      if (onUpdate) {
        onUpdate(parseInt(eventTargetValue), undefined);
      }
    }
  };

  return (
    <Form.Group className="mb-3">
      {isLabelNeeded && <Form.Label>{label}</Form.Label>}
      <Form.Select
        {...(register && register(name, { valueAsNumber: true }))}
        defaultValue={selectedValue}
        onChange={(e) => handleOnChange(e)}
      >
        {from === "quizStart" && <option value="100000">指定しない</option>}
        {textArray.map((val: string, index) => (
          <option value={index} key={index}>
            {val}
          </option>
        ))}
        {label === "カテゴリー" && from !== "quizStart" && (
          <option value="">カテゴリーを追加する</option>
        )}
      </Form.Select>
    </Form.Group>
  );
}

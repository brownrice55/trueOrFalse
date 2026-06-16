import { memo } from "react";
import Form from "react-bootstrap/Form";
import { textArrays } from "../../utils/labels";
import type { textArraysType } from "../../utils/labels";

type FormgroupSelectForListProps = {
  property: string;
  value: number;
  onUpdate: (targetValue: string) => void;
};
function FormgroupSelectForList({
  property,
  value,
  onUpdate,
}: FormgroupSelectForListProps) {
  const handleOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const targetValue = e.currentTarget.value;
    if (onUpdate) {
      onUpdate(targetValue);
    }
  };

  return (
    <Form.Group className="mb-3">
      <Form.Select id={property} value={value} onChange={handleOnChange}>
        <option value="100000">指定しない</option>
        {(textArrays[property as keyof textArraysType] as string[]).map(
          (val: string, index: number) => (
            <option value={index} key={index}>
              {val}
            </option>
          ),
        )}
        <option value="">カテゴリーを追加する</option>
      </Form.Select>
    </Form.Group>
  );
}

export default memo(FormgroupSelectForList);

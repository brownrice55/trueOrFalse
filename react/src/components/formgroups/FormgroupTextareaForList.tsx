import { memo } from "react";
import Form from "react-bootstrap/Form";

type FormgroupTextareaForListProps = {
  property: string;
  value: string;
  onUpdate: (targetValue: string) => void;
};

function FormgroupTextareaForList({
  property,
  value,
  onUpdate,
}: FormgroupTextareaForListProps) {
  const handleUpdate = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const targetValue = e.currentTarget.value;
    if (onUpdate) {
      onUpdate(targetValue);
    }
  };

  return (
    <Form.Group className="mb-3">
      <Form.Control
        id={property}
        as="textarea"
        rows={5}
        value={value}
        onChange={handleUpdate}
      />
    </Form.Group>
  );
}

export default memo(FormgroupTextareaForList);

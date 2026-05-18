import { useContext } from "react";

import { DataContext } from "../contexts/context";
import type { DataContextType } from "../types/dataContextType.type";
import type { Inputs } from "../types/inputs.type";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

type QuestionDetailPartsForCorrectAnswersProps = {
  selectedKey: number;
};
export default function QuestionDetailPartsForCorrectAnswers({
  selectedKey,
}: QuestionDetailPartsForCorrectAnswersProps) {
  const { data } = useContext(DataContext) as DataContextType;
  const selectedVal: Inputs | undefined = data.get(selectedKey as number);

  return (
    <>
      <Row className="pt-2 border-top">
        <Col className="align-top">正解率</Col>
      </Row>
      <Row style={{ display: "flex", flexWrap: "wrap" }}>
        {selectedVal?.areCorrectAnswers.map((val, idx) => {
          return (
            <Col
              key={idx}
              className="p-1 border text-center mb-2"
              style={{ flex: "0 0 10%", maxWidth: "10%" }}
            >
              {val ? "正解" : "不正解"}
            </Col>
          );
        })}
      </Row>
    </>
  );
}

import { useState } from "react";
import { getData } from "../utils/common";
import QuestionDetail from "./QuestionDetail";
import ListGroup from "react-bootstrap/ListGroup";

export default function QuestionList() {
  const [data, setData] = useState(getData());
  const [isListPage, setIsListPage] = useState<boolean>(true);

  const [selectedVal, setSelectedVal] = useState({});

  const handleGoToDetail = (key: number) => {
    setIsListPage(false);
    const newVal = data.get(key);
    setSelectedVal(newVal);
  };
  return (
    <>
      {isListPage ? (
        <ListGroup>
          {[...data].map(([key, val]) => (
            <ListGroup.Item
              key={key}
              className="py-3"
              onClick={() => handleGoToDetail(key)}
            >
              {val.question}
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <QuestionDetail selectedVal={selectedVal} />
      )}
    </>
  );
}

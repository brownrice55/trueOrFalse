import { useState } from "react";
import { getData } from "../utils/common";
import QuestionDetail from "./QuestionDetail";
import ListGroup from "react-bootstrap/ListGroup";

export default function QuestionList() {
  const [data, setData] = useState(getData());
  const [isListPage, setIsListPage] = useState<boolean>(true);
  const [selectedKey, setSelectedKey] = useState<number>(0);

  const handleGoToDetail = (key: number) => {
    setIsListPage(false);
    setSelectedKey(key);
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
        <QuestionDetail selectedKey={selectedKey} />
      )}
    </>
  );
}

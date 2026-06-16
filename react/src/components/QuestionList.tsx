import { useState, useContext, memo, useCallback } from "react";
import type { Inputs } from "../types/inputs.type";
import QuestionDetail from "./QuestionDetail";
import ListGroup from "react-bootstrap/ListGroup";
import { DataContext } from "../contexts/context";
import type { DataContextType } from "../types/dataContextType.type";

type QuestionListProps = {
  onUpdate: (value: boolean) => void;
};

function QuestionList({ onUpdate }: QuestionListProps) {
  const { data, setData } = useContext(DataContext) as DataContextType;
  const [isListPage, setIsListPage] = useState<boolean>(true);
  const [selectedKey, setSelectedKey] = useState<number>(0);
  const handleGoToDetail = useCallback((key: number) => {
    setIsListPage(false);
    setSelectedKey(key);
    onUpdate(true);
  }, []);

  const handleUpdateIsListPage = useCallback(
    (aUpdatedData: Map<number, Inputs> | null) => {
      setIsListPage(true);
      onUpdate(false);
      if (aUpdatedData) {
        setData(aUpdatedData);
      }
    },
    [],
  );

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
        <QuestionDetail
          selectedKey={selectedKey}
          onUpdate={handleUpdateIsListPage}
        />
      )}
    </>
  );
}

export default memo(QuestionList);

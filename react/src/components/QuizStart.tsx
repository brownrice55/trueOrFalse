import { useState, useContext } from "react";
import QuizStartIndex0 from "./QuizStartIndex0";
import QuizStartIndex1 from "./QuizStartIndex1";
import QuizStartIndex2 from "./QuizStartIndex2";
import QuizStartIndex3 from "./QuizStartIndex3";
import { DataContext } from "../contexts/context";

export default function QuizStart() {
  const originalData = useContext(DataContext);
  const { data, setData } = originalData;
  const [pageNo, setPageNo] = useState<number>(0);

  const handleUpdatePageNo = (aNextPageNumber: number) => {
    setPageNo(aNextPageNumber);
  };

  return (
    <>
      {!pageNo ? (
        <QuizStartIndex0 onUpdate={handleUpdatePageNo} />
      ) : pageNo === 1 ? (
        <QuizStartIndex1 onUpdate={handleUpdatePageNo} />
      ) : pageNo === 2 ? (
        <QuizStartIndex2 onUpdate={handleUpdatePageNo} />
      ) : (
        <QuizStartIndex3 onUpdate={handleUpdatePageNo} />
      )}
    </>
  );
}

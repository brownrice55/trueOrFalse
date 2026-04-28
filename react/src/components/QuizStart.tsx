import { useState, useContext } from "react";
import QuizStartIndex0 from "./QuizStartIndex0";
import QuizStartIndex1 from "./QuizStartIndex1";
import QuizStartIndex2 from "./QuizStartIndex2";
import QuizStartIndex3 from "./QuizStartIndex3";
import { DataContext } from "../contexts/context";
import type { DataContextType } from "../types/dataContextType.type";

export default function QuizStart() {
  const { data, setData } = useContext(DataContext) as DataContextType;
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

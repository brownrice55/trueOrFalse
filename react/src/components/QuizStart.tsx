import { useState, useContext, useEffect } from "react";
import QuizStartIndex0 from "./QuizStartIndex0";
import QuizStartIndex1 from "./QuizStartIndex1";
import QuizStartIndex2 from "./QuizStartIndex2";
import QuizStartIndex3 from "./QuizStartIndex3";
import { DataContext } from "../contexts/context";
import type { DataContextType } from "../types/dataContextType.type";
import { getQuizDataForPractice } from "../utils/getQuizDataForPractice";
import type { Inputs, InputsForResult } from "../types/inputs.type";

export default function QuizStart() {
  const { data } = useContext(DataContext) as DataContextType;
  const [pageNo, setPageNo] = useState<number>(0);

  const [categoryValue, setCategoryValue] = useState<number>(100000);
  const [typeValue, setTypeValue] = useState<number>(100000);
  const [priorityValue, setPriorityValue] = useState<number>(0);
  const [numberOfQuestions, setNumberOfQuestions] = useState<number>(data.size);
  const [quizDataForPractice, setQuizDataForPractice] = useState<
    Map<number, Inputs> | Map<number, InputsForResult> | undefined
  >(data);
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState<number>(0);

  const [currentQuizDataForPractice, setCurrentQuizDataForPractice] = useState<
    Inputs | InputsForResult | undefined
  >(undefined);

  const handleUpdatePageNo = (
    aNextPageNumber?: number,
    aCategoryValue?: number,
    aTypeValue?: number,
    aNumberOfQuestions?: number,
    aPriorityValue?: number,
  ) => {
    if (aNextPageNumber !== undefined) {
      setPageNo(aNextPageNumber);
      if (aNextPageNumber === 1) {
        setCurrentQuizDataForPractice(
          quizDataForPractice?.get(currentQuestionNumber),
        );
      }
    } else if (aCategoryValue !== undefined) {
      setCategoryValue(aCategoryValue);
    } else if (aTypeValue !== undefined) {
      setTypeValue(aTypeValue);
    } else if (aNumberOfQuestions !== undefined) {
      setNumberOfQuestions(aNumberOfQuestions);
    } else if (aPriorityValue !== undefined) {
      setPriorityValue(aPriorityValue);
    }
  };

  useEffect(() => {
    setQuizDataForPractice(
      getQuizDataForPractice(
        data,
        categoryValue,
        typeValue,
        numberOfQuestions,
        priorityValue,
      ),
    );
  }, [categoryValue, typeValue, numberOfQuestions, priorityValue]);

  return (
    <>
      {!pageNo ? (
        <QuizStartIndex0
          onUpdate={handleUpdatePageNo}
          quizDataForPractice={quizDataForPractice}
        />
      ) : pageNo === 1 ? (
        <QuizStartIndex1
          onUpdate={handleUpdatePageNo}
          currentQuizDataForPractice={
            currentQuizDataForPractice as InputsForResult
          }
        />
      ) : pageNo === 2 ? (
        <QuizStartIndex2
          onUpdate={handleUpdatePageNo}
          currentQuizDataForPractice={
            currentQuizDataForPractice as InputsForResult
          }
        />
      ) : (
        <QuizStartIndex3 onUpdate={handleUpdatePageNo} />
      )}
    </>
  );
}

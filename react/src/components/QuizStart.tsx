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
  const { data, setData } = useContext(DataContext) as DataContextType;
  const [pageNo, setPageNo] = useState<number>(0);

  const [categoryValue, setCategoryValue] = useState<number>(100000);
  const [typeValue, setTypeValue] = useState<number>(100000);
  const [priorityValue, setPriorityValue] = useState<number>(0);
  const [numberOfQuestions, setNumberOfQuestions] = useState<number>(data.size);
  const [quizDataForPractice, setQuizDataForPractice] = useState<
    Map<number, Inputs> | Map<number, InputsForResult> | undefined
  >(data);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);

  const [currentQuizDataForPractice, setCurrentQuizDataForPractice] = useState<
    Inputs | InputsForResult | undefined
  >(undefined);

  const [isLastQuestion, setIsLastQuestion] = useState<boolean>(false);

  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const handleUpdatePageNo = (
    aNextPageNumber?: number,
    aCategoryValue?: number,
    aTypeValue?: number,
    aNumberOfQuestions?: number,
    aPriorityValue?: number,
    aCurrentQuizDataForPractice?: InputsForResult,
    aIsStopped?: boolean,
  ) => {
    if (aNextPageNumber !== undefined) {
      if (aNextPageNumber !== 3) {
        setPageNo(aNextPageNumber);
      }
      if (aNextPageNumber === 0) {
        // reset
        setCurrentQuestionIndex(0);
        setCategoryValue(100000);
        setTypeValue(100000);
        setNumberOfQuestions(100000);
        setPriorityValue(0);
      } else if (aNextPageNumber === 1) {
        const newQuizDataForPractice = getQuizDataForPractice(
          data,
          categoryValue,
          typeValue,
          aNumberOfQuestions as number,
          aPriorityValue as number,
        );
        setQuizDataForPractice(newQuizDataForPractice);

        // after clicking start button
        // set quizDataForPractice into localStorage
        localStorage.setItem(
          "TrueOrFalseDataForPractice",
          JSON.stringify([...(newQuizDataForPractice ?? [])]),
        );

        // set first question
        setCurrentQuizDataForPractice(
          newQuizDataForPractice?.get(currentQuestionIndex),
        );

        if (
          currentQuestionIndex + 1 === newQuizDataForPractice?.size ||
          aIsStopped
        ) {
          // display go to result on a button
          setIsLastQuestion(true);
        }
      } else if (
        aNextPageNumber === 2 &&
        aCurrentQuizDataForPractice !== undefined
      ) {
        // after clicking display answer button
        // save isCorrectAnswer and areCorrectAnswers
        const newDataForPractice = new Map(
          quizDataForPractice as Map<number, InputsForResult>,
        );
        newDataForPractice.set(
          currentQuestionIndex,
          aCurrentQuizDataForPractice,
        );
        setQuizDataForPractice(newDataForPractice);
        localStorage.setItem(
          "TrueOrFalseDataForPractice",
          JSON.stringify([...newDataForPractice]),
        );

        // save areCorrectAnswers
        const newData = new Map<number, Inputs>(data);
        const currentVal = newData.get(
          aCurrentQuizDataForPractice?.id as number,
        );
        if (currentVal) {
          currentVal.areCorrectAnswers =
            aCurrentQuizDataForPractice.areCorrectAnswers as boolean[];
          newData.set(aCurrentQuizDataForPractice?.id, currentVal as Inputs);
          setData(newData);
          localStorage.setItem("TrueOrFalseData", JSON.stringify([...newData]));
        }
      } else if (aNextPageNumber === 3) {
        setIsCompleted(!aIsStopped);
        // after clicking display nextQuestion button
        // save notes
        const newDataForPractice = new Map(
          quizDataForPractice as Map<number, InputsForResult>,
        );
        newDataForPractice.set(
          currentQuestionIndex as number,
          aCurrentQuizDataForPractice as InputsForResult,
        );
        setQuizDataForPractice(newDataForPractice);
        localStorage.setItem(
          "TrueOrFalseDataForPractice",
          JSON.stringify([...newDataForPractice]),
        );

        // prepare for next question
        setCurrentQuestionIndex((prev) => prev + 1);

        const newData = new Map<number, Inputs>(data);
        const currentVal = newData.get(
          aCurrentQuizDataForPractice?.id as number,
        );
        if (currentVal) {
          currentVal.notes = aCurrentQuizDataForPractice?.notes as string;
          newData.set(
            aCurrentQuizDataForPractice?.id as number,
            currentVal as Inputs,
          );
          setData(newData);
          localStorage.setItem("TrueOrFalseData", JSON.stringify([...newData]));
        }
        if (
          currentQuestionIndex + 1 === quizDataForPractice?.size ||
          aIsStopped
        ) {
          // go to the result
          setPageNo(3);
          setIsLastQuestion(false);
        } else {
          // go to the next question
          setPageNo(1);
          setCurrentQuizDataForPractice(
            quizDataForPractice?.get(currentQuestionIndex + 1),
          );
          if (currentQuestionIndex + 2 === quizDataForPractice?.size) {
            setIsLastQuestion(true);
          }
        }
      }
    } else if (aCategoryValue !== undefined) {
      setCategoryValue(aCategoryValue);
    } else if (aTypeValue !== undefined) {
      setTypeValue(aTypeValue);
    }
  };

  useEffect(() => {
    const newQuizDataForPractice = getQuizDataForPractice(
      data,
      categoryValue,
      typeValue,
      numberOfQuestions,
      priorityValue,
    );
    setQuizDataForPractice(newQuizDataForPractice);
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
          isLastQuestion={isLastQuestion}
        />
      ) : (
        <QuizStartIndex3
          onUpdate={handleUpdatePageNo}
          quizDataForPractice={
            quizDataForPractice as Map<number, InputsForResult>
          }
          currentQuestionIndex={currentQuestionIndex}
          isCompleted={isCompleted}
        />
      )}
    </>
  );
}

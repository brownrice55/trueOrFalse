import { useState, memo, useCallback } from "react";
import Header from "../components/Header";
import QuestionList from "../components/QuestionList";

function List() {
  const [isDetailPage, setIsDetailPage] = useState<boolean>(false);

  const handleIsDetailPage = useCallback((aIsDetail: boolean) => {
    setIsDetailPage(aIsDetail);
  }, []);

  return (
    <>
      <Header
        title="クイズ一覧"
        isDetailPage={isDetailPage}
        description=""
        keywords=""
      />
      <QuestionList onUpdate={handleIsDetailPage} />
    </>
  );
}

export default memo(List);

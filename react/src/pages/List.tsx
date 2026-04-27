import { useState } from "react";
import Header from "../components/Header";
import QuestionList from "../components/QuestionList";

export default function List() {
  const [isDetailPage, setIsDetailPage] = useState<boolean>(false);

  const handleIsDetailPage = (aIsDetail: boolean) => {
    setIsDetailPage(aIsDetail);
  };

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

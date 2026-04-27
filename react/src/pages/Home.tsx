import Header from "../components/Header";
import QuizStart from "../components/QuizStart";

export default function Home() {
  return (
    <>
      <Header
        title="クイズスタート"
        isDetailPage={undefined}
        description=""
        keywords=""
      />
      <QuizStart />
    </>
  );
}

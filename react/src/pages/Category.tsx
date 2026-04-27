import Header from "../components/Header";
import FormCategory from "../components/FormCategory";

export default function Category() {
  return (
    <>
      <Header
        title="カテゴリー設定"
        isDetailPage={undefined}
        description=""
        keywords=""
      />
      <FormCategory />
    </>
  );
}

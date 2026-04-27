import Header from "../components/Header";
import FormSettings from "../components/FormSettings";

export default function AddNew() {
  return (
    <>
      <Header
        title="新規登録"
        isDetailPage={undefined}
        description=""
        keywords=""
      />
      <FormSettings />
    </>
  );
}

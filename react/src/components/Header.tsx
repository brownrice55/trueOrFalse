import { Helmet } from "react-helmet-async";
import Breadcrumb from "react-bootstrap/Breadcrumb";

type HeaderProps = {
  title: string;
  isDetailPage: boolean | undefined;
  description: string;
  keywords: string;
};

export default function Header({
  title,
  isDetailPage,
  description,
  keywords,
}: HeaderProps) {
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
      </Helmet>
      <Breadcrumb>
        {title !== "クイズスタート" ? (
          title === "クイズ一覧" && isDetailPage ? (
            <>
              <Breadcrumb.Item href="/">クイズスタート</Breadcrumb.Item>
              <Breadcrumb.Item href="/list/">クイズ一覧</Breadcrumb.Item>
              <Breadcrumb.Item active>クイズ詳細</Breadcrumb.Item>
            </>
          ) : (
            <>
              <Breadcrumb.Item href="/">クイズスタート</Breadcrumb.Item>
              <Breadcrumb.Item active>{title}</Breadcrumb.Item>
            </>
          )
        ) : (
          ""
        )}
      </Breadcrumb>
      <h1 className="lead py-2">{title}</h1>
    </>
  );
}

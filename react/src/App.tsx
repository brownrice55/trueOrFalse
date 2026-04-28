import { useContext } from "react";
import { Outlet } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { DataContext } from "./contexts/context";
import type { DataContextType } from "./types/dataContextType.type";

function App() {
  const { data } = useContext(DataContext) as DataContextType;
  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="/">タイトル</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {!data.size ? (
                ""
              ) : (
                <>
                  <Nav.Link href="/">クイズスタート</Nav.Link>
                  <Nav.Link href="/list">クイズ一覧</Nav.Link>
                </>
              )}
              <Nav.Link href="/addnew">新規登録</Nav.Link>
              <Nav.Link href="/category">カテゴリー設定</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container className="pt-3">
        <Outlet />
      </Container>
    </>
  );
}

export default App;

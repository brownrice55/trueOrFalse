import { useContext } from "react";
import type { ReactNode } from "react";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
} from "react-router-dom";

import App from "../App";
import Home from "../pages/Home";
import List from "../pages/List";
import AddNew from "../pages/AddNew";
import Category from "../pages/Category";
import { DataContext } from "../contexts/context";
import type { DataContextType } from "../types/dataContextType.type";

const Redirect = ({ children }: { children: ReactNode }) => {
  const { data } = useContext(DataContext) as DataContextType;
  if (!data || !data.size) {
    return <Navigate to="/addnew" replace />;
  }
  return children;
};

const routesLink = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<App />}>
      <Route
        path="/"
        element={
          <Redirect>
            <Home />
          </Redirect>
        }
      />
      <Route
        path="/list"
        element={
          <Redirect>
            <List />
          </Redirect>
        }
      />
      <Route path="/addnew" element={<AddNew />} />
      <Route path="/category" element={<Category />} />
    </Route>,
  ),
);

export default routesLink;

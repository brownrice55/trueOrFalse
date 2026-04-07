import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

import App from "../App";
import Home from "../pages/Home";
import List from "../pages/List";
import AddNew from "../pages/AddNew";
import Category from "../pages/Category";

const routesLink = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<App />}>
      <Route path="/" element={<Home />} />
      <Route path="/list" element={<List />} />
      <Route path="/addnew" element={<AddNew />} />
      <Route path="/category" element={<Category />} />
    </Route>,
  ),
);

export default routesLink;

import { Outlet } from "react-router-dom";
import ProjectPage from "../../src/pages/project";
import Layout from "../../layout";

const RouterCoding = {
  path: "/project",
  element: Outlet,
  children: [
    {
      path: "",
      element: ProjectPage,
      layout: Layout
    },
  ],
};

export default RouterCoding
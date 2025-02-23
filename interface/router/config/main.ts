import { Outlet } from "react-router-dom";
import ProjectPage from "../../src/pages/project";
import Layout from "../../layout";

const RouterCoding = {
  path: "/project",
  element: Outlet,
  handle: {title: '项目'},
  children: [
    {
      path: "",
      handle: {title: '项目'},
      element: ProjectPage,
      layout: Layout
    },
  ],
};

export default RouterCoding
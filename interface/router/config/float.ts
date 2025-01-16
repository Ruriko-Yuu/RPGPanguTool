import { Outlet } from "react-router-dom";
import KanbanPage from "../../src/pages/float/kanban";

const RouterCoding = {
  path: "/float",
  element: Outlet,
  handle: {title: '看板模式'},
  children: [
    {
      path: "",
      handle: {title: '看板模式'},
      element: KanbanPage,
    },
  ],
};

export default RouterCoding
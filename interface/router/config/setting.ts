import { Outlet } from "react-router-dom";
import SettingPage from "../../src/pages/setting";
import Layout from "../../layout";

const RouterCoding = {
  path: "/setting",
  element: Outlet,
  handle: {title: '设置'},
  children: [
    {
      path: "",
      handle: {title: '设置'},
      element: SettingPage,
      layout: Layout
    },
  ],
};

export default RouterCoding
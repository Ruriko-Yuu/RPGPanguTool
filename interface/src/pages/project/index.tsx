import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import React, { useState } from "react";
import { electronMenulayoutConfig } from "../../../config/layout";
import menuConifg from "../../../layout/index.json";
import "./index.scss";

import MapComponent from "./map";

type MenuItem = Required<MenuProps>["items"][number];
/** 获取菜单项 */
function getItem(
	label: React.ReactNode,
	key: React.Key,
	icon?: React.ReactNode,
	children?: MenuItem[],
	type?: "group"
): MenuItem {
	return {
		key,
		icon,
		children,
		label,
		type,
	} as MenuItem;
}
/** 生成菜单 */
const creatrMenuItems = (list: Array<any>): MenuItem[] => {
	return list?.map((ele) =>
		getItem(ele.title, ele.key, ele.icon, creatrMenuItems(ele.children))
	);
};
/** 菜单 */ const items: MenuItem[] = creatrMenuItems(menuConifg);
/** 小菜单宽度 */ const collapsedWidth = 80;
/** 大菜单宽度 */ const unfoldWidth = 256;
const App: React.FC = () => {
	const [selectKey, setSelectKey] = useState("hunmenList");
	const [collapsed, setCollapsed] = useState(false);
	const env = window.Electron === void 0 ? "b" : "w";
	const toggleCollapsed = () => {
		setCollapsed(!collapsed);
	};
	const menuOnSelect = (e: { key: React.SetStateAction<string> }) => {
		console.log("onSelect", e);
		setSelectKey(e.key);
	};
	return (
		<div
			id="project"
			className="flex"
			style={{
				height:
					env === "w"
						? `calc(100vh - ${electronMenulayoutConfig.height}px)`
						: "100vh",
			}}
		>
			<div
				style={{
					width: collapsed ? collapsedWidth : unfoldWidth,
					minWidth: collapsed ? collapsedWidth : unfoldWidth,
					height: "100%",
				}}
			>
				<div className="x-flex" style={{ width: collapsedWidth, height: 40 }}>
					<i className="cp" onClick={toggleCollapsed}>
						{collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
					</i>
				</div>
				<Menu
					key={`${collapsed}`}
					defaultSelectedKeys={["hunmenList"]}
					defaultOpenKeys={collapsed ? [] : ["hunmen"]}
					mode="inline"
					inlineCollapsed={collapsed}
					items={items}
					onSelect={menuOnSelect}
				/>
			</div>
			<div
				style={{
					width: `calc(100% - ${collapsed ? collapsedWidth : unfoldWidth}px)`,
				}}
			>
				{/* <I18Example /> */}
				{selectKey === "map" && <MapComponent />}
			</div>
		</div>
	);
};

export default App;

import React, { useState } from "react";
import menuConifg from "./index.json";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import ElectronMenu from "./electronMenu";
import { I18Example } from "../../../src/components/i18test";
type MenuItem = Required<MenuProps>["items"][number];
import { electronMenulayoutConfig } from "../../../config/layout";

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
	const [collapsed, setCollapsed] = useState(false);
	/** 主题 */ const [theme, setTheme] = useState("custom");
	const env = window.Electron === void 0 ? "b" : "w";
	const toggleCollapsed = () => {
		setCollapsed(!collapsed);
	};
	return (
		<div className={theme === "custom" ? "custom-theme" : theme}>
			{env === "w" && <ElectronMenu />}
			<div
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
						defaultSelectedKeys={["map2"]}
						defaultOpenKeys={collapsed ? [] : ["map", "map2"]}
						mode="inline"
						inlineCollapsed={collapsed}
						items={items}
					/>
				</div>
				<div
					style={{
						width: `calc(100% - ${collapsed ? collapsedWidth : unfoldWidth}px)`,
					}}
				>
					<I18Example />
				</div>
			</div>
		</div>
	);
};

export default App;

import React, { PropsWithChildren, useState } from "react";
import ElectronMenu from "../src/components/menu/electronMenu";
import "./index.scss";

const App: React.FC<PropsWithChildren<any>> = (
	props: PropsWithChildren<{
		children: any;
	}>
) => {
	/** 主题 */ const [theme, setTheme] = useState("custom");
	const env = window.Electron === void 0 ? "b" : "w";
	return (
		<div
			id="default-layout"
			className={`${theme === "custom" ? "custom-theme" : theme}`}
		>
			{env === "w" && <ElectronMenu />}
			<div className={`${env === "w" ? "menu-children" : "all-children"}`}>{props.children}</div>
		</div>
	);
};

export default App;

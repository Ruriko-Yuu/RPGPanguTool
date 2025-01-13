import React, { PropsWithChildren, useState } from "react";
import ElectronMenu from "../src/components/menu/electronMenu";
const App: React.FC<PropsWithChildren<any>> = (props: PropsWithChildren<{
  children: any;
}>) => {
	/** 主题 */ const [theme, setTheme] = useState("custom");
	const env = window.Electron === void 0 ? "b" : "w";
	return (
		<div className={theme === "custom" ? "custom-theme" : theme}>
			{env === "w" && <ElectronMenu />}
			{props.children}
		</div>
	);
};

export default App;

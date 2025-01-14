import * as React from "react";
import { useLocation, Link } from "react-router-dom";
import { useElectronMenuStore } from "../../../store/useElectronMenu";
import { useState } from "react";

const Setting: React.FC = () => {
	const [path, setPath] = useState("");
	React.useEffect(() => {
		useElectronMenuStore.getState().editTab({
			title: "设置",
			router: "/setting",
		});
		const getDefaultFilePathReply = (event: any, arg: any) => {
			console.log("getDefaultFilePath-reply", arg);
			setPath(arg);
		};
		window.Electron.ipcRenderer.on(
			"getDefaultFilePath-reply",
			getDefaultFilePathReply
		);
		window.Electron.ipcRenderer.send("getDefaultFilePath");
		return () => {
			window.Electron.ipcRenderer.removeListener(
				"getDefaultFilePath-reply",
				getDefaultFilePathReply
			);
		};
	}, []);
	return (
		<>
			<Link to="/">首页</Link>
			<p>文件保存路径{path}</p>
			<p onClick={() => window.Electron.ipcRenderer.send("open-folder-dialog")}>
				切换文件保存路径
			</p>
		</>
	);
};

export default Setting;

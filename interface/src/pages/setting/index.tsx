import * as React from "react";
import { useLocation, Link } from "react-router-dom";
import { useElectronMenuStore } from "../../../store/useElectronMenu";
import { useRef, useState } from "react";
import { Input, Button, Tabs } from "antd";
import type { TabsProps } from "antd";
import "./index.scss";
import Lottie from "lottie-react";
import homeAnimation from "../../../assets/icon/home.json";

const Setting: React.FC = () => {
	const [path, setPath] = useState("");
	const lottieRef = useRef(null);
	React.useEffect(() => {
		useElectronMenuStore.getState().editTab({
			title: "设置",
			router: "/setting",
		});
		const getDefaultFilePathReply = (event: any, arg: any) => {
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

	const items: TabsProps["items"] = [
		{
			key: "1",
			label: "常规设置",
			children: <>空</>,
		},
		{
			key: "2",
			label: "存储设置",
			children: (
				<div className="setting-row">
					<p className="row-title">保存目录</p>
					<div className="row-content">
						<p className="mb-10">默认将数据/资源文件保存在此文件夹中</p>
						<p>
							<Input value={path} size="small" style={{ width: "460px" }} />
							<Button
								size="small"
								onClick={() =>
									window.Electron.ipcRenderer.send("changeDefaultFilePath")
								}
							>
								更改目录
							</Button>
							<Button size="small" onClick={() => {}}>
								打开文件夹
							</Button>
						</p>
					</div>
				</div>
			),
		},
	];

	return (
		<div id="setting-page">
			<Link
				to="/"
				style={{ display: "inline-flex", alignItems: "center" }}
				onMouseMove={() => {
					lottieRef.current?.play();
        }}
        onMouseLeave={() => {
          lottieRef.current?.stop();
        }}
			>
				<Lottie
					lottieRef={lottieRef}
					style={{ width: "24px", height: "24px", display: "inline-block" }}
					animationData={homeAnimation}
					autoplay={false}
					loop={true}
				/>
				首页
			</Link>
			<p className="page-title">设置</p>
			<Tabs defaultActiveKey="1" items={items} />
		</div>
	);
};

export default Setting;

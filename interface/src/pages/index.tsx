import * as React from "react";
import { useElectronMenuStore } from "../../store/useElectronMenu";
import { Link, useNavigate } from "react-router-dom";
import { getData } from "../../api";
import Lottie from "lottie-react";
import settingAnimation from "../../assets/icon/setting.json";
import { useRef } from "react";
import "./index.scss";
import SpineBlock from "../components/spine/index";
const App: React.FC = () => {
	const lottieRef = useRef(null);
	const navigate = useNavigate();
	const tabList = useElectronMenuStore((state: any) => state.tabList);
	const newWorld = () => {
		useElectronMenuStore.getState().newTab({
			title: "new world",
			router: "/project",
		});
		navigate("/project");
	};
	React.useEffect(() => {
		useElectronMenuStore.getState().editTab({
			title: "首页",
			router: "/",
		});
	}, []);
	return (
		<div id="home-page">
			<SpineBlock />
			<p onClick={newWorld}>创建世界</p>
			<p
				onClick={() =>
					window.Electron.ipcRenderer.send("saveFile", {
						path: "alll/asdas/save.json",
						data: { ahh: Math.random() },
					})
				}
			>
				[test]保存数据
			</p>
			<p
				onClick={async () => {
					try {
						const data = await getData("alll/asdas/save.json");
						console.log("🚀 ~ data:", data);
					} catch (error) {}
				}}
			>
				[test]获取数据
			</p>
			<Link to="/float">悬浮窗</Link>
			<Link
				to="/setting"
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
					animationData={settingAnimation}
					autoplay={false}
					loop={true}
				/>
				设置
			</Link>
		</div>
	);
};

export default App;

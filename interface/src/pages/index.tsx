import * as React from "react";
import { useElectronMenuStore } from "../../store/useElectronMenu";
import { Link, useNavigate } from "react-router-dom";
const App: React.FC = () => {
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
		  title: '首页',
		  router: '/'
		})
	}, []);
	return (
		<>
			<p onClick={newWorld}>newWorld</p>
			<p
				onClick={() =>
					window.Electron.ipcRenderer.send("saveFile", {
						path: "alll/asdas/save.json",
						data: { ahh: 1 },
					})
				}
			>
				保存文件
      </p>
      <Link to="/setting">设置</Link>
		</>
	);
};

export default App;

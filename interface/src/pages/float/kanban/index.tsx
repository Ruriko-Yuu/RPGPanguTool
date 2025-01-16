import * as React from "react";
import "./index.scss";
const App: React.FC = () => {
	/**
	 * 无系统菜单栏时拖拽内置菜单栏窗口
	 * @param {boolean} canMove
	 */
	const winControl = {
		windowMove: (canMove: boolean) =>
			window.Electron.ipcRenderer.send("window-move-open", canMove),
	};
	/**
	 * 结束内置菜单栏拖拽窗口
	 * @param e
	 * @returns
	 */
	const onMouseDown = (e: React.SyntheticEvent<HTMLDivElement>) => {
		if (
			e.target instanceof HTMLInputElement ||
			e.target instanceof HTMLButtonElement ||
			e.target instanceof HTMLTextAreaElement
		) {
			winControl.windowMove(false);
			return;
		}
		winControl.windowMove(true);
		window.onblur = () => {
			winControl.windowMove(false);
			window.onblur = null;
		};
	};
	React.useEffect(() => {
		window.Electron.ipcRenderer.send("kanban-on");
		return () => {
			window.Electron.ipcRenderer.send("kanban-off");
		};
	}, []);

	return (
		<div
			id="kanban-space"
			onMouseDown={onMouseDown}
			onMouseUp={() => winControl.windowMove(false)}
		>
			<div
				style={{
					width: "100px",
					height: "100px",
					margin: "30px auto 0",
					display: "flex",
					alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
				}}
        >
				头
			</div>
			<div
				style={{
					width: "160px",
					height: "200px",
					margin: "0 auto",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
          backgroundColor: "rgba(0, 255, 255, 0.8)",
				}}
			>
				身
			</div>
		</div>
	);
};
export default App;

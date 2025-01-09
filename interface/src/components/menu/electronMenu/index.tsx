import React, { memo, useEffect, useState } from "react";
import { electronMenulayoutConfig } from "../../../../config/layout";
import "./index.scss";
const ElectronMenu = memo(() => {
	const [fullScreen, setFullScreen] = useState(false);
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
	// 监听异步回复
	window.Electron.ipcRenderer.on("fullscreen-reply", (event, arg) => {
		console.log("fullscreen-reply"); // 打印主进程回复的消息
		setFullScreen(true);
	});
	window.Electron.ipcRenderer.on("unFullscreen-reply", (event, arg) => {
		console.log("unFullscreen-reply"); // 打印主进程回复的消息
		setFullScreen(false);
	});
	return (
		<div id="electron-menu" style={{ height: electronMenulayoutConfig.height }}>
			<div
				className="drag-area"
				onMouseDown={onMouseDown}
				onMouseUp={() => winControl.windowMove(false)}
			></div>
			<div className="right-btn">
				<div
					className="minimize x-flex"
					onClick={() => {
						window.Electron.ipcRenderer.send("minimize");
					}}
				>
					-
				</div>
				<div
					className="maximize x-flex"
					onClick={() => {
						window.Electron.ipcRenderer.send(
							fullScreen ? "unFullscreen" : "fullscreen"
						);
					}}
				>
					{fullScreen? '回':'口'}
				</div>
				<div className="close x-flex" onClick={() => {
          window.Electron.ipcRenderer.send('close');
					}}>X</div>
			</div>
		</div>
	);
});
export default ElectronMenu;

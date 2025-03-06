import React, { memo, useEffect, useState } from "react";
import { electronMenulayoutConfig } from "../../../../config/layout";
import "./index.scss";
import { useElectronMenuStore } from "../../../../store/useElectronMenu";
import { Link, useNavigate } from "react-router-dom";
const ElectronMenu = memo(() => {
	const tabList = useElectronMenuStore((state: any) => state.tabList);
	const tabActive = useElectronMenuStore((state: any) => state.tabActive);
	const fullScreen = useElectronMenuStore((state: any) => state.fullScreen);
	const navigate = useNavigate();
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

	useEffect(() => {
		const fullscreenReply = (event: any, arg: any) => {
			console.log("fullscreen-reply");
			useElectronMenuStore.getState().setFullScreen(true);
		};
		const unFullscreenReply = (event: any, arg: any) => {
			console.log("unFullscreen-reply");
			useElectronMenuStore.getState().setFullScreen(false);
		};
		window.Electron.ipcRenderer.on("fullscreen-reply", fullscreenReply);
		window.Electron.ipcRenderer.on("unFullscreen-reply", unFullscreenReply);
		return () => {
			window.Electron.ipcRenderer.removeListener(
				"fullscreen-reply",
				fullscreenReply
			);
			window.Electron.ipcRenderer.removeListener(
				"unFullscreen-reply",
				unFullscreenReply
			);
		};
	}, []);
	return (
		<div id="electron-menu" style={{ height: electronMenulayoutConfig.height }}>
			<div
				className="drag-area"
				onMouseDown={onMouseDown}
				onMouseUp={() => winControl.windowMove(false)}
			></div>
			<div className="tab-space">
				{tabList.map((ele: any, idx: number) => (
					<div
						title={ele.title}
						onClick={() => {
							useElectronMenuStore.getState().setTabActive(idx);
							navigate(ele.router);
						}}
						className={`tab-item ${tabActive === idx ? "active" : ""}`}
						key={idx}
					>
						<p>{ele.title}</p>
						{idx ? (
							<i
								onClick={(e) => {
									e.stopPropagation();
									if (useElectronMenuStore.getState().tabActive === idx) {
										useElectronMenuStore.getState().setTabActive(idx - 1);
										navigate(tabList[idx - 1].router);
									}
									if (idx < useElectronMenuStore.getState().tabActive) {
										useElectronMenuStore
											.getState()
											.setTabActive(
												useElectronMenuStore.getState().tabActive - 1
											);
									}
									useElectronMenuStore.getState().delTab(idx);
									console.log(useElectronMenuStore.getState().tabList);
								}}
							>
								x
							</i>
						) : (
							<></>
						)}
					</div>
				))}
			</div>
			<div className="right-btn">
				<Link to="/float">
					<div className="x-flex">📌</div>
				</Link>
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
					{fullScreen ? "回" : "口"}
				</div>
				<div
					className="close x-flex"
					onClick={() => {
						window.Electron.ipcRenderer.send("close");
					}}
				>
					X
				</div>
			</div>
			{/* </div> */}
		</div>
	);
});
export default ElectronMenu;

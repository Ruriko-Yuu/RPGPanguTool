import * as React from "react";
import * as PIXI from "pixi.js";
import {
	Live2DModel,
	MotionPreloadStrategy,
	InternalModel,
} from "pixi-live2d-display";
import "./index.scss";

const App: React.FC = () => {
	(window as any).PIXI = PIXI;
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
	const init = async () => {
		// 引入模型
		const model = await Live2DModel.from(
			// "../../../../resources/model/live2d/Hiyori/Hiyori.model3.json",
			"../../../../resources/model/live2d/lafei/lafei.model3.json",
			{ motionPreload: MotionPreloadStrategy.NONE }
		);
		// 绑定模型点击事件动作
		model.on("pointerdown", (hitAreas) => {
			// model.motion('Idle')
			model.motion('')
		});
		// model.anchor.set(0.5); // 设置锚点为中心点
		// model.position.set(model.screen.width / 2, model.screen.height / 2); // 设置位置为屏幕中心

		// 设置缩放比例
		// model.scale.set(0.118);
		model.scale.set(0.218);
		// 创建模型对象
		const app = new PIXI.Application({
			// 配置模型舞台
			view: document.getElementById("kanban") as HTMLCanvasElement,
			// 背景是否透明
			transparent: true,
			autoDensity: true,
			// autoResize: true,
			antialias: true,
			// 高度
			height: 1024,
			// 宽度
			width: 1024,
		});
		app.stage.addChild(model);
	};
	React.useEffect(() => {
		window.Electron.ipcRenderer.send("kanban-on");
		init();
		return () => {
			window.Electron.ipcRenderer.send("kanban-off");
		};
	}, []);

	// 挂载pixi

	return (
		<div
			id="kanban-space"
			onMouseDown={onMouseDown}
			onMouseUp={() => winControl.windowMove(false)}
		>
			<canvas id="kanban"></canvas>
		</div>
	);
};
export default App;

import * as React from "react";
import * as PIXI from "pixi.js";
import { Link, useNavigate } from "react-router-dom";
import {
	Live2DModel,
	MotionPreloadStrategy,
	InternalModel,
} from "pixi-live2d-display";
import "./index.scss";

const App: React.FC = () => {
	const navigate = useNavigate();
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
	const createdMenu = (app: PIXI.Application) => {
		// 菜单项的数据
		const menuItems = [
			{
				text: "close",
				color: 0xff0000,
				action: () => {
					console.log("Home clicked!");
					app.stage.removeChild(menuContainer);
					setTimeout(() => {
						window.Electron.ipcRenderer.send("kanban-off");
						navigate("/project");
					}, 500);
				},
			},
		];

		// 创建菜单容器
		const menuContainer = new PIXI.Container();
		menuContainer.x = 50; // 菜单的起始位置
		menuContainer.y = 50;
		app.stage.addChild(menuContainer);

		// 创建菜单项
		menuItems.forEach((item, index) => {
			// 创建背景矩形
			const menuItem = new PIXI.Graphics();
			menuItem.beginFill(item.color);
			menuItem.drawRect(0, 0, 150, 50); // 每个菜单项的宽度和高度
			menuItem.endFill();
			menuItem.y = index * 60; // 设置菜单项的垂直间距

			// 添加文字
			const text = new PIXI.Text(item.text, { fill: 0xffffff, fontSize: 20 });
			text.x = 10; // 文字相对于菜单项的偏移
			text.y = 15;
			menuItem.addChild(text);

			// 设置交互性
			menuItem.interactive = true;
			menuItem.buttonMode = true; // 让鼠标指针变成手型

			// 添加点击事件
			menuItem.on("pointerdown", item.action);

			// 将菜单项添加到菜单容器
			menuContainer.addChild(menuItem);
		});
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
			model.motion("");
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
		console.log("🚀 ~ init ~ app:", app);
		app.stage.addChild(model);

		// 添加一个可点击的图形
		const graphics = new PIXI.Graphics();
		graphics.beginFill(0xff0000, 0.01);
		graphics.drawRect(0, 0, 256, 256);
		graphics.endFill();
		graphics.interactive = true; // 启用交互
		app.stage.addChild(graphics);

		// 监听右键点击事件
		graphics.on("pointerdown", (event) => {
			if (event.data.button === 2) {
				// 检查是否是右键点击（button 2 是右键）
				console.log("Right click detected!");
				createdMenu(app);
				// 在这里添加你的右键点击逻辑
			}
		});
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

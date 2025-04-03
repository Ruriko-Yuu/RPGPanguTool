import { IpcMainEvent } from "electron";
import { forwardRef } from 'react';

module.exports = (mainWindow: Electron.CrossProcessExports.BrowserWindow) => {
  const electron = require("electron");
  const { app, BrowserWindow, ipcMain } = electron;
  let size = [800, 600]
  /** 全屏 */
  ipcMain.on("fullscreen", (event: { reply: (arg0: string) => void; }, res: any) => {
    mainWindow.setKiosk(true)
    console.log('全屏')
    event.reply('fullscreen-reply');
  })

  /** 取消全屏 */
  ipcMain.on("unFullscreen", (event: { reply: (arg0: string) => void; }, res: any) => {
    mainWindow.setKiosk(false)
    console.log('非全屏')
    event.reply('unFullscreen-reply');
  })

  /** 最小化 */
  ipcMain.on("minimize", (event: any, res: any) => {
    mainWindow.minimize()
  })

  /** 关闭 */
  ipcMain.on("close", (event: any, res: any) => {
    mainWindow.close()
  })

  /** 开启看板模式 */
  ipcMain.on("kanban-on", (event: any, res: any) => {
    size = mainWindow.getSize()
    mainWindow.setSize(256, 256, true)
    // 看板模式下禁用窗口缩放
    mainWindow.setResizable(false)
    // 设置窗口始终在顶部
    mainWindow.setAlwaysOnTop(true);
  })

  /** 关闭看板模式 */
  ipcMain.on("kanban-off", (event: any, res: any) => {
    mainWindow.setAlwaysOnTop(false);
    mainWindow.setResizable(true)
    setTimeout(() => { mainWindow.setSize(size[0], size[1], true) }, 1000)
    console.log("🚀 ~ ipcMain.on ~ size[0], size[1]:", size[0], size[1])
  })

  /** 看板状态下鼠标穿透 */
  ipcMain.on('kanBanMouseEvents', (event: IpcMainEvent, ignore: boolean, options?: { forward: boolean }) => {
    mainWindow.setIgnoreMouseEvents(ignore, options)
  })
}
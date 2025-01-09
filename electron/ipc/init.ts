module.exports = (mainWindow: Electron.CrossProcessExports.BrowserWindow) => {
  const electron = require("electron");
  const { app, BrowserWindow, ipcMain } = electron;
  /** 全屏 */
  ipcMain.on("fullscreen", (event, res) => { 
    mainWindow.setKiosk(true)
    event.reply('fullscreen-reply');
  })

  /** 取消全屏 */
  ipcMain.on("unFullscreen", (event, res) => { 
    mainWindow.setKiosk(false)
    event.reply('unFullscreen-reply');
  })

  /** 最小化 */
  ipcMain.on("minimize", (event, res) => { 
    mainWindow.minimize()
  })

  /** 关闭 */
  ipcMain.on("close", (event, res) => { 
    mainWindow.close()
  })
}
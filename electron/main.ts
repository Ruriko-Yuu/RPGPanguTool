// Modules to control application life and create native browser window
const electron = require("electron");
const { app, BrowserWindow, ipcMain } = electron;
const path = require("path");
const isDev = require("electron-is-dev");
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";
const ipcInit = require("./ipc/init")
const ipcFile = require("./ipc/file")
/**
 * 窗口移动
 * @param win
 */
function windowMove(win: {
  getPosition: () => any;
  setPosition: (arg0: number, arg1: number, arg2: boolean) => void;
}) {
  let winStartPosition = { x: 0, y: 0 };
  let mouseStartPosition = { x: 0, y: 0 };
  let movingInterval: string | number | NodeJS.Timeout = null;

  /**
   * 窗口移动事件
   */
  ipcMain.on("window-move-open", (events, canMoving) => {
    if (canMoving) {
      // 读取原位置
      const winPosition = win.getPosition();
      winStartPosition = { x: winPosition[0], y: winPosition[1] };
      mouseStartPosition = electron.screen.getCursorScreenPoint();
      // 清除
      if (movingInterval) {
        clearInterval(movingInterval);
      }
      // 新开
      movingInterval = setInterval(() => {
        // 实时更新位置
        const cursorPosition = electron.screen.getCursorScreenPoint();
        const x = winStartPosition.x + cursorPosition.x - mouseStartPosition.x;
        const y = winStartPosition.y + cursorPosition.y - mouseStartPosition.y;
        win.setPosition(x, y, true);
      }, 20);
    } else {
      clearInterval(movingInterval);
      movingInterval = null;
    }
  });
}
function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    titleBarStyle: "hidden",
    // titleBarOverlay: true,
    transparent: true,
    backgroundColor: '#00000000',
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, "script/preload.js"),
      nodeIntegration: true,
      contextIsolation: false, // 禁用上下文隔离
    },
  });
  if (isDev) {
    mainWindow.loadURL("http://localhost:8888");
  } else {
    mainWindow.loadFile("./dist-interface/index.html");
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
  windowMove(mainWindow);
  console.log('⚓', 'ipc init')
  ipcInit(mainWindow)
  ipcFile()
}
(app as any).allowRendererProcessReuse = true;

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  console.log("qpp---whenready");
  createWindow();
});

// Quit when all windows are closed.
app.on("window-all-closed", function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  console.log("window-all-closed");
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

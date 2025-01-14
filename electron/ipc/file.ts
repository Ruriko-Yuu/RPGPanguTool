const fs = require('fs');
import { CONFIG_DEFAULT } from "../azure/k"
module.exports = (mainWindow: Electron.CrossProcessExports.BrowserWindow) => {
  const electron = require("electron");
  const { app, BrowserWindow, ipcMain } = electron;
  const getBasePath = () => {
    return new Promise((resolve, reject) => {
      fs.readFile('rpgp.config.json', 'utf8', (err: any, data: string) => {
        if (err) {
          let str = JSON.stringify(CONFIG_DEFAULT, undefined, "\t");
          fs.writeFile('./rpgp.config.json', str, function (err: any) {
            if (err) {
              console.error(err);
            }
            console.log('写入成功!');
          })
          resolve(CONFIG_DEFAULT.defaultFilePath)
        }

        const jsonData = JSON.parse(data);
        resolve(jsonData.defaultFilePath)
      });
    })
  }
  ipcMain.on('getDefaultFilePath', async (event, res) => {
    const path = await getBasePath()
    event.reply('getDefaultFilePath-reply', path)
  })

  /** 保存文件 */
  ipcMain.on("saveFile", async (event, res) => {
    const basePath = await getBasePath();
    let str = JSON.stringify(res.data, undefined, "\t");
    const pathName = basePath + res.path
    const pathNameList = pathName.split('/')
    const filePath = pathNameList.slice(0, pathNameList.length - 1).join('/')
    const fileName = pathNameList[pathNameList.length - 1]
    fs.mkdir(filePath, { recursive: true }, (err: any) => {
      if (err) {
        console.log(err.message);
        return;
      }
    })
    fs.writeFile(pathName, str, function (err: any) {
      if (err) {
        console.error(err);
      }
    })

  })

  /** 监听 ipc 事件，打开选择文件夹的对话框 */
  ipcMain.on('open-folder-dialog', (event) => {
    electron.dialog.showOpenDialog({
      properties: ['openDirectory']
    }).then(result => {
      if (!result.canceled) {
        // 发送选中的文件夹路径到渲染进程
        // event.sender.send('selected-folder', result.filePaths[0]);
        console.log(result.filePaths[0].replace(/\\/g, '/'))
      }
    }).catch(err => {
      console.error(err);
    });
  });
}
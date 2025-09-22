import { CONFIG_DEFAULT } from "../azure/k"
const fs = require('fs');
const path = require('path');
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
            console.log('配置文件初始化!');
          })
          resolve(CONFIG_DEFAULT.defaultFilePath)
        } else {
          const jsonData = JSON.parse(data);
          resolve(jsonData.defaultFilePath)
        }
      });
    })
  }
  ipcMain.on('getDefaultFilePath', async (event: { reply: (arg0: string, arg1: unknown) => void; }, res: any) => {
    const path = await getBasePath()
    event.reply('getDefaultFilePath-reply', path)
  })

  /** 保存文件 */
  ipcMain.on("saveFile", async (event: any, res: { data: any; path: string | number; }) => {
    const basePath = await getBasePath();
    let str = JSON.stringify(res.data, undefined, "\t");
    const pathName = basePath + `${res.path}`
    const pathNameList = pathName.split('/')
    const filePath = pathNameList.slice(0, pathNameList.length - 1).join('/')
    const fileName = pathNameList[pathNameList.length - 1]
    console.log("🚀 ~ ipcMain.on ~ filePath:", filePath, basePath)
    fs.mkdir(filePath, { recursive: true }, (err: any) => {
      if (err) {
        console.log(err.message);
        return;
      }
      fs.writeFile(pathName, str, function (err: any) {
        if (err) {
          console.error(err);
          return
        }
        console.log(`${fileName}文件已保存至${filePath}文件夹`)
      })
    })
  })

  /** 监听 ipc 事件，打开选择文件夹的对话框 */
  ipcMain.on('changeDefaultFilePath', (event: { reply: (arg0: string, arg1: string) => void; }) => {
    electron.dialog.showOpenDialog({
      properties: ['openDirectory']
    }).then(async (result: { canceled: any; filePaths: string[]; }) => {
      if (!result.canceled) {
        // 发送选中的文件夹路径到渲染进程
        const filePathS = result.filePaths[0].replace(/\\/g, '/')
        const filePath = filePathS + (filePathS[filePathS.length - 1] === '/' ? '' : '/')
        console.log(filePath)
        // 要检查的文件夹路径
        // const folderPath = path.join(__dirname, filePath);
        // 检查文件夹是否可写
        try {
          fs.accessSync(filePath, fs.constants.R_OK | fs.constants.W_OK);
          console.log('can read/write', filePath);
        } catch (err) {
          console.error('no access!', filePath);
        }
        // await fs.promises.access(result.filePaths[0],fs.constants.X_OK, (err: any) => {
        //   if (err) {
        //     console.error(`没有权限写入文件夹: ${result.filePaths[0]}`);
        //     return;
        //   }
        //   console.log(`有权限写入文件夹: ${result.filePaths[0]}`, filePath);
        // });
        fs.readFile('rpgp.config.json', 'utf8', (err: any, data: string) => {
          const jsonData = JSON.parse(data);
          jsonData.defaultFilePath = filePath
          let str = JSON.stringify(jsonData, undefined, "\t");
          fs.writeFile('./rpgp.config.json', str, function (err: any) {
            if (err) {
              console.error(err);
            }
          })
          event.reply('getDefaultFilePath-reply', filePath)
        });
      }
    }).catch((err: any) => {
      console.error(err);
    });
  });

  ipcMain.on('openFile', async (event: { reply: (arg0: any, arg1: { code: number; data: any; }) => void; }, res: string | number) => {
    const path = `${res}`.indexOf(`:\\`) ? await getBasePath() : ''
    fs.readFile(path + `${res}`, 'utf8', (err: any, data: string) => {
      try {
        if (data) {
          const jsonData = JSON.parse(data);
          event.reply(res, {
            code: 200,
            data: jsonData
          })
        } else {
          event.reply(res, {
            code: 400,
            data: data
          })
        }
      } catch (error) {
        event.reply(res, {
          code: 400,
          data: data
        })
      }
    });
  })
}
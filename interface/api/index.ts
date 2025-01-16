/**
 * 获取对应路径下的文件数据
 * @param path 
 * @returns 
 */
export const getData = (path: string) => {
  return new Promise((resolve, reject) => {
    window.Electron.ipcRenderer.send("openFile", path)
    const fn = (event: any, res: any) => {
      window.Electron.ipcRenderer.removeListener(
        path,
        fn
      );
      if (res.code == 200) {
        resolve(res.data)
      } else {
        reject(new Error(res.data))
      }
    }
    window.Electron.ipcRenderer.on(
      path,
      fn
    );
  })
}
import { create, StoreApi, UseBoundStore } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware';
type TAB_TYPE = { title: string, router: string, [key: string]: string };
const useElectronMenuStore: UseBoundStore<StoreApi<{
  tabList: Array<TAB_TYPE>,
  [key: string]: any
}>> = create(persist((set) => {
  return {
    tabList: [
      {
        title: '标签1',
        router: '/'
      },
    ],
    fullScreen: false,
    tabActive: 0,
    newTab: (obj: { title: string, router: string }) => set((state: any) => {
      return {
        tabList: [...state.tabList,
          obj
        ],
        tabActive: state.tabList.length
      }
    }),
    /**
     * 修改tab数据
     * @param value 新的tab数据
     * @returns 
     */
    editTab: (value: TAB_TYPE) => set((state: any) => {
      const tabList = state.tabList
      tabList[state.tabActive] = value
      return {
        tabList: [...tabList]
      }
    }),
    setFullScreen: (value: boolean) => set((state: any) => ({ fullScreen: value })),
    setTabActive: (value: number) => set((state: any) => ({
      tabActive: value
    })),
    delTab: (idx: number) => set((state: any) => {
      const tabList = state.tabList
      tabList.splice(idx, 1)
      return ({
        tabList: [...tabList]
      })
    })
  }
}, {
  name: 'electronMenu-storage', // 存储中的项目名称，必须是唯一的
  storage: createJSONStorage(() => sessionStorage), // 使用sessionStorage作为存储
},
))

export {
  useElectronMenuStore
}

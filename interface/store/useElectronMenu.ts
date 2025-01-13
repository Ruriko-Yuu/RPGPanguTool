import { create, StoreApi, UseBoundStore } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware';

const useElectronMenuStore: UseBoundStore<StoreApi<any>> = create(persist((set) => {
  return {
    tabList: [
      {
        title: '标签1',
        router: '/'
      },
    ],
    tabActive: 0,
    newTab: (obj: { title: string, router: string }) => set((state: any) => {
      return {
        tabList: [...state.tabList,
          obj
        ],
        tabActive: state.tabList.length
      }
    }),
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

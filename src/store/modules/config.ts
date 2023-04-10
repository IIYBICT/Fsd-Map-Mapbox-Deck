import { getAdminConfigApi } from '@/api/admin'
import { getConfigApi } from '@/api/config'
import router from '@/router'
import { defineStore } from 'pinia'

export interface ConfigData {
  WebName: string
  WhUpdateTime: 5
  MapboxStyle: string
  MapboxToken: string
  ThemeColor: string
  GetTrackTime: number
  DelTrackTime: number
  Version?: string
}

interface ConfigStoreData {
  configData: ConfigData
  isInit: boolean
}
const changeFavicon = (link: any) => {
  let $favicon: any = document.querySelector('link[rel="icon"]')
  if ($favicon !== null) {
    $favicon.href = link
  } else {
    $favicon = document.createElement('link')
    $favicon.rel = 'icon'
    $favicon.href = link
    document.head.appendChild($favicon)
  }
}
export const useConfigStore = defineStore('config', {
  state: (): ConfigStoreData => {
    return {
      isInit: false,
      configData: {
        WebName: '',
        WhUpdateTime: 5,
        MapboxStyle: '',
        MapboxToken: '',
        ThemeColor: '#169B39',
        GetTrackTime: 10,
        DelTrackTime: 10
      }
    }
  },
  persist: {
    // 修改存储中使用的键名称，默认为当前 Store的 id
    key: 'config',
    // 修改为 sessionStorage，默认为 localStorage
    storage: localStorage,
    // 部分持久化状态的点符号路径数组，[]意味着没有状态被持久化(默认为undefined，持久化整个状态)
    paths: ['configData.ThemeColor']
  },
  getters: {},
  actions: {
    getConfig() {
      this.isInit = true
      getConfigApi().then((resData) => {
        this.configData = resData.data.Data
        document.title = resData.data.Data.WebName
        changeFavicon('/assets/logo.png?t=' + Date.now())
        this.isInit = true
      })
    }
  }
})

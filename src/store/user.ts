import { isObject } from '@/utils'

function clearObj(obj: { [key: string]: any }, skip: Object | string[]) {
  const skipIsArray = Array.isArray(skip)
  const skipIsObject = isObject(skip)
  Object.keys(obj).forEach(key => {
    if (skipIsArray && !skip.includes(key)) {
      delete obj[key]
    }
    if (skipIsObject && !Object.hasOwn(skip, key)) {
      delete obj[key]
    }
  })
}
export interface UserInfo {
  token: string
  userName: string
  userRoleCode: string
}
export interface RememberLoginInfo {
  roleCode: string
  isNeedVerify: string
  isRemember: boolean
  userName: string
}
export interface UserInfoStore {
  userInfo: UserInfo
  rememberLoginInfo: RememberLoginInfo
}
// userRoleCode: 'cooperative'
export default defineStore({
  id: 'userInfo',
  persist: true,
  state: (): UserInfoStore => {
    return {
      userInfo: {
        userRoleCode: 'cooperative'
      } as UserInfo,
      rememberLoginInfo: {} as RememberLoginInfo
    }
  },
  getters: {
    token: state => {
      return state.userInfo.token ?? ''
    }
  },
  actions: {
    setUserInfo(userInfo: any) {
      Object.assign(this.userInfo, userInfo)
    },
    setRememberLoginInfo(rememberLoginInfo: RememberLoginInfo) {
      Object.assign(this.rememberLoginInfo, rememberLoginInfo)
    },
    clearToken() {
      this.userInfo.token = ''
    },
    clearRemeberLoginInfo() {
      clearObj(this.rememberLoginInfo, {})
    },
    clearUserInfo() {
      clearObj(this.userInfo, ['userRoleCode'])
    }
  }
})

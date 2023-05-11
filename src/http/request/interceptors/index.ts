import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { useRoute, useRouter } from 'vue-router'

import useUserStore from '@/store/user'
const router = useRouter()
const route = useRoute()

import { goEncrypt } from '../../encrypt'
import { nativeLists, whiteLists } from '../../white'

const userStore = useUserStore()
// 请求拦截器
export function requestInterceptors(config: AxiosRequestConfig) {
  const { url } = config
  const { token } = userStore

  // 白名单
  if (url && whiteLists.includes(url)) {
    // return goEncrypt(config)
    return config
  }

  // 请求认证
  if (token) {
    config.headers!.Authorization = token
  } else {
    console.log(url, '错误的url')
    console.log('这里写登录失效或未登录逻辑')
  }

  // return goEncrypt(config)
  return config
}
// 请求拦截器 错误处理
export function requestError(error: AxiosRequestConfig): Promise<AxiosRequestConfig> {
  return Promise.reject(error)
}
// 响应拦截器
export function responseInterceptors(response: AxiosResponse) {
  const { data } = response
  return data
}
// 响应拦截器 错误处理
export function responseError(error: AxiosError): Promise<AxiosError> {
  return Promise.reject(error)
}

import CryptoJS from 'crypto-js'

import { deepClone } from '@/utils'

import { isString } from '../../utils/is'
import noencryptLists from '../white/noencrypt'
import { IV, SECRET } from './constant'
const { VITE_isEncrypt } = import.meta.env

// 匹配加密方式
const encryptType: { [key: string]: any } = {
  GET: encryptGet,
  POST: encryptPost,
  DELETE: encryptGet,
  PUT: encryptPost
}

// 加密
export function encrypt(word: any) {
  if (!VITE_isEncrypt) {
    return word
  }

  const keys = CryptoJS.enc.Utf8.parse(SECRET)
  const ivs = CryptoJS.enc.Utf8.parse(IV)
  const encrypted = CryptoJS.TripleDES.encrypt(word, keys, {
    iv: ivs,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  return encrypted.toString()
}

// 解密
export function decrypted(params: string) {
  const keys = CryptoJS.enc.Utf8.parse(SECRET)
  const ivs = CryptoJS.enc.Utf8.parse(IV)
  return CryptoJS.TripleDES.decrypt(params, keys, {
    iv: ivs,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  }).toString(CryptoJS.enc.Utf8)
}

// 加密get
function encryptGet(httpConfig: any) {
  try {
    const { params } = httpConfig
    const cloneParams = deepClone(params)
    const paramsKeys = Object.keys(cloneParams)
    paramsKeys.forEach(key => {
      const value = cloneParams[key]
      if (value !== '') {
        cloneParams[key] = encrypt(value)
      }
    })
    // console.log(encrypt(JSON.stringify(params)));
    httpConfig.params = cloneParams
    // console.log(httpConfig, '加密后的GET请求配置')
    return httpConfig
  } catch (error) {
    console.log(error, 'get error')
    return httpConfig
  }
}

// 把对象编码成&name=value&name=value形式
function toQueryString(obj: { [key: string]: any }) {
  if (!obj) return ''
  return deepClone(
    Object.keys(obj).map(key => {
      if (obj[key] === undefined) return ''
      return encodeURIComponent(key) + '=' + encodeURIComponent(obj[key])
    })
  ).join('&')
}

// 加密post
function encryptPost(httpConfig: any) {
  try {
    const { data } = httpConfig
    let theRequest: { [key: string]: any } = {}
    // 传参类型为 FormData
    if (Object.prototype.toString.call(data).includes('FormData')) {
      const formData = new FormData()
      data.forEach((value: any, key: string) => {
        // console.log(key, value)
        if (value instanceof File) {
          formData.append(key, value)
        } else {
          formData.append(key, encrypt(value))
        }
      })
      httpConfig.data = formData
      // console.log(httpConfig, '加密后的POST请求配置(FormData)')
      return httpConfig
    } else if (isString(data)) {
      // 当是post请求，Content-Type是 application/x-www-form-urlencoded
      // 判断是否是 key1=value1&key2=value2 的传参格式
      if (data.includes('=')) {
        const strs = data.split('&')

        // 把&name=value&name=value变为对象形式
        for (let i = 0; i < strs.length; i++) {
          theRequest[strs[i].split('=')[0]] = decodeURI(strs[i].split('=')[1])
        }
        // 对象的key不加密 value加密
        const theRequestKeys = Object.keys(theRequest)
        theRequestKeys.forEach(key => {
          theRequest[key] = encrypt(theRequest[key])
        })
        // console.log(theRequest, "数据项目");
        // console.log(toQueryString(theRequest), "数据项目");

        httpConfig.params = {}
        Object.assign(httpConfig.params, theRequest)

        httpConfig.data = toQueryString(theRequest)

        console.log(httpConfig, '加密后的POST请求配置')
        return httpConfig
      }
      // 传入参数为字符串格式的 list 集合
      httpConfig.data = {
        body: encrypt(data)
      }
      return httpConfig
    }
    // 当是post请求，Content-Type是 application/json
    theRequest = data
    httpConfig.data = {
      body: encrypt(JSON.stringify(data))
    }
    console.log(httpConfig, '加密后的POST请求配置 application/json')
    return httpConfig
  } catch (error) {
    console.log(error, 'post error')
    return httpConfig
  }
}

// 判断是不是在白名单中
function isInWhiteLists(httpConfig: any) {
  return noencryptLists.includes(httpConfig.url)
}

// 加密配置
export function goEncrypt(httpConfig: any) {
  // 判断是否配置了加密
  if (!VITE_isEncrypt) {
    return httpConfig
  }
  console.log(httpConfig, '原始请求配置')
  // 在白名单中直接不加密
  const isWhite = isInWhiteLists(httpConfig)
  if (isWhite) {
    return httpConfig
  }
  const cloneHttpConfig = deepClone(httpConfig)
  const encrypteMethod = encryptType[cloneHttpConfig.method.toUpperCase() as string]
  const config = encrypteMethod(cloneHttpConfig)
  return config
}

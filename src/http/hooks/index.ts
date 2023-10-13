import to from 'await-to-js'
import type { LoadingOptions } from 'element-plus'
import { ElLoading, ElMessage } from 'element-plus'
interface IProcessResponse {
  code: number
  msg: string
  data: any
}
interface IParams {
  // 是否展示成功提示
  showSuccessMessage: boolean
  // 展示成功提示时的提示文字
  successMessage?: string
  showLoading: boolean
  loadingOptions: LoadingOptions
}
export async function useRequest(fn: Promise<any>, params?: IParams) {
  const {
    showSuccessMessage = false,
    successMessage = '',
    showLoading = false,
    loadingOptions = {}
  } = params || {}
  // 请求是否成功的状态指示
  let status = false
  const loadingInstance = showLoading && ElLoading.service(loadingOptions)

  const [err, response] = await to<IProcessResponse>(fn)
  showLoading &&
    nextTick(() => {
      loadingInstance && loadingInstance.close()
    })

  if (err || !response) {
    console.log(err, '接口请求出错')
    status = false
    return {
      status,
      code: '',
      data: null,
      msg: ''
    }
  }

  const { code, msg, data } = response
  if (code === 200) {
    status = true
    showSuccessMessage &&
      ElMessage({
        message: successMessage || msg,
        type: 'success'
      })
  } else {
    status = false
    ElMessage({
      message: msg,
      type: 'error'
    })
  }
  return {
    status,
    code,
    data,
    msg
  }
}

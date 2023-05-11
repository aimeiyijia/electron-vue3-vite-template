import axios from 'axios'

import {
  requestError,
  requestInterceptors,
  responseError,
  responseInterceptors
} from './interceptors'

const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || '/api',
  timeout: 60000
})

instance.interceptors.request.use(requestInterceptors, requestError)

instance.interceptors.response.use(responseInterceptors, responseError)

export default instance

import axios from 'axios'
import { errTips } from './error/errTips'
import type { AxiosInstance, AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { outLogin } from '@/api/apis/user'
import router from '../router/index'
import type { Customoptions } from './types/types'

let token
let custom_options = {
  maximumConcurrency: 10, // 支持最大并发数量,默认1
  cancelRequest: true, // 是否取消重复请求
  loading: false // 是否开启loading层效果, 默认为false
}
const pendingMap = new Map() // 每次请求的Key

const service: AxiosInstance = axios.create({
  baseURL: '/',
  timeout: 1000 * 60
})

/* 请求拦截器 */
service.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // cancelRequest=true 取消重复请求 默认开启
    if (custom_options?.cancelRequest) {
      removePending(config)
      addPending(config)
    }

    token = sessionStorage.getItem('token')

    if (token && config && config?.headers) {
      config.headers.Authorization = token
    }

    // 文件上传
    // if (config.headers.file) {
    //     debugger
    //     // config.headers : "Content-type":"multipart/form-data"
    // }

    // // 参数统一处理，请求都使用data传参
    // if (config.method.toLocaleLowerCase() === 'post' || config.method.toLocaleLowerCase() === 'put') {
    //     config.data = config.data.data;
    // } else if (config.method.toLocaleLowerCase() === 'get' || config.method.toLocaleLowerCase() === 'delete') {
    //     config.params = config.data;
    // }
    return config
  },
  (error: AxiosError) => {
    const { code, message } = error
    if (code) ElMessage.error(errTips[code] || message || '未知错误')
    return Promise.reject(error)
  }
)

/* 响应拦截器 */
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const { code, message, error } = response.data
    // 根据自定义错误码判断请求是否成功
    if (code === 0) {
      // 接口反回成功删除key
      removePending(response.config)
      // 将组件用的数据返回
      return response.data
    } else {
      // token已经过期退到登录页面
      if (error == 10101) {
        router.push({ name: 'login' })
      }
      // 处理业务错误。
      ElMessage.error(errTips[code] || message || '未知错误')
      return Promise.reject(response.data)
    }
  },
  (error: AxiosError) => {
    // 处理 HTTP 网络错误
    let message = ''
    // HTTP 状态码
    const status = error.response?.status
    if (error.message === 'canceled') {
      console.error('重复请求已经取消', error)
    } else {
      switch (status) {
        case 401:
          message = 'token 失效，请重新登录'
          // 这里可以触发退出的 action
          outLogin()
          break
        case 403:
          message = '拒绝访问'
          break
        case 404:
          message = '请求地址错误'
          break
        case 500:
          message = '服务器故障'
          break
        default:
          message = '网络连接故障'
      }

      ElMessage.error(message)
      return Promise.reject(error)
    }
  }
)

/* 导出封装的请求方法 */
export const http = {
  get<T = any>(
    url: string,
    config?: AxiosRequestConfig,
    customOptions?: Customoptions
  ): Promise<T> {
    // 自定义配置
    custom_options = customOptions ? customOptions : custom_options
    return service.get(url, config)
  },

  post<T = any>(
    url: string,
    data?: object,
    config?: AxiosRequestConfig,
    customOptions?: Customoptions
  ): Promise<T> {
    custom_options = customOptions ? customOptions : custom_options
    return service.post(url, data, config)
  },

  put<T = any>(
    url: string,
    data?: object,
    config?: AxiosRequestConfig,
    customOptions?: Customoptions
  ): Promise<T> {
    custom_options = customOptions ? customOptions : custom_options
    return service.put(url, data, config)
  },

  delete<T = any>(
    url: string,
    config?: AxiosRequestConfig,
    customOptions?: Customoptions
  ): Promise<T> {
    custom_options = customOptions ? customOptions : custom_options
    return service.delete(url, config)
  }
}

// 刷新Token
const refreshToken = () => {}

// 生成请求key
function getPendingKey(config) {
  let { url, method, params, data } = config
  if (typeof data === 'string') data = JSON.parse(data) // response里面返回的config.data是个字符串对象
  return [url, method, JSON.stringify(params), JSON.stringify(data)].join('&')
}
// 存储请求key
function addPending(config) {
  const pendingKey = getPendingKey(config)
  const controller = new AbortController()
  config.signal = config.signal || controller.signal
  if (!pendingMap.has(pendingKey)) {
    pendingMap.set(pendingKey, controller)
  }
}
// 删除重复请求
function removePending(config) {
  const pendingKey = getPendingKey(config)
  if (pendingMap.has(pendingKey)) {
    // const cancelToken = pendingMap.get(pendingKey)
    // cancelToken.abort()
    pendingMap.delete(pendingKey)
  }
}

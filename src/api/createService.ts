import type {
  AxiosStatic,
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
  AxiosResponse
} from 'axios'

type onFulfilled<T> = (value: T) => T | Promise<T>
type onRejected = (error: any) => any

export interface ServiceInterceptors<T = any> {
  requestInterceptor?: onFulfilled<InternalAxiosRequestConfig<any>>
  requestInterceptorCatch?: onRejected
  responseInterceptor?: onFulfilled<AxiosResponse<T, any>>
  responseInterceptorCatch?: onRejected
}

// 运行时缓存 axios 实例
let axios: AxiosStatic | undefined

async function useAxios(): Promise<AxiosStatic> {
  if (!axios) {
    try {
      const { default: _axios } = await import('axios')
      axios = _axios
    } catch {
      throw new Error(
        '[isdream-oauth] axios is required but not found. ' +
          'Please install it with "npm i axios" or load axios via <script> tag.'
      )
    }
  }
  return axios
}

export function createService(axiosConfig?: AxiosRequestConfig) {
  // 真正的 axios 实例在第一次使用时才创建
  let instance: AxiosInstance | undefined

  // 创建实例（惰性）
  const getInstance = async (): Promise<AxiosInstance> => {
    if (!instance) {
      const axios = await useAxios()
      instance = axios.create(axiosConfig)
    }
    return instance
  }

  // 注册拦截器
  const useInterceptors = async (data: ServiceInterceptors[]) => {
    const ins = await getInstance()
    data.forEach((item) => {
      ins.interceptors.request.use(
        item.requestInterceptor,
        item.requestInterceptorCatch
      )
      ins.interceptors.response.use(
        item.responseInterceptor,
        item.responseInterceptorCatch
      )
    })
  }

  // 正常请求
  const request = async <T = any>(config: AxiosRequestConfig): Promise<T> => {
    const ins = await getInstance()
    return ins
      .request(config)
      .then((res: any) => res.data as T)
      .catch((err: any) => Promise.reject(err.response?.data ?? err))
  }

  // 不处理响应的请求
  const requestNotHandle = async <T = any>(
    config: AxiosRequestConfig
  ): Promise<T> => {
    const ins = await getInstance()
    return ins.request(config)
  }

  return {
    getInstance,
    request,
    requestNotHandle,
    useInterceptors
  }
}

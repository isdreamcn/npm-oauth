// src/service/index.ts
import { OAUTH_API_URL } from '../config'
import { createService } from './createService'

const axiosConfig = {
  baseURL: OAUTH_API_URL,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
}

/** 缓存 service 的 Promise，避免重复创建 */
let servicePromise: ReturnType<typeof createService> | undefined

/**
 * 获取已经初始化好的 service 实例（惰性、单例）
 * @example
 * const { request } = await getService()
 */
export async function getService() {
  if (!servicePromise) {
    servicePromise = createService(axiosConfig)
  }
  return servicePromise
}

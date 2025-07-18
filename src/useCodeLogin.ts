import { OAUTH_URL } from './config'
import {
  generateState,
  generateCodeVerifier,
  generateCodeChallenge
} from './utils'

interface CodeLoginOptions {
  client_id: string
  redirect_uri: string
  scope?: string
  prompt?: 'consent' | 'login' | 'none' | null
}

interface CodeLoginCallback {
  code: string
  code_verifier: string
}

export const useCodeLogin = ({
  client_id,
  redirect_uri,
  scope = 'openid profile',
  prompt = 'consent'
}: CodeLoginOptions) => {
  /**
   * 跳转到 OAuth 授权页
   */
  const oauthLoginTo = async (): Promise<void> => {
    if (!client_id) throw new Error('oauthLoginTo: 缺少 client_id')
    if (!redirect_uri) throw new Error('oauthLoginTo: 缺少 redirect_uri')

    try {
      const state = generateState()
      const codeVerifier = generateCodeVerifier()
      const codeChallenge = await generateCodeChallenge(codeVerifier)

      // 写入 sessionStorage（兼容隐私模式）
      try {
        sessionStorage.setItem('oauth_state', state)
        sessionStorage.setItem('oauth_code_verifier', codeVerifier)
      } catch {
        throw new Error(
          '无法写入 sessionStorage，请关闭浏览器的隐私模式或无痕浏览后重试。'
        )
      }

      // 构造授权 URL
      const url = new URL(OAUTH_URL)
      Object.entries({
        client_id,
        redirect_uri,
        scope,
        response_type: 'code',
        code_challenge: codeChallenge,
        code_challenge_method: 'S256',
        state,
        ...(prompt ? { prompt } : {})
      }).forEach(([k, v]) => url.searchParams.set(k, v))

      // 跳转
      window.location.href = url.toString()
    } catch (err: any) {
      throw new Error(`跳转授权页失败: ${err.message}`)
    }
  }

  /**
   * 处理授权回调，返回 code 与 code_verifier
   */
  const oauthLoginCallback = async (): Promise<CodeLoginCallback> => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    const state = params.get('state')

    const storedState = sessionStorage.getItem('oauth_state')
    const codeVerifier = sessionStorage.getItem('oauth_code_verifier')

    // 清理 sessionStorage
    sessionStorage.removeItem('oauth_state')
    sessionStorage.removeItem('oauth_code_verifier')

    if (!code) throw new Error('授权失败: 缺少 code')
    if (!codeVerifier) throw new Error('本地数据丢失，请重新登录')
    if (!storedState || state !== storedState)
      throw new Error('state 校验失败，疑似 CSRF 攻击')

    return { code, code_verifier: codeVerifier }
  }

  return { oauthLoginTo, oauthLoginCallback }
}

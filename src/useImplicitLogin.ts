import { OAUTH_URL, OAUTH_ISS } from './config'
import { generateState, generateNonce, jwtDecode } from './utils'

interface ImplicitLoginOptions {
  client_id: string
  redirect_uri: string
  scope?: string
  prompt?: 'consent' | 'login' | 'none' | null
}

interface ImplicitLoginCallback {
  id_token: string
  access_token: string
  payload: {
    sub: string
    nonce: string
    at_hash: string
    s_hash: string
    aud: string
    exp: number
    iat: number
    iss: typeof OAUTH_ISS
  }
}

export const useImplicitLogin = ({
  client_id,
  redirect_uri,
  scope = 'openid profile',
  prompt = 'consent'
}: ImplicitLoginOptions) => {
  // 1. 跳转到授权页
  const oauthLoginTo = async (): Promise<void> => {
    if (!client_id) throw new Error('oauthLoginTo: 缺少 client_id')
    if (!redirect_uri) throw new Error('oauthLoginTo: 缺少 redirect_uri')

    const state = generateState()
    const nonce = generateNonce()

    // 写入 sessionStorage
    try {
      sessionStorage.setItem('oauth_state', state)
      sessionStorage.setItem('oauth_nonce', nonce)
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
      response_type: 'id_token token',
      state,
      nonce,
      ...(prompt ? { prompt } : {})
    }).forEach(([k, v]) => url.searchParams.set(k, v))

    window.location.href = url.toString()
  }

  // 2. 处理回调
  const oauthLoginCallback = async (): Promise<ImplicitLoginCallback> => {
    const params = new URLSearchParams(window.location.hash.slice(1))
    const state = params.get('state')
    const idToken = params.get('id_token')
    const accessToken = params.get('access_token')

    const storedState = sessionStorage.getItem('oauth_state')
    const nonce = sessionStorage.getItem('oauth_nonce')

    // 清理 sessionStorage
    sessionStorage.removeItem('oauth_state')
    sessionStorage.removeItem('oauth_nonce')

    if (!idToken) throw new Error('授权失败: 缺少 id_token')
    if (!accessToken) throw new Error('授权失败: 缺少 access_token')
    if (!storedState || state !== storedState)
      throw new Error('state 校验失败，疑似 CSRF')

    let payload: ImplicitLoginCallback['payload']
    try {
      payload = jwtDecode(idToken)
    } catch (err: any) {
      throw new Error(`id_token 解码失败: ${err.message}`)
    }

    if (payload.nonce !== nonce) throw new Error('nonce 校验失败，疑似重放攻击')

    return { id_token: idToken, access_token: accessToken, payload }
  }

  return { oauthLoginTo, oauthLoginCallback }
}

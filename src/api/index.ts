import { getService } from './service'

enum Api {
  Token = 'token',
  Me = 'me'
}

export const oauthApiToken = async (data: {
  client_id: string
  redirect_uri: string
  client_secret: string
  code: string
  code_verifier: string
}) => {
  const { request } = await getService()
  return request<{
    access_token: string
    expires_in: number
    id_token: string
    scope: string
    token_type: 'Bearer'
    refresh_token?: string
  }>({
    url: Api.Token,
    method: 'POST',
    data: {
      ...data,
      grant_type: 'authorization_code'
    }
  })
}

export const oauthApiMe = async (data: { access_token: string }) => {
  const { request } = await getService()
  return request<{
    sub: string
    name: string
    updated_at: string
    email?: string
  }>({
    url: Api.Me,
    method: 'POST',
    data
  })
}

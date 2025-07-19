import { oauthApiToken, oauthApiMe } from 'isdream-oauth'

// 1. 用 code 换 token
oauthApiToken({
  client_id: 'PcvDO3Dwh62YZdF8Iv8aN',
  redirect_uri: 'https://s.isdream.cn/home',
  client_secret:
  '3bd0d1ba801b7e688d1db5d81512d5f75fde7f3ff3d1c6540e008fa4fe1fe3bf',
  code: '',
  code_verifier: 'n2ZzNh6dcF4e7jZdyShl23e5QHHrrc_HCL34IjLlo_Q',
}).then(res => {
  console.log(res);
})

// 2. 获取用户信息
oauthApiMe({ access_token: '' }).then(res => {
  console.log(res);
})
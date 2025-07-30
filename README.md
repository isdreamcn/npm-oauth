# isdream-oauth

**一款「开箱即用」的 isdream 统一登录封装库**
[官方文档](https://account.isdream.cn/accessOAuth/openIDConnect)

## 安装

```bash
npm install isdream-oauth
```

## 使用示例

### 浏览器

```html
<!DOCTYPE html>
<html>
<body>
  <button id="loginBtn">isdream 账号登录</button>

  <script src="isdream-oauth.js"></script>
  <script>
    const { useCodeLogin } = isdreamOAuth

    const { oauthLoginTo, oauthLoginCallback } = useCodeLogin({
      client_id: 'PcvDO3Dwh62YZdF8Iv8aN',
      redirect_uri: 'https://s.isdream.cn/home'
    })

    document.getElementById('loginBtn').onclick = oauthLoginTo

    oauthLoginCallback()
      .then(res => console.log('登录成功', res))
      .catch(err => console.error('登录失败', err))
  </script>
</body>
</html>
```

### Vue 3

```vue
<template>
  <button @click="oauthLoginTo">isdream 账号登录</button>
</template>

<script setup>
import { useCodeLogin } from 'isdream-oauth'

const { oauthLoginTo, oauthLoginCallback } = useCodeLogin({
  client_id: 'PcvDO3Dwh62YZdF8Iv8aN',
  redirect_uri: 'https://s.isdream.cn/home'
})

oauthLoginCallback()
  .then(res => console.log('登录成功', res))
  .catch(err => console.error('登录失败', err))
</script>
```

### OAuth API

```javascript
import { oauthApiToken, oauthApiMe } from 'isdream-oauth'

// 1. 用 code 换 token
oauthApiToken({
  client_id: 'PcvDO3Dwh62YZdF8Iv8aN',
  client_secret: '3bd0d1ba801b7e688d1db5d81512d5f75fde7f3ff3d1c6540e008fa4fe1fe3bf',
  code: '回调拿到的 code',
  code_verifier: 'PKCE 校验串',
  redirect_uri: 'https://s.isdream.cn/home'
}).then(res => {
  console.log(res)
})

// 2. 获取用户信息
oauthApiMe({ access_token: '上一步返回的 access_token' }).then(res => {
  console.log(res)
})
```

## 核心 API

| 方法名           | 说明                                      |
| ---------------- | ----------------------------------------- |
| useCodeLogin     | 授权码 + PKCE（推荐）                     |
| useImplicitLogin | 隐式授权（不推荐），使用同 `useCodeLogin` |
| oauthApiToken    | 用 code 换 token                          |
| oauthApiMe       | 用 token 获取用户信息                     |

## 常量速查

| 常量名        | 含义            |
| ------------- | --------------- |
| FAVICON_URL   | 网站图标地址    |
| OAUTH_API_URL | OAuth 接口地址  |
| OAUTH_ISS     | OIDC 身份标识   |
| OAUTH_URL     | OIDC 授权页地址 |

## License

MIT

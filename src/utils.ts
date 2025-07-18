/** 生成随机 Base64URL 字符串（不截断，长度固定） */
function base64URLEncode(buffer: Uint8Array) {
  let binary = ''
  for (let i = 0; i < buffer.length; i++) {
    binary += String.fromCharCode(buffer[i])
  }
  return btoa(binary)
    .replace(/\+/g, '-') // URL安全字符替换
    .replace(/\//g, '_')
    .replace(/=/g, '') // 移除填充
}

/** 生成 state（默认 32 字节 => 43 字符） */
export function generateState(lenBytes = 32) {
  // 验证长度有效性
  if (lenBytes < 1) throw new Error('lenBytes must be at least 1')

  const bytes = new Uint8Array(lenBytes)
  window.crypto.getRandomValues(bytes) // 使用密码学安全随机数
  return base64URLEncode(bytes)
}

/** 生成安全的 nonce 参数 */
export function generateNonce(lenBytes = 16) {
  // 验证长度有效性
  if (lenBytes < 1) throw new Error('lenBytes must be at least 1')

  const bytes = new Uint8Array(lenBytes)
  window.crypto.getRandomValues(bytes) // 使用密码学安全随机数
  return base64URLEncode(bytes)
}

/** 生成 code_verifier（43-128 字符，默认 43） */
export function generateCodeVerifier(lenBytes = 32) {
  // 根据 RFC 7636 验证字节长度范围
  if (lenBytes < 32 || lenBytes > 96) {
    throw new Error('lenBytes must be between 32 and 96 (inclusive)')
  }

  const bytes = new Uint8Array(lenBytes)
  window.crypto.getRandomValues(bytes)
  return base64URLEncode(bytes)
}

/** 生成 code_challenge (S256) */
export async function generateCodeChallenge(verifier: string) {
  // 验证输入长度符合 PKCE 规范
  if (verifier.length < 43 || verifier.length > 128) {
    throw new Error('Verifier must be 43-128 characters')
  }

  const encoder = new TextEncoder()
  const data = encoder.encode(verifier) // UTF-8 编码
  const digest = await window.crypto.subtle.digest('SHA-256', data)
  return base64URLEncode(new Uint8Array(digest)) // 哈希后Base64URL编码
}

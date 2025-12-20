const ENCRYPTION_KEY_NAME = "ai-settings-key"

async function getEncryptionKey(): Promise<CryptoKey> {
  const keyData = new TextEncoder().encode(
    "codelessshipmore-ai-settings-v1".padEnd(32, "0")
  )
  return crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "AES-GCM" },
    false,
    ["encrypt", "decrypt"]
  )
}

export interface EncryptedData {
  iv: string
  data: string
}

export async function encrypt(plaintext: string): Promise<EncryptedData> {
  const key = await getEncryptionKey()
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const encodedData = new TextEncoder().encode(plaintext)

  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encodedData
  )

  return {
    iv: btoa(String.fromCharCode(...iv)),
    data: btoa(String.fromCharCode(...new Uint8Array(encryptedBuffer)))
  }
}

export async function decrypt(encrypted: EncryptedData): Promise<string> {
  const key = await getEncryptionKey()
  const iv = new Uint8Array(
    atob(encrypted.iv)
      .split("")
      .map((c) => c.charCodeAt(0))
  )
  const data = new Uint8Array(
    atob(encrypted.data)
      .split("")
      .map((c) => c.charCodeAt(0))
  )

  const decryptedBuffer = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    data
  )

  return new TextDecoder().decode(decryptedBuffer)
}

export async function encryptAndStore(
  key: string,
  value: string
): Promise<void> {
  if (typeof window === "undefined") return
  const encrypted = await encrypt(value)
  localStorage.setItem(key, JSON.stringify(encrypted))
}

export async function retrieveAndDecrypt(
  key: string
): Promise<string | null> {
  if (typeof window === "undefined") return null
  const stored = localStorage.getItem(key)
  if (!stored) return null

  try {
    const encrypted = JSON.parse(stored) as EncryptedData
    return await decrypt(encrypted)
  } catch {
    return null
  }
}

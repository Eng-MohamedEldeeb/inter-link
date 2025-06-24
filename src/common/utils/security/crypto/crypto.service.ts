import CryptoJS from 'crypto-js'

export const encryptValue = (value: string, key?: string): string => {
  return String(
    CryptoJS.AES.encrypt(value, key ?? (process.env.CRYPTO_KEY as string)),
  )
}

export const decryptValue = ({
  encryptedValue,
  key,
}: {
  encryptedValue: string
  key?: string
}): string => {
  return CryptoJS.AES.decrypt(
    encryptedValue,
    key ?? (process.env.CRYPTO_KEY as string),
  ).toString(CryptoJS.enc.Utf8)
}

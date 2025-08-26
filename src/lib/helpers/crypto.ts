const secretKey = import.meta.env.VITE_SECRET_KEY || "Afeed_app";

export const decryptAes256Cbc = async (
  encryptedBase64: string,
  base64Key: string
) => {
  const encryptedBytes = b64ToBytes(encryptedBase64);
  const iv = encryptedBytes.slice(0, 16);
  const ciphertext = encryptedBytes.slice(16);

  const keyBytes = b64ToBytes(base64Key);
  const cryptoKey = await window.crypto.subtle.importKey(
    "raw",
    keyBytes,
    { name: "AES-CBC", length: 256 },
    false, // not extractable
    ["decrypt"]
  );

  const plainBuffer = await window.crypto.subtle.decrypt(
    { name: "AES-CBC", iv },
    cryptoKey,
    ciphertext
  );

  return new TextDecoder().decode(plainBuffer);
};
export const encryptAes256Cbc = async (plaintext: any, base64Key: string) => {
  const keyBytes = await window.crypto.subtle.importKey(
    "raw",
    b64ToBytes(base64Key),
    { name: "AES-CBC", length: 256 },
    false,
    ["encrypt"]
  );
  const iv = crypto.getRandomValues(new Uint8Array(16));
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-CBC", iv },
    keyBytes,
    new TextEncoder().encode(plaintext)
  );
  const encrypted = btoa(String.fromCharCode(...new Uint8Array(ciphertext)));
  return encrypted;
};
const b64ToBytes = (b64: string) =>
  Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));

const strToBase64 = (str: string) => btoa(unescape(encodeURIComponent(str)));

export const decryptWithSecretKey = (encryptedBase64: string) => {
  return decryptAes256Cbc(encryptedBase64, secretKey);
};

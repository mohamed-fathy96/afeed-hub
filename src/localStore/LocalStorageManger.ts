// constants
import { decryptData, encryptData } from "@app/lib/helpers/constants/helpers";

class LocalStorageManager {
  static setItem(key: string, data: any): void {
    // Store data as JSON string for consistency
    const jsonValue = JSON.stringify(data);
    localStorage.setItem(key, jsonValue);
  }

  static getItem(key: string): any {
    const value: any = localStorage.getItem(key);
    
    if (value === null || value === undefined) {
      return null;
    }
    
    try {
      // Try to parse as JSON first
      return JSON.parse(value);
    } catch (e) {
      // If JSON parsing fails, try decryption
      try {
        return decryptData(value);
      } catch (decryptError) {
        console.warn(`Failed to parse/decrypt data for key ${key}:`, decryptError);
        return null;
      }
    }
  }

  static removeItem(key: string): any {
    const value = this.getItem(key);
    localStorage.removeItem(key);
    return value;
  }

  static clear(): void {
    localStorage.clear();
  }
}

export default LocalStorageManager;

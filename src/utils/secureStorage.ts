import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.REACT_APP_STORAGE_SECRET || 'default-secret-key';

export const secureStorage = {
  setItem: (key: string, value: any) => {
    try {
      const encryptedValue = CryptoJS.AES.encrypt(
        JSON.stringify(value),
        SECRET_KEY
      ).toString();
      localStorage.setItem(key, encryptedValue);
    } catch (error) {
      console.error('Error encrypting data:', error);
      throw new Error('Failed to store data securely');
    }
  },

  getItem: (key: string) => {
    try {
      const encryptedValue = localStorage.getItem(key);
      if (!encryptedValue) return null;

      const decryptedValue = CryptoJS.AES.decrypt(encryptedValue, SECRET_KEY);
      const decryptedString = decryptedValue.toString(CryptoJS.enc.Utf8);
      if (!decryptedString) return null;
      return JSON.parse(decryptedString);
    } catch (error) {
      console.error('Error decrypting data:', error);
      return null;
    }
  },

  removeItem: (key: string) => {
    localStorage.removeItem(key);
  },

  clear: () => {
    localStorage.clear();
  }
}; 
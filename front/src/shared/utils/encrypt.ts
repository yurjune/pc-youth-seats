import CryptoJS from 'crypto-js';

export const encrypt = (pw: string): string => {
  return CryptoJS.SHA224(pw).toString();
};

import CryptoJS from 'crypto-js';

export const encrypt = (pw: string): string => {
  return CryptoJS.SHA512(pw).toString();
};

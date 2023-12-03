import CryptoJS from 'crypto-js';

export const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : String(error);

export const encrypt = (pw: string): string => {
  return CryptoJS.SHA224(pw).toString();
};

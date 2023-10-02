const IS_PRODUCTION = import.meta.env.PROD;
const SERVER_URL = IS_PRODUCTION ? 'http://3.34.59.214:5100' : 'http://localhost:5100';
const ADMIN_PW = import.meta.env.VITE_APP_ADMIN_PW ?? '';
const REDEEMUS_PW = import.meta.env.VITE_APP_REDEEMUS_PW ?? '';

export interface Env {
  IS_PRODUCTION: boolean;
  SERVER_URL: string;
  ADMIN_PW: string;
  REDEEMUS_PW: string;
}

export const env: Env = {
  IS_PRODUCTION,
  SERVER_URL,
  ADMIN_PW,
  REDEEMUS_PW,
};

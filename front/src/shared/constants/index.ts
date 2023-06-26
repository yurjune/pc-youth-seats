const SERVER_URL = import.meta.env.DEV ? 'http://localhost:5000' : 'http://3.34.59.214:5000';
const GA_ID = import.meta.env.VITE_APP_GA_ID;
const ADMIN_PW = import.meta.env.VITE_APP_ADMIN_PW ?? '';
const REDEEMUS_PW = import.meta.env.VITE_APP_REDEEMUS_PW ?? '';

interface Env {
  SERVER_URL: string;
  GA_ID: string | undefined;
  ADMIN_PW: string;
  REDEEMUS_PW: string;
}

export const env: Env = {
  SERVER_URL,
  GA_ID,
  ADMIN_PW,
  REDEEMUS_PW,
};

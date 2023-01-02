const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
const SERVER_URL = IS_DEVELOPMENT ? 'http://localhost:5000' : 'http://3.34.59.214:5000';
const GA_ID = process.env.REACT_APP_GA_ID;
const ADMIN_PW = process.env.REACT_APP_ADMIN_PW ?? '';
const REDEEMUS_PW = process.env.REACT_APP_REDEEMUS_PW ?? '';

interface Env {
  IS_PRODUCTION: boolean;
  IS_DEVELOPMENT: boolean;
  SERVER_URL: string;
  GA_ID: string | undefined;
  ADMIN_PW: string;
  REDEEMUS_PW: string;
}

export const env: Env = {
  IS_PRODUCTION,
  IS_DEVELOPMENT,
  SERVER_URL,
  GA_ID,
  ADMIN_PW,
  REDEEMUS_PW,
};

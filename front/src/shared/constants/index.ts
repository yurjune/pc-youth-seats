export const IS_PRODUCTION = process.env.NODE_ENV === 'production';
export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
export const SERVER_URL = IS_DEVELOPMENT ? 'http://localhost:5000' : 'http://3.34.59.214:5000';
export const GA_ID = process.env.REACT_APP_GA_ID;
export const ADMIN_PW = process.env.REACT_APP_ADMIN_PW ?? '';
export const REDEEMUS_PW = process.env.REACT_APP_REDEEMUS_PW ?? '';

export const IS_PRODUCTION = process.env.NODE_ENV === 'production';
export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

export const SERVER_URL = IS_DEVELOPMENT ? 'http://localhost:5000' : 'http://3.34.59.214:5000';
export const GA_ID = process.env.REACT_APP_GA_ID;

export const ADMIN_PW =
  'cb70c1ecebf67ada2ae0dc35835af04aef5b192c6ae70a2ba82ed5734702f9c4b1340e804fbdc98a36196623e11091565ef8bc1d18f75813a20fbe5a6067e3f5';
export const REDEEMUS_PW =
  '02f76f662c66dc428a76cd20eeb345f0fbc7535e296a64fde3eb16d7c7050a8646244fd4709926e82a6b0db76bde96ed766288cc95b73ef3adaee082d098c5dd';

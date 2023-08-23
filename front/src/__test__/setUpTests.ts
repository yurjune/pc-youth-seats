import '@testing-library/jest-dom';

jest.mock('@shared/constants', () => ({
  env: {
    IS_PRODUCTION: false,
    SERVER_URL: 'mockUrl',
    GA_ID: undefined,
    ADMIN_PW: '',
    REDEEMUS_PW: '',
  },
}));

export {};

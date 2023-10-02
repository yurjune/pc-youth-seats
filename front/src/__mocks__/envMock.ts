import { Env } from '@shared/constants';
import { encrypt } from '@shared/utils';

export const envMock: Env = {
  IS_PRODUCTION: false,
  SERVER_URL: 'mockUrl',
  ADMIN_PW: encrypt('1234'),
  REDEEMUS_PW: encrypt('1234'),
};

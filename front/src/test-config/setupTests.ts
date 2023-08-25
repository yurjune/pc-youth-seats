import '@testing-library/jest-dom';
import { envMock } from '@__mocks__/envMock';

jest.mock('@shared/constants', () => ({
  env: envMock,
}));

export {};

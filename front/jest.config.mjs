import { pathsToModuleNameMapper } from 'ts-jest';
import tsconfig from './tsconfig.json' assert { type: 'json' };

/** @type {import('jest').Config} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom', // browser-like environment
  globals: {
    'ts-jest': { isolatedModules: true }, // Resolve slow testing due to using ts-jest
  },

  moduleNameMapper: {
    ...pathsToModuleNameMapper(tsconfig.compilerOptions.paths), // for resolve tsconfig's paths
    '\\.(css|less|scss)$': 'identity-obj-proxy', // for mocking scss module
    axios: '<rootDir>/node_modules/axios/dist/node/axios.cjs',
  },
  modulePaths: ['src'],

  setupFilesAfterEnv: ['mock-local-storage'], // for mocking local storage

  clearMocks: true,
};

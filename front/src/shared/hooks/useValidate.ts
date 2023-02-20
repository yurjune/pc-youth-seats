import { type Either, match } from 'fp-ts/lib/Either';
import { pipe, identity } from 'fp-ts/lib/function';
import { useState, ChangeEvent } from 'react';

export type StateValidator = {
  validateAndGetError: () => string;
  error: string;
};

export const INITIAL_ERROR = ' ';

export const useInputValidate = (validator: (v: string) => Either<string, string>, initialState?: string) => {
  const [value, setValue] = useState(initialState ?? '');
  const [error, setError] = useState(initialState ?? INITIAL_ERROR);

  const changeError = (error: string) => {
    setError(error);
    return error;
  };

  const changeValue = (e: ChangeEvent<HTMLInputElement>) =>
    pipe(
      validator(e.target.value),
      match(identity, () => INITIAL_ERROR),
      changeError,
      () => setValue(e.target.value),
    );

  const stateValidator: StateValidator = {
    validateAndGetError(): string {
      return pipe(
        validator(value),
        match(identity, () => INITIAL_ERROR),
        changeError,
      );
    },

    get error(): string {
      return error;
    },
  };

  return [value, changeValue, setValue, stateValidator] as const;
};

import * as A from 'fp-ts/Array';
import { fromPredicate, type Either } from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import { type Predicate } from 'fp-ts/Predicate';
import { INITIAL_ERROR, StateValidator } from '../hooks';
import { maxLength, minLength, samePassword } from './rules';

// 공통 검증 함수
const validate =
  <T>(rules: Array<Predicate<T>>, errorMessage: string) =>
  (value: T): Either<string, T> =>
    pipe(
      value,
      fromPredicate(
        (val) =>
          pipe(
            rules,
            A.map((fn) => fn(val)),
            A.every(Boolean),
          ),
        () => errorMessage,
      ),
    );

const getErrorFromValidators = (validators: StateValidator[]): string | null => {
  const isError = (err: string) => err !== INITIAL_ERROR;
  const head = <T>(as: Array<T>): O.Option<T> => (as.length === 0 ? O.none : O.some(as[0]));

  return pipe(
    validators,
    A.map((v) => v.validateAndGetError()),
    A.filter(isError),
    head,
    O.toNullable,
  );
};

const validateName = (name: string): Either<string, string> =>
  pipe(name, validate([minLength(2), maxLength(4)], '이름을 2자 이상 4자 이하로 입력해주세요.'));

const validatePw = (pw: string): Either<string, string> =>
  pipe(pw, validate([minLength(4)], '비밀번호를 4자 이상 입력해주세요.'));

const validatePwCheck =
  (exPw: string) =>
  (pwCheck: string): Either<string, string> =>
    pipe(pwCheck, validate([samePassword(exPw)], '비밀번호가 일치하지 않습니다.'));

export { validate, getErrorFromValidators, validateName, validatePw, validatePwCheck };

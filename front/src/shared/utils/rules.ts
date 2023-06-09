import { type Predicate } from 'fp-ts/lib/Predicate';

// 각각의 검증 규칙
const minLength =
  (limit: number): Predicate<string> =>
  (value: string) =>
    value.length >= limit;

const maxLength =
  (limit: number): Predicate<string> =>
  (value: string) =>
    value.length <= limit;

const samePassword =
  (exValue: string): Predicate<string> =>
  (value: string) =>
    value === exValue;

export { minLength, maxLength, samePassword };

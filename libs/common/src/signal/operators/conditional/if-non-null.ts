import { computed } from '@angular/core';
import { isNonNull } from '../../../util/is-non-null';
import { signalize } from '../../signalize';
import {
  OperatorFunction,
  SignalOrRegularFn,
  SignalOrValue,
  UnaryFunction,
} from '../types';
import { iif } from './iif';

export function ifNonNull<T, R>(
  thenBranch: UnaryFunction<NonNullable<T>, SignalOrValue<R>>
): OperatorFunction<T | null | undefined, R | undefined>;

export function ifNonNull<T, R, F>(
  thenBranch: UnaryFunction<NonNullable<T>, SignalOrValue<R>>,
  elseBranch: SignalOrRegularFn<F>
): OperatorFunction<T | null | undefined, R | F>;

export function ifNonNull<T, R, F>(
  thenBranch: UnaryFunction<NonNullable<T>, SignalOrValue<R>>,
  elseBranch?: SignalOrRegularFn<F>
): OperatorFunction<T | null | undefined, R | F | undefined>;

export function ifNonNull<T, R, F>(
  thenBranch: UnaryFunction<NonNullable<T>, SignalOrValue<R>>,
  elseBranch?: SignalOrRegularFn<F>
): OperatorFunction<T | null | undefined, R | F | undefined> {
  return (source) =>
    iif(
      () => signalize(thenBranch(source() as NonNullable<T>))(),
      elseBranch
    )(computed(() => isNonNull(source())));
}

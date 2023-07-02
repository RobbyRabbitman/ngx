import { computed } from '@angular/core';
import { isNonNull } from '../util/is-non-null';
import { iif } from './iif';
import {
  InferSignalTuple,
  InferSignalValueTupleAsNonNullable,
  OperatorFunction,
  SignalOrRegularFn,
  SignalTuple,
  UnaryFunction,
} from './types';
/**
 *
 * @param thenBranch
 */
export function ifNonNull<T, R>(
  thenBranch: UnaryFunction<NonNullable<T>, R>
): OperatorFunction<T, R | undefined>;
/**
 *
 * @param thenBranch
 * @param elseBranch
 */
export function ifNonNull<T, R, F>(
  thenBranch: UnaryFunction<NonNullable<T>, R>,
  elseBranch: SignalOrRegularFn<F>
): OperatorFunction<T, R | F>;
/**
 *
 * @param thenBranch
 * @param elseBranch
 * @returns
 */
export function ifNonNull<T, R, F>(
  thenBranch: UnaryFunction<NonNullable<T>, R>,
  elseBranch?: SignalOrRegularFn<F>
): OperatorFunction<T, R | F | undefined> {
  return (source) =>
    iif(
      () => thenBranch(source() as NonNullable<T>),
      elseBranch as SignalOrRegularFn<F>
    )(computed(() => isNonNull(source())));
}

/**
 *
 * @param source
 * @param thenBranch
 * @returns a signal based on the speficified callback if source is non nullish else undefined.
 */
export const ifEveryNonNull =
  <T extends SignalTuple, R, F>(
    thenBranch: (...values: InferSignalValueTupleAsNonNullable<T>) => R,
    elseBranch?: SignalOrRegularFn<F>
  ) =>
  (...sources: InferSignalTuple<T>) =>
    iif(
      () =>
        thenBranch(
          ...(sources.map((x) => x()) as InferSignalValueTupleAsNonNullable<T>)
        ),
      elseBranch as SignalOrRegularFn<F>
    )(computed(() => sources.every((x) => isNonNull(x()))));

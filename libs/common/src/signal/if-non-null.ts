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

export const ifNonNull =
  <T, R, F>(
    thenBranch: UnaryFunction<NonNullable<T>, R>,
    elseBranch?: SignalOrRegularFn<F>
  ): OperatorFunction<T, R | F | undefined> =>
  (source) =>
    iif(
      () => thenBranch(source() as NonNullable<T>),
      elseBranch as SignalOrRegularFn<F>
    )(computed(() => isNonNull(source())));

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

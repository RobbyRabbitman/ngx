import { computed } from '@angular/core';
import { isNonNull } from '../../../util/is-non-null';
import {
  InferSignalTuple,
  InferSignalValueTupleAsNonNullable,
  SignalOrRegularFn,
  SignalTuple,
} from '../types';
import { iif } from './iif';

/**
 *
 * @param thenBranch
 * @param elseBranch
 * @returns
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

import { Signal, computed } from '@angular/core';
import { isNonNull } from '../util/is-non-null';
import { iif } from './iif';
import { SignalOrRegularFn } from './types';

/**
 *
 * @param source
 * @param thenBranch
 * @returns a signal based on the speficified callback if source is non nullish else undefined.
 */
export const ifNonNull =
  <T extends readonly Signal<any | null | undefined>[], R, F>(
    thenBranch: (
      ...values: readonly [
        ...{
          [K in keyof T]: T[K] extends Signal<infer V> ? NonNullable<V> : never;
        }
      ]
    ) => R,
    elseBranch?: SignalOrRegularFn<F>
  ) =>
  (
    ...sources: readonly [
      ...{
        [K in keyof T]: T[K] extends Signal<infer V> ? Signal<V> : never;
      }
    ]
  ) =>
    iif(
      computed(() => thenBranch(...sources.map((x) => x()))),
      elseBranch
    )(computed(() => sources.every((x) => isNonNull(x()))));

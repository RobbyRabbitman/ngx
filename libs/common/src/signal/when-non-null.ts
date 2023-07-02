import { Signal, computed } from '@angular/core';
import { isNonNull } from '../util/is-non-null';
import { EMPTY } from './empty';
import { iif } from './iif';

/**
 *
 * @param source
 * @param then
 * @returns a signal based on the speficified callback if source is non nullish else undefined.
 */
export const whenNonNull =
  <T extends readonly Signal<any | null | undefined>[], R>(
    then: (
      ...values: [
        ...{
          [K in keyof T]: T[K] extends Signal<infer V> ? NonNullable<V> : never;
        }
      ]
    ) => R
  ) =>
  (...sources: T) =>
    iif(
      computed(() => then(...(sources.map((x) => x()) as any))),
      EMPTY
    )(computed(() => sources.every((x) => isNonNull(x()))));

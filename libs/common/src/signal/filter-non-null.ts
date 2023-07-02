import { Signal, computed } from '@angular/core';
import { isNonNull } from '../util/is-non-null';
import { EMPTY } from './empty';
import { iif } from './iif';

/**
 *
 * @param source
 * @param fn
 * @returns a signal based on the speficified callback if source is non nullish else undefined.
 */
export const filterNonNull = <
  I extends readonly Signal<any | null | undefined>[],
  O
>(
  fn: (
    ...values: [
      ...{
        [K in keyof I]: I[K] extends Signal<infer X> ? NonNullable<X> : never;
      }
    ]
  ) => O,
  ...sources: I
) =>
  iif(
    computed(() => sources.every((x) => isNonNull(x()))),
    computed(() => fn(...(sources.map((x) => x()) as any))),
    EMPTY
  );

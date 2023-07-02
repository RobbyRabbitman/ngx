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
export const filterNonNull = <I, O>(
  source: Signal<I | null | undefined>,
  fn: (value: NonNullable<I>) => O
) =>
  iif(
    computed(() => isNonNull(source())),
    computed(() => fn(source() as NonNullable<I>)),
    EMPTY
  );

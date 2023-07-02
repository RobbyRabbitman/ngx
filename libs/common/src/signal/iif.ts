import { Signal, computed } from '@angular/core';
import { EMPTY } from './empty';

/**
 *
 * @param source
 * @param truthyBranch
 * @param falsyBranch
 * @returns the truthy branch if the source is truthy, else the falsy branch or undefined if not provided.
 */
export const iif = <T, F>(
  source: Signal<boolean>,
  truthyBranch: Signal<T>,
  falsyBranch?: Signal<F>
): Signal<T | F | undefined> =>
  computed(() => (source() ? truthyBranch() : falsyBranch?.() ?? EMPTY()));

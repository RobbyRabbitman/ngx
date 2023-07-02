import { Signal, computed } from '@angular/core';
import { EMPTY } from './empty';
import { OperatorFunction, SignalOrRegularFn } from './types';

/**
 *
 * @param source
 * @param truthyBranch
 * @param falsyBranch
 * @returns the truthy branch if the source is truthy, else the falsy branch or undefined if not provided.
 */
export const iif =
  <T, F>(
    truthyBranch: SignalOrRegularFn<T>,
    falsyBranch?: SignalOrRegularFn<F>
  ): OperatorFunction<boolean, T | F | undefined> =>
  (source: Signal<boolean>) =>
    computed(() => (source() ? truthyBranch() : falsyBranch?.() ?? EMPTY()));

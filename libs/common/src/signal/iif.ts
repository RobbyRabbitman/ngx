import { computed } from '@angular/core';
import { OperatorFunction, SignalOrRegularFn } from './types';

/**
 *
 * @param source
 * @param thenBranch
 * @param elseBranch
 * @returns the truthy branch if the source is truthy, else the falsy branch or undefined if not provided.
 */

export const iif =
  <C, T, F>(
    thenBranch: SignalOrRegularFn<T>,
    elseBranch?: SignalOrRegularFn<F>
  ): OperatorFunction<C, T | F | undefined> =>
  (source) =>
    computed(() => (source() ? thenBranch() : elseBranch?.()));

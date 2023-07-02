import { computed } from '@angular/core';
import { OperatorFunction, SignalOrRegularFn } from './types';

/**
 *
 * @param source
 * @param thenBranch
 * @param elseBranch
 * @returns the truthy branch if the source is truthy, else the falsy branch or undefined if not provided.
 */
export function iif<C, T, F>(
  thenBranch: SignalOrRegularFn<T>,
  elseBranch: SignalOrRegularFn<F>
): OperatorFunction<C, T | F>;
export function iif<C, T, F>(
  thenBranch: SignalOrRegularFn<T>,
  elseBranch?: SignalOrRegularFn<F>
): OperatorFunction<C, T | F | undefined> {
  return (source: SignalOrRegularFn<C>) =>
    computed(() => (source() ? thenBranch() : elseBranch?.()));
}

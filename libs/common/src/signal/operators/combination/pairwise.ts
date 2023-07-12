import { computed } from '@angular/core';
import { OperatorFunction } from '../types';

/**
 *
 * @returns the previous and current value of a signal as a pair.
 */
export function pairwise<T>(): OperatorFunction<T, [T | undefined, T]>;

/**
 *
 * @param initialPrevious
 * @returns the previous and current value of a signal as a pair.
 */
export function pairwise<T>(initialPrevious: T): OperatorFunction<T, [T, T]>;

/**
 *
 * @param initialPrevious
 * @returns the previous and current value of a signal as a pair.
 */
export function pairwise<T>(
  initialPrevious?: T
): OperatorFunction<T, [T | undefined, T]> {
  let previous: T | undefined = initialPrevious;
  return (source) => computed(() => [previous, (previous = source())]);
}

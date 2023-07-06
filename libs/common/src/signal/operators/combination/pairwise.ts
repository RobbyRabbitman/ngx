import { computed } from '@angular/core';
import { OperatorFunction } from '../types';
export function pairwise<T>(): OperatorFunction<T, [T | undefined, T]>;

export function pairwise<T>(initialPrevious: T): OperatorFunction<T, [T, T]>;

export function pairwise<T>(
  initialPrevious?: T
): OperatorFunction<T, [T | undefined, T]> {
  let previous: T | undefined = initialPrevious;
  return (source) => computed(() => [previous, (previous = source())]);
}

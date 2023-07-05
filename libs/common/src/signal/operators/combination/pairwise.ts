import { computed } from '@angular/core';
import { OperatorFunction } from '../types';
export function pairwise<T>(): OperatorFunction<T, [T | undefined, T]>;

export function pairwise<T>(startWith: T): OperatorFunction<T, [T, T]>;

export function pairwise<T>(
  startWith?: T
): OperatorFunction<T, [T | undefined, T]> {
  let previous: T | undefined = startWith;
  return (source) => computed(() => [previous, (previous = source())]);
}

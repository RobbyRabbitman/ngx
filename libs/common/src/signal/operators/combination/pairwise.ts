import { computed } from '@angular/core';
import { OperatorFunction } from '../types';

export function pairwise<T, R>(
  projector: (previous: T | undefined, current: T) => R
): OperatorFunction<T, R>;

export function pairwise<T, R>(
  projector: (previous: T, current: T) => R,
  startWithPrevious: T
): OperatorFunction<T, R>;

export function pairwise<T, R>(
  projector: (previous: T | undefined, current: T) => R,
  startWithPrevious?: T
): OperatorFunction<T, R> {
  let previous: T | undefined = startWithPrevious;
  return (source) => computed(() => projector(previous, (previous = source())));
}

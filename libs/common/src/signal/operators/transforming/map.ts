import { computed } from '@angular/core';
import { OperatorFunction } from '../types';

export const map =
  <T, R>(projector: (value: T) => R): OperatorFunction<T, R> =>
  (source) =>
    computed(() => projector(source()));

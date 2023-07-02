import { Signal, computed } from '@angular/core';
import { OperatorFunction } from './types';

export const map =
  <I, O>(projector: (value: I) => O): OperatorFunction<I, O> =>
  (source: Signal<I>) =>
    computed(() => projector(source()));

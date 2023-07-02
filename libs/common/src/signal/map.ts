import { computed } from '@angular/core';
import { OperatorFunction } from './types';

export const map =
  <I, O>(projector: (value: I) => O): OperatorFunction<I, O> =>
  (source) =>
    computed(() => projector(source()));

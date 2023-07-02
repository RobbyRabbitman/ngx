import { Signal, computed } from '@angular/core';
import { PipeFunction } from './pipe';

export const map =
  <I, O>(projector: (value: I) => O): PipeFunction<I, O> =>
  (source: Signal<I>) =>
    computed(() => projector(source()));

import { Signal, isSignal, signal } from '@angular/core';

/**
 *
 * @param source
 * @returns the source when it is a signal, else creates a new signal with the source as its initial value.
 */
export const signalize = <T>(source: T | Signal<T>) =>
  isSignal(source) ? source : signal(source);

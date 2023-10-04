import { Signal, isSignal, signal } from '@angular/core';

export const signalize = <T>(x: T | Signal<T>) => (isSignal(x) ? x : signal(x));

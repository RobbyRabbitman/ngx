import { Signal } from '@angular/core';

export type UnaryFunction<T, R> = (source: T) => R;

export type OperatorFunction<T, R> = UnaryFunction<Signal<T>, Signal<R>>;

export type SignalOrRegularFn<T> = Signal<T> | (() => T);

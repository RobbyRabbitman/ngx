import { Signal, computed } from '@angular/core';

export type UnaryFunction<T, R> = (source: T) => R;

export type OperatorFunction<T, R> = UnaryFunction<
  SignalOrRegularFn<T>,
  Signal<R>
>;

export const createOperatorFunction =
  <T, R>(op: UnaryFunction<SignalOrRegularFn<T>, R>) =>
  (source: SignalOrRegularFn<T>) =>
    computed(() => op(source));

export type SignalOrRegularFn<T> = Signal<T> | (() => T);

export type SignalTuple<T extends readonly Signal<any>[]> = {
  [K in keyof T]: T[K] extends Signal<infer V> ? Signal<V> : never;
};

export type SignalValueTuple<T extends readonly Signal<any>[]> = {
  [K in keyof T]: T[K] extends Signal<infer V> ? V : never;
};

export type NonNullableSignalValueTuple<T extends readonly Signal<any>[]> = {
  [K in keyof T]: T[K] extends Signal<infer V> ? NonNullable<V> : never;
};

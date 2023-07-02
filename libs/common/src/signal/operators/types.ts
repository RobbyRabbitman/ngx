import { Signal } from '@angular/core';

export type UnaryFunction<T, R> = (value: T) => R;

export type OperatorFunction<T, R> = UnaryFunction<
  SignalOrRegularFn<T>,
  Signal<R>
>;

// Drawback: op gets executed once -> need 'defer'
// export const createOperatorFunction =
//   <T, R>(op: UnaryFunction<SignalOrRegularFn<T>, R>) =>
//   (source: SignalOrRegularFn<T>) =>
//     computed(() => op(source));

export type SignalOrRegularFn<T> = Signal<T> | (() => T);

export type SignalOrValue<T> = Signal<T> | T;

export type SignalTuple = readonly Signal<any | null | undefined>[];

export type InferSignalTuple<T extends SignalTuple> = readonly [
  ...{
    [K in keyof T]: T[K] extends Signal<infer V> ? Signal<V> : never;
  }
];

export type InferSignalValueTuple<T extends SignalTuple> = readonly [
  ...{
    [K in keyof T]: T[K] extends Signal<infer V> ? V : never;
  }
];

export type InferSignalValueTupleAsNonNullable<T extends SignalTuple> =
  readonly [
    ...{
      [K in keyof T]: T[K] extends Signal<infer V> ? NonNullable<V> : never;
    }
  ];

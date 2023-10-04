import { Signal } from '@angular/core';
import { OperatorFunction } from './types';

// copy pasta from rxjs
// TODO infer this sh!t with generics...
// Current limitation: pipe is only infered up to 9 operators...
export function pipe<T, A>(
  source: Signal<T>,
  op1: OperatorFunction<T, A>
): Signal<A>;
export function pipe<T, A, B>(
  source: Signal<T>,
  op1: OperatorFunction<T, A>,
  op2: OperatorFunction<A, B>
): Signal<B>;
export function pipe<T, A, B, C>(
  source: Signal<T>,
  op1: OperatorFunction<T, A>,
  op2: OperatorFunction<A, B>,
  op3: OperatorFunction<B, C>
): Signal<C>;
export function pipe<T, A, B, C, D>(
  source: Signal<T>,
  op1: OperatorFunction<T, A>,
  op2: OperatorFunction<A, B>,
  op3: OperatorFunction<B, C>,
  op4: OperatorFunction<C, D>
): Signal<D>;
export function pipe<T, A, B, C, D, E>(
  source: Signal<T>,
  op1: OperatorFunction<T, A>,
  op2: OperatorFunction<A, B>,
  op3: OperatorFunction<B, C>,
  op4: OperatorFunction<C, D>,
  op5: OperatorFunction<D, E>
): Signal<E>;
export function pipe<T, A, B, C, D, E, F>(
  source: Signal<T>,
  op1: OperatorFunction<T, A>,
  op2: OperatorFunction<A, B>,
  op3: OperatorFunction<B, C>,
  op4: OperatorFunction<C, D>,
  op5: OperatorFunction<D, E>,
  op6: OperatorFunction<E, F>
): Signal<F>;
export function pipe<T, A, B, C, D, E, F, G>(
  source: Signal<T>,
  op1: OperatorFunction<T, A>,
  op2: OperatorFunction<A, B>,
  op3: OperatorFunction<B, C>,
  op4: OperatorFunction<C, D>,
  op5: OperatorFunction<D, E>,
  op6: OperatorFunction<E, F>,
  op7: OperatorFunction<F, G>
): Signal<G>;
export function pipe<T, A, B, C, D, E, F, G, H>(
  source: Signal<T>,
  op1: OperatorFunction<T, A>,
  op2: OperatorFunction<A, B>,
  op3: OperatorFunction<B, C>,
  op4: OperatorFunction<C, D>,
  op5: OperatorFunction<D, E>,
  op6: OperatorFunction<E, F>,
  op7: OperatorFunction<F, G>,
  op8: OperatorFunction<G, H>
): Signal<H>;
export function pipe<T, A, B, C, D, E, F, G, H, I>(
  source: Signal<T>,
  op1: OperatorFunction<T, A>,
  op2: OperatorFunction<A, B>,
  op3: OperatorFunction<B, C>,
  op4: OperatorFunction<C, D>,
  op5: OperatorFunction<D, E>,
  op6: OperatorFunction<E, F>,
  op7: OperatorFunction<F, G>,
  op8: OperatorFunction<G, H>,
  op9: OperatorFunction<H, I>
): Signal<I>;
export function pipe<T, A, B, C, D, E, F, G, H, I>(
  source: Signal<T>,
  op1: OperatorFunction<T, A>,
  op2: OperatorFunction<A, B>,
  op3: OperatorFunction<B, C>,
  op4: OperatorFunction<C, D>,
  op5: OperatorFunction<D, E>,
  op6: OperatorFunction<E, F>,
  op7: OperatorFunction<F, G>,
  op8: OperatorFunction<G, H>,
  op9: OperatorFunction<H, I>,
  ...operators: OperatorFunction<any, any>[]
): Signal<any>;
export function pipe<T>(
  source: Signal<T>,
  ...operators: OperatorFunction<any, any>[]
) {
  return operators.reduce(
    (signal: Signal<unknown>, current) => current(signal),
    source
  );
}

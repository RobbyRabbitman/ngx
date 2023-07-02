import { Signal } from '@angular/core';

export type UnaryFunction<T, R> = (source: T) => R;

export type PipeFunction<T, R> = UnaryFunction<Signal<T>, Signal<R>>;

export function pipe<T, A>(
  source: Signal<T>,
  fn1: PipeFunction<T, A>
): Signal<A>;
export function pipe<T, A, B>(
  source: Signal<T>,
  fn1: PipeFunction<T, A>,
  fn2: PipeFunction<A, B>
): Signal<B>;
export function pipe<T, A, B, C>(
  source: Signal<T>,
  fn1: PipeFunction<T, A>,
  fn2: PipeFunction<A, B>,
  fn3: PipeFunction<B, C>
): Signal<C>;
export function pipe<T, A, B, C, D>(
  source: Signal<T>,
  fn1: PipeFunction<T, A>,
  fn2: PipeFunction<A, B>,
  fn3: PipeFunction<B, C>,
  fn4: PipeFunction<C, D>
): Signal<D>;
export function pipe<T, A, B, C, D, E>(
  source: Signal<T>,
  fn1: PipeFunction<T, A>,
  fn2: PipeFunction<A, B>,
  fn3: PipeFunction<B, C>,
  fn4: PipeFunction<C, D>,
  fn5: PipeFunction<D, E>
): Signal<E>;
export function pipe<T, A, B, C, D, E, F>(
  source: Signal<T>,
  fn1: PipeFunction<T, A>,
  fn2: PipeFunction<A, B>,
  fn3: PipeFunction<B, C>,
  fn4: PipeFunction<C, D>,
  fn5: PipeFunction<D, E>,
  fn6: PipeFunction<E, F>
): Signal<F>;
export function pipe<T, A, B, C, D, E, F, G>(
  source: Signal<T>,
  fn1: PipeFunction<T, A>,
  fn2: PipeFunction<A, B>,
  fn3: PipeFunction<B, C>,
  fn4: PipeFunction<C, D>,
  fn5: PipeFunction<D, E>,
  fn6: PipeFunction<E, F>,
  fn7: PipeFunction<F, G>
): Signal<G>;
export function pipe<T, A, B, C, D, E, F, G, H>(
  source: Signal<T>,
  fn1: PipeFunction<T, A>,
  fn2: PipeFunction<A, B>,
  fn3: PipeFunction<B, C>,
  fn4: PipeFunction<C, D>,
  fn5: PipeFunction<D, E>,
  fn6: PipeFunction<E, F>,
  fn7: PipeFunction<F, G>,
  fn8: PipeFunction<G, H>
): Signal<H>;
export function pipe<T, A, B, C, D, E, F, G, H, I>(
  source: Signal<T>,
  fn1: PipeFunction<T, A>,
  fn2: PipeFunction<A, B>,
  fn3: PipeFunction<B, C>,
  fn4: PipeFunction<C, D>,
  fn5: PipeFunction<D, E>,
  fn6: PipeFunction<E, F>,
  fn7: PipeFunction<F, G>,
  fn8: PipeFunction<G, H>,
  fn9: PipeFunction<H, I>
): Signal<I>;
export function pipe<T, A, B, C, D, E, F, G, H, I>(
  source: Signal<T>,
  fn1: PipeFunction<T, A>,
  fn2: PipeFunction<A, B>,
  fn3: PipeFunction<B, C>,
  fn4: PipeFunction<C, D>,
  fn5: PipeFunction<D, E>,
  fn6: PipeFunction<E, F>,
  fn7: PipeFunction<F, G>,
  fn8: PipeFunction<G, H>,
  fn9: PipeFunction<H, I>,
  ...fns: PipeFunction<any, any>[]
): Signal<any>;
export function pipe<T>(signal: Signal<T>, ...fns: PipeFunction<any, any>[]) {
  return fns.reduce((prev: any, fn) => fn(prev), signal);
}

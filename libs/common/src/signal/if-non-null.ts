import { Signal, computed } from '@angular/core';
import { isNonNull } from '../util/is-non-null';
import { EMPTY } from './empty';
import { signalize } from './signalize';

/**
 *
 * @param source
 * @param thenBranch
 * @returns a signal evaluating the then branch if the source is non null, else {@link EMPTY}.
 */
export function ifNonNull<T, R>(
  source: Signal<T>,
  thenBranch: (value: NonNullable<T>) => R | Signal<R>
): Signal<R | undefined>;

/**
 *
 * @param source
 * @param thenBranch
 * @param elseBranch
 * @returns a signal evaluating the then branch if the source is non null, else the else branch.
 */
export function ifNonNull<T, R, F>(
  source: Signal<T>,
  thenBranch: (value: NonNullable<T>) => R | Signal<R>,
  elseBranch: () => F | Signal<F>
): Signal<R | F | undefined>;

/**
 *
 * @param source
 * @param thenBranch
 * @param elseBranch defaults to {@link EMPTY}
 * @returns a signal evaluating the then branch if the source is non null, else the else branch.
 */
export function ifNonNull<T, R, F>(
  source: Signal<T>,
  thenBranch: (value: NonNullable<T>) => R | Signal<R>,
  elseBranch?: () => F | Signal<F>
): Signal<R | F | undefined> {
  return computed(() =>
    isNonNull(source())
      ? signalize(thenBranch(source() as NonNullable<T>))()
      : signalize(elseBranch?.() ?? EMPTY)()
  );
}

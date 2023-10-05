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
export function ifNonNull<S, T>(
  source: Signal<S>,
  thenBranch: (value: NonNullable<S>) => T | Signal<T>
): Signal<T | undefined>;

/**
 *
 * @param source
 * @param thenBranch
 * @param elseBranch
 * @returns a signal evaluating the then branch if the source is non null, else the else branch.
 */
export function ifNonNull<S, T, F>(
  source: Signal<S>,
  thenBranch: (value: NonNullable<S>) => T | Signal<T>,
  elseBranch?: () => F
): Signal<T | F | undefined>;

/**
 *
 * @param source
 * @param thenBranch
 * @param elseBranch defaults to {@link EMPTY}
 * @returns a signal evaluating the then branch if the source is non null, else the else branch.
 */
export function ifNonNull<S, T, F>(
  source: Signal<S>,
  thenBranch: (value: NonNullable<S>) => T | Signal<T>,
  elseBranch?: () => F
): Signal<T | F | undefined> {
  return computed(() =>
    isNonNull(source())
      ? signalize(thenBranch(source() as NonNullable<S>))()
      : signalize(elseBranch?.() ?? EMPTY)()
  );
}

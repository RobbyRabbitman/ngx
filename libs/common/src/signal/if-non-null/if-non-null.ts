import { Signal } from '@angular/core';
import { isNonNull } from '../../util/is-non-null';
import { iif } from '../iif/iif';

/**
 *
 * @param source
 * @param thenBranch
 * @returns a signal evaluating the then branch if the source is non null.
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
  elseBranch?: () => F | Signal<F>
): Signal<T | F | undefined>;

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
  elseBranch?: () => F | Signal<F>
): Signal<T | F | undefined> {
  return iif(
    source,
    isNonNull,
    thenBranch as (value: S) => T | Signal<T>,
    elseBranch
  );
}

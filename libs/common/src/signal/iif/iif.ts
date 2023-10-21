import { Signal, computed } from '@angular/core';
import { EMPTY } from '../util/empty';
import { signalize } from '../util/signalize';

/**
 *
 * @param source
 * @param thenBranch
 * @returns a signal evaluating the then branch if the predicate evaluates truthy, else {@link EMPTY}.
 */
export function iif<S, T>(
  source: Signal<S>,
  predicate: (value: S) => boolean | Signal<boolean>,
  thenBranch: (value: S) => T | Signal<T>
): Signal<T | undefined>;

/**
 *
 * @param source
 * @param thenBranch
 * @param elseBranch
 * @returns a signal evaluating the then branch if the predicate evaluates truthy, else the else branch.
 */
export function iif<S, T, F>(
  source: Signal<S>,
  predicate: (value: S) => boolean | Signal<boolean>,
  thenBranch: (value: S) => T | Signal<T>,
  elseBranch?: (value: S) => F | Signal<F>
): Signal<T | F | undefined>;

/**
 *
 * @param source
 * @param thenBranch
 * @param elseBranch defaults to {@link EMPTY}
 * @returns a signal evaluating the then branch if the predicate evaluates truthy, else the else branch.
 */
export function iif<S, T, F>(
  source: Signal<S>,
  predicate: (value: S) => boolean | Signal<boolean>,
  thenBranch: (value: S) => T | Signal<T>,
  elseBranch?: (Value: S) => F | Signal<F>
): Signal<T | F | undefined> {
  return computed(() =>
    predicate(source())
      ? signalize(thenBranch(source()))()
      : signalize(elseBranch?.(source()) ?? EMPTY)()
  );
}

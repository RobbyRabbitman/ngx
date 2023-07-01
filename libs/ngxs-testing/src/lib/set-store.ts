import { inject } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Store } from '@ngxs/store';
import { throwNgxsTestingError } from './ngxs-testing-errors';

/**
 * Sets the value of the {@link Store} to the specified state by calling {@link Store.reset}.
 * It will not be merged into the current value.
 *
 * Expects {@link Store} to be provided in the {@link TestBed}.
 *
 * It also tracks the calls to itself and stores the values as snapshots.
 * Those snapshots can be popped in order to restore the value of the {@link Store} to a previous state.
 *
 * @param state
 */
export const setStore = (() => {
  let index = -1;

  let snapshots = [] as unknown[];

  const injectStore = () => TestBed.inject(Store, undefined) ?? inject(Store);

  const fn = <T>(state: T) => {
    const store = injectStore();

    const cloned = structuredClone(state);

    store.reset(cloned);

    snapshots[++index] = cloned;

    return store.snapshot() as T;
  };

  /**
   *
   * @returns the index of the latest snapshot (0 based indexed), -1 if there are no snapshots.
   */
  fn.snapshotIndex = () => index;

  /**
   * Pops the latest snapshot and sets the value of the {@link Store} to it.
   */
  fn.pop = () =>
    index < 0
      ? throwNgxsTestingError(
          'Tried to pop a snapshot but there are no snapshots'
        )
      : injectStore().reset(snapshots[--index]);

  /**
   * Resets the value of the {@link Store} to undefined and deletes any snapshots.
   */
  fn.reset = () => {
    index = -1;

    snapshots = [];

    injectStore().reset(undefined);
  };

  return fn;
})();

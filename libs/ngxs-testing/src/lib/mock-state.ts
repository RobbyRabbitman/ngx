import { TestBed } from '@angular/core/testing';
import { Store } from '@ngxs/store';

/**
 * Sets the state by calling {@link Store.reset}.
 *
 * Expects {@link Store} to be provided in the {@link TestBed}.
 *
 * @param state
 */
export const setState = <T>(state: Partial<T>) =>
  TestBed.inject(Store).reset(structuredClone(state));

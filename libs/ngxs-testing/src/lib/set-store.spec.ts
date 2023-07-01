import { TestBed } from '@angular/core/testing';
import { Store } from '@ngxs/store';
import { buildNgxsTestingMessage } from './ngxs-testing-errors';
import { provideNgxsTesting } from './providers';
import { setStore } from './set-store';

describe('mockState', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: provideNgxsTesting(),
    }).compileComponents()
  );

  it('should mock the state', () => {
    const state = { foo: 42 };

    expect(setStore(state)).toEqual(state);

    expect(TestBed.inject(Store).snapshot()).toEqual(state);

    const otherState = { foo: 42 };

    expect(setStore(otherState)).toEqual(otherState);

    expect(TestBed.inject(Store).snapshot()).toEqual(otherState);
  });

  it('should throw an error when trying to pop a snapshot of an empty history', () => {
    setStore.reset();

    expect(TestBed.inject(Store).snapshot()).toBeUndefined();

    expect(setStore.snapshotIndex()).toEqual(-1);

    expect(() => setStore.pop()).toThrowError(
      buildNgxsTestingMessage(
        'Tried to pop a snapshot but there are no snapshots'
      )
    );

    expect(setStore.snapshotIndex()).toEqual(-1);

    const state = { foo: 42 };

    const otherState = { foo: 42 };

    setStore(state);

    expect(setStore.snapshotIndex()).toEqual(0);

    setStore(otherState);

    expect(setStore.snapshotIndex()).toEqual(1);

    expect(TestBed.inject(Store).snapshot()).toEqual(otherState);

    expect(() => setStore.pop()).not.toThrow();

    expect(setStore.snapshotIndex()).toEqual(0);

    expect(TestBed.inject(Store).snapshot()).toEqual(state);

    expect(() => setStore.pop()).not.toThrow();

    expect(setStore.snapshotIndex()).toEqual(-1);

    expect(() => setStore.pop()).toThrowError(
      buildNgxsTestingMessage(
        'Tried to pop a snapshot but there are no snapshots'
      )
    );

    expect(setStore.snapshotIndex()).toEqual(-1);
  });
});

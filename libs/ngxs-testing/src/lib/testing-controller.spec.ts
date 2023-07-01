import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { State, StateToken, Store, createSelector } from '@ngxs/store';
import { provideNgxsTesting } from './providers';
import { mockSelector } from './testing-controller';

describe('mockSelector with an MockStore provided', () => {
  describe("when mocking 'createSelector' selectors", () => {
    describe('without state', () => {
      const fooSelector = () => createSelector(undefined, () => 42);

      const fooX2Selector = () =>
        createSelector([fooSelector()], (foo) => foo * 2);

      beforeEach(() =>
        TestBed.configureTestingModule({
          providers: provideNgxsTesting(),
        })
      );

      it('should be mockable', () => {
        expect(() => mockSelector(fooSelector())).not.toThrow();

        const a = mockSelector(fooSelector());

        const b = mockSelector(fooSelector());

        expect(a).toBe(b);

        const c = mockSelector(fooSelector());

        const d = mockSelector(fooX2Selector());

        expect(c).not.toBe(d);
      });

      it('should return the original selectors value as long as the mockselectors value was not set', () => {
        expect(TestBed.inject(Store).selectSnapshot(fooSelector())).toEqual(42);

        expect(TestBed.inject(Store).selectSnapshot(fooX2Selector())).toEqual(
          84
        );

        mockSelector(fooSelector()).set(9);

        expect(TestBed.inject(Store).selectSnapshot(fooSelector())).toEqual(9);

        expect(
          TestBed.inject(Store).selectSnapshot(fooX2Selector())
        ).not.toEqual(18);

        expect(TestBed.inject(Store).selectSnapshot(fooX2Selector())).toEqual(
          84
        );
      });
    });

    describe('with state', () => {
      @State({ name: 'someState', defaults: { foo: 42 } })
      @Injectable()
      class SomeState {}

      const fooSelector = () =>
        createSelector([SomeState], (state) => state.foo);

      const fooX2Selector = () =>
        createSelector([fooSelector()], (foo) => foo * 2);

      beforeEach(() =>
        TestBed.configureTestingModule({
          providers: provideNgxsTesting([SomeState]),
        })
      );

      it('should be mockable', () => {
        expect(() => mockSelector(fooSelector())).not.toThrow();

        const a = mockSelector(fooSelector());

        const b = mockSelector(fooSelector());

        expect(a).toBe(b);

        const c = mockSelector(fooSelector());

        const d = mockSelector(fooX2Selector());

        expect(c).not.toBe(d);
      });

      it('should return the original selectors value as long as the mockselectors value was not set', () => {
        expect(TestBed.inject(Store).selectSnapshot(fooSelector())).toEqual(42);

        expect(TestBed.inject(Store).selectSnapshot(fooX2Selector())).toEqual(
          84
        );

        TestBed.inject(Store).reset({ someState: { foo: 15 } });

        expect(TestBed.inject(Store).selectSnapshot(fooSelector())).toEqual(15);

        expect(TestBed.inject(Store).selectSnapshot(fooX2Selector())).toEqual(
          30
        );

        mockSelector(fooSelector()).set(9);

        expect(TestBed.inject(Store).selectSnapshot(fooSelector())).toEqual(9);

        expect(
          TestBed.inject(Store).selectSnapshot(fooX2Selector())
        ).not.toEqual(18);

        expect(TestBed.inject(Store).selectSnapshot(fooX2Selector())).toEqual(
          30
        );

        TestBed.inject(Store).reset({ someState: { foo: 40 } });

        expect(TestBed.inject(Store).selectSnapshot(fooSelector())).toEqual(9);

        expect(TestBed.inject(Store).selectSnapshot(fooX2Selector())).toEqual(
          80
        );
      });
    });
  });

  describe("when mocking 'StateToken' selectors", () => {
    describe('without state', () => {
      let someStateToken: StateToken<unknown>;

      let someOtherStateToken: StateToken<unknown>;

      beforeEach(() => {
        someStateToken = new StateToken<unknown>('someState');

        someOtherStateToken = new StateToken<unknown>('someOtherState');

        TestBed.configureTestingModule({
          providers: provideNgxsTesting(),
        });
      });

      it('should be mockable', () => {
        expect(() => mockSelector(someStateToken)).not.toThrow();

        const a = mockSelector(someStateToken);

        const b = mockSelector(someStateToken);

        expect(a).toBe(b);

        const c = mockSelector(someStateToken);

        const d = mockSelector(someOtherStateToken);

        expect(c).not.toBe(d);
      });

      it('should return the original selectors value as long as the mockselectors value was not set', () => {
        expect(
          TestBed.inject(Store).selectSnapshot(someStateToken)
        ).toBeUndefined();

        mockSelector(someStateToken).set('someMockValue');

        expect(TestBed.inject(Store).selectSnapshot(someStateToken)).toEqual(
          'someMockValue'
        );
      });
    });
  });
});

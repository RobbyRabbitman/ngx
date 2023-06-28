import { TestBed } from '@angular/core/testing';
import { StateToken, Store, createSelector } from '@ngxs/store';
import { provideNgxsTesting } from '../lib/providers';
import { mockSelector } from '../lib/testing-controller';

describe('mockSelector', () => {
  describe("when mocking 'createSelector' selectors", () => {
    describe('with no states', () => {
      const someSelector = createSelector(undefined, () => 'someValue');

      const someOtherSelector = createSelector(
        undefined,
        () => 'someOtherValue'
      );

      beforeEach(
        async () =>
          await TestBed.configureTestingModule({
            providers: provideNgxsTesting(),
          }).compileComponents()
      );

      it('should be mockable', () => {
        expect(() => mockSelector(someSelector)).not.toThrow();

        const a = mockSelector(someSelector);

        const b = mockSelector(someSelector);

        expect(a).toBe(b);

        const c = mockSelector(someSelector);

        const d = mockSelector(someOtherSelector);

        expect(c).not.toBe(d);
      });

      it('should return the original selectors value as long as the mockselectors value was not set', () => {
        expect(TestBed.inject(Store).selectSnapshot(someSelector)).toEqual(
          'someValue'
        );

        mockSelector(someSelector).set('someMockValue');

        expect(TestBed.inject(Store).selectSnapshot(someSelector)).toEqual(
          'someMockValue'
        );
      });
    });
  });

  describe("when mocking 'StateToken' selectors", () => {
    describe('with no states', () => {
      let someStateToken: StateToken<unknown>;

      let someOtherStateToken: StateToken<unknown>;

      beforeEach(() => {
        someStateToken = new StateToken<unknown>('someState');

        someOtherStateToken = new StateToken<unknown>('someOtherState');

        return TestBed.configureTestingModule({
          providers: provideNgxsTesting(),
        }).compileComponents();
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

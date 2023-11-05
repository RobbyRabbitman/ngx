import { NgFor } from '@angular/common';
import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';
import { ForIn } from './for-in';

describe('ForInDirective', () => {
  beforeEach(() => MockBuilder(ForIn).keep(NgFor));

  it('should create an instance', () =>
    expect(MockRender(`<ng-template ngxFor></ng-template>`)).toBeTruthy());

  it('should iterate over objects', () => {
    const params = { iterable: { foo: true, bar: true } };

    const fixture = MockRender(
      `<ng-container *ngxFor="let key in iterable">{{ key }} </ng-container>`,
      params
    );

    fixture.detectChanges();

    expect(ngMocks.formatText(fixture)).toContain('foo bar');
  });

  it('should iterate over maps', () => {
    const params = {
      iterable: new Map([
        ['foo', true],
        ['bar', true],
      ]),
    };

    const fixture = MockRender(
      `<ng-container *ngxFor="let key in iterable">{{ key }} </ng-container>`,
      params
    );

    fixture.detectChanges();

    expect(ngMocks.formatText(fixture)).toEqual('foo bar');
  });

  it('should iterate over strings', () => {
    const params = {
      iterable: 'foo',
    };

    const fixture = MockRender(
      `<ng-container *ngxFor="let key in iterable">{{ key }} </ng-container>`,
      params
    );

    fixture.detectChanges();

    expect(ngMocks.formatText(fixture)).toEqual('0 1 2');
  });

  it('should be nullish friendly (like ngFor)', () => {
    const params = {
      iterable: null as null | undefined,
    };

    const fixture = MockRender(
      `<ng-container *ngxFor="let key in iterable">{{ key }} </ng-container>`,
      params
    );

    fixture.detectChanges();

    expect(ngMocks.formatText(fixture)).toEqual('');

    params.iterable = undefined;
    fixture.detectChanges();

    expect(ngMocks.formatText(fixture)).toEqual('');
  });

  it('should not iterate over anything else', () => {
    const params = {
      iterable: 42,
    };

    expect(() =>
      MockRender(
        `<ng-container *ngxFor="let key in iterable">{{ key }} </ng-container>`,
        params
      )
    ).toThrowError("NGX Common: Can't iterate over 42");
  });

  describe('should have a context indicating', () => {
    it('the index of the current item in the iterable', () =>
      expect(
        ngMocks.formatText(
          MockRender(
            `<ng-container *ngxFor="let key in iterable; let index = index">{{ index }} </ng-container>`,
            { iterable: { foo: 42, bar: 99, baz: -1 } }
          )
        )
      ).toBe('0 1 2'));

    it('the length of the iterable', () =>
      expect(
        ngMocks.formatText(
          MockRender(
            `<ng-container *ngxFor="let key in iterable; let count = count">{{ count }} </ng-container>`,
            { iterable: { foo: 42, bar: 99, baz: -1 } }
          )
        )
      ).toBe('3 3 3'));

    it('whether the item is the first item in the iterable', () =>
      expect(
        ngMocks.formatText(
          MockRender(
            `<ng-container *ngxFor="let key in iterable; let first = first">{{ first }} </ng-container>`,
            { iterable: { foo: 42, bar: 99, baz: -1 } }
          )
        )
      ).toBe('true false false'));

    it('whether the item is the last item in the iterable', () =>
      expect(
        ngMocks.formatText(
          MockRender(
            `<ng-container *ngxFor="let key in iterable; let last = last">{{ last }} </ng-container>`,
            { iterable: { foo: 42, bar: 99, baz: -1 } }
          )
        )
      ).toBe('false false true'));

    it('whether the item has an even index in the iterable.', () =>
      expect(
        ngMocks.formatText(
          MockRender(
            `<ng-container *ngxFor="let key in iterable; let even = even">{{ even }} </ng-container>`,
            { iterable: { foo: 42, bar: 99, baz: -1 } }
          )
        )
      ).toBe('true false true'));

    it('whether the item has an odd index in the iterable.', () =>
      expect(
        ngMocks.formatText(
          MockRender(
            `<ng-container *ngxFor="let key in iterable; let odd = odd">{{ odd }} </ng-container>`,
            { iterable: { foo: 42, bar: 99, baz: -1 } }
          )
        )
      ).toBe('false true false'));
  });
});

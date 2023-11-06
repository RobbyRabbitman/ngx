import { NgFor } from '@angular/common';
import { TrackByFunction } from '@angular/core';
import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';
import { ForIn } from './for-in';

describe('ForInDirective', () => {
  beforeEach(() => MockBuilder(ForIn).keep(NgFor));

  it('should create an instance', () =>
    expect(MockRender(`<ng-template ngxFor></ng-template>`)).toBeTruthy());

  describe('should iterate over', () => {
    it('objects', () => {
      const params = {
        iterable: { foo: true, bar: true } as Record<string, unknown>,
      };

      const fixture = MockRender(
        `<ng-container *ngxFor="let key in iterable">{{ key }} </ng-container>`,
        params
      );

      expect(ngMocks.formatText(fixture)).toEqual('foo bar');

      params.iterable = { ...params.iterable, baz: true };

      fixture.detectChanges();

      expect(ngMocks.formatText(fixture)).toEqual('foo bar baz');
    });

    it('maps', () => {
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

      params.iterable = new Map(params.iterable).set('baz', true);

      fixture.detectChanges();

      expect(ngMocks.formatText(fixture)).toEqual('foo bar baz');
    });

    it('sets', () => {
      const params = {
        iterable: new Set(['foo', 'bar']),
      };

      const fixture = MockRender(
        `<ng-container *ngxFor="let key in iterable">{{ key }} </ng-container>`,
        params
      );

      expect(ngMocks.formatText(fixture)).toEqual('foo bar');

      params.iterable = new Set(params.iterable).add('baz');

      fixture.detectChanges();

      expect(ngMocks.formatText(fixture)).toEqual('foo bar baz');
    });

    it('strings', () => {
      const params = {
        iterable: 'foo',
      };

      const fixture = MockRender(
        `<ng-container *ngxFor="let key in iterable">{{ key }} </ng-container>`,
        params
      );

      expect(ngMocks.formatText(fixture)).toEqual('0 1 2');

      params.iterable = 'baz42';

      fixture.detectChanges();

      expect(ngMocks.formatText(fixture)).toEqual('0 1 2 3 4');
    });

    it('nullish values', () => {
      const params = {
        iterable: null as null | undefined,
      };

      const fixture = MockRender(
        `<ng-container *ngxFor="let key in iterable">{{ key }} </ng-container>`,
        params
      );

      expect(ngMocks.formatText(fixture)).toEqual('');

      params.iterable = undefined;

      fixture.detectChanges();

      expect(ngMocks.formatText(fixture)).toEqual('');
    });

    it('nothing else', () => {
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

    it('the for in iterable', () =>
      expect(
        ngMocks.formatText(
          MockRender(
            `<ng-container *ngxFor="let key in iterable; let ngxForIn = ngxForIn">{{ ngxForIn }} </ng-container>`,
            { iterable: 'foo' }
          )
        )
      ).toBe('foo foo foo'));

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

  describe('track by', () => {
    it('with objects as keys of a map', () => {
      const params = {
        iterable: new Map([
          [{ id: 'foo' }, 42],
          [{ id: 'bar' }, 99],
        ]),
        trackBy: ((index, item) => item.id) as TrackByFunction<{ id: number }>,
      };

      const fixture = MockRender(
        `<ng-container *ngxFor="let key in iterable; trackBy: trackBy"><span [id]="key.id">{{key.id}} </span></ng-container>`,
        params
      );

      expect(ngMocks.formatText(fixture)).toEqual('foo bar');
      const fooBeforeCd = ngMocks.find('#foo');

      params.iterable = new Map([
        [{ id: 'foo' }, 42],
        [{ id: 'bar' }, 99],
        [{ id: 'baz' }, 1],
      ]);

      fixture.detectChanges();

      const fooAfterCd = ngMocks.find('#foo');

      expect(ngMocks.formatText(fixture)).toEqual('foo bar baz');
      expect(fooBeforeCd.nativeElement).toBe(fooAfterCd.nativeElement);

      const elementsBeforeCd = ngMocks.findAll('span');

      params.iterable = new Map([
        [{ id: 'foo' }, 42],
        [{ id: 'bar' }, 99],
        [{ id: 'baz' }, 1],
      ]);

      fixture.detectChanges();

      const elementsAfterCd = ngMocks.findAll('span');

      expect(ngMocks.formatText(fixture)).toEqual('foo bar baz');

      for (let index = 0; index < elementsBeforeCd.length; index++)
        expect(elementsBeforeCd[index]).toBe(elementsAfterCd[index]);
    });
  });

  it('should have a context guard', () => {
    expect(
      ForIn.ngTemplateContextGuard(
        MockRender(`<ng-template ngxForIn></ng-template>`).point
          .componentInstance as unknown as ForIn<unknown>,
        {}
      )
    ).toBe(true);
  });
});

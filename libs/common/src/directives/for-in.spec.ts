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
});

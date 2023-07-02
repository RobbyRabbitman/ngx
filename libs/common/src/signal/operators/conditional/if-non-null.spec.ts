import { signal } from '@angular/core';
import { pipe } from '../pipe';
import { ifNonNull } from './if-non-null';

describe('ifNonNull', () => {
  it('should execute the callback whenever a non nullish value was emitted', () => {
    const source = signal<number | undefined | null>(undefined);

    const double = (x: number) => x * 2;

    const doubled = ifNonNull(double)(source);

    expect(doubled()).toBeUndefined();

    source.set(2);

    expect(doubled()).toBe(4);

    source.set(10);

    expect(doubled()).toBe(20);

    source.set(null);

    expect(doubled()).toBeUndefined();

    source.set(undefined);

    expect(doubled()).toBeUndefined();
  });

  it('should not execute the callback on init when source is nullish', () => {
    const source = signal<number | undefined>(undefined);

    const fn = jest.fn();

    const value = ifNonNull(fn)(source);

    expect(fn).toHaveBeenCalledTimes(0);

    value();
    value();
    value();

    expect(fn).toHaveBeenCalledTimes(0);

    source.set(1);
    source.set(2);
    source.set(3);
    value();

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should be integratable in a pipe', () => {
    const source = signal<number | undefined | null>(undefined);

    const double = jest.fn().mockImplementation((x) => x * 2);

    const doubled = pipe(source, ifNonNull(double));

    expect(doubled()).toBeUndefined();

    source.set(2);

    expect(doubled()).toBe(4);

    source.set(10);

    expect(doubled()).toBe(20);

    source.set(null);

    expect(doubled()).toBeUndefined();

    source.set(undefined);

    expect(doubled()).toBeUndefined();
  });
});

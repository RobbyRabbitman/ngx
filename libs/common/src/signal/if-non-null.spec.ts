import { signal } from '@angular/core';
import { ifNonNull } from './if-non-null';
import { pipe } from './pipe';

describe('ifNonNull', () => {
  it('should execute the callback whenever a non nullish value was emitted', () => {
    const source = signal<number | undefined | null>(undefined);

    const double = jest.fn().mockImplementation((x) => x * 2);

    const value = ifNonNull(double)(source);

    expect(double).toHaveBeenCalledTimes(0);

    expect(value()).toBeUndefined();

    expect(double).toHaveBeenCalledTimes(0);

    source.set(2);

    expect(double).toHaveBeenCalledTimes(0);
    expect(value()).toBe(4);
    expect(double).toHaveBeenCalledTimes(1);
    value(); // should not trigger double again
    expect(double).toHaveBeenCalledTimes(1);

    source.set(10);

    expect(value()).toBe(20);
    expect(double).toHaveBeenCalledTimes(2);

    source.set(null);

    expect(value()).toBeUndefined();
    expect(double).toHaveBeenCalledTimes(2);

    source.set(undefined);

    expect(value()).toBeUndefined();
    expect(double).toHaveBeenCalledTimes(2);
  });

  it('should be integratable in a pipe', () => {
    const source = signal<number | undefined | null>(undefined);

    const double = jest.fn().mockImplementation((x) => x * 2);

    const value = pipe(source, ifNonNull(double));

    expect(double).toHaveBeenCalledTimes(0);

    expect(value()).toBeUndefined();

    expect(double).toHaveBeenCalledTimes(0);

    source.set(2);

    expect(double).toHaveBeenCalledTimes(0);
    expect(value()).toBe(4);
    expect(double).toHaveBeenCalledTimes(1);
    value(); // should not trigger double again
    expect(double).toHaveBeenCalledTimes(1);

    source.set(10);

    expect(value()).toBe(20);
    expect(double).toHaveBeenCalledTimes(2);

    source.set(null);

    expect(value()).toBeUndefined();
    expect(double).toHaveBeenCalledTimes(2);

    source.set(undefined);

    expect(value()).toBeUndefined();
    expect(double).toHaveBeenCalledTimes(2);
  });
});

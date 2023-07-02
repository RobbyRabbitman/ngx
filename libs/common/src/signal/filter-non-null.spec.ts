import { signal } from '@angular/core';
import { filterNonNull } from './filter-non-null';

describe('filterNonNull', () => {
  it('should execute the callback whenever a non nullish value was emitted', () => {
    const source = signal<number | undefined | null>(undefined);

    const source2 = signal(true);

    const double = jest.fn().mockImplementation((x) => x * 2);

    const value = filterNonNull(double, source, source2);

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

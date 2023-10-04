import { signal } from '@angular/core';
import { ifNonNull } from './if-non-null';

describe('ifNonNull', () => {
  it('should execute the callback whenever a non nullish value was emitted', () => {
    const source = signal<number | undefined | null>(undefined);

    const doubled = ifNonNull(source, (x) => x * 2);

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

    const value = ifNonNull(source, fn);

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

  it('should accept a signal', () => {
    const source = signal<number | undefined>(undefined);

    const otherSource = signal('foo');

    const value = ifNonNull(source, otherSource);

    expect(value()).toBeUndefined();

    source.set(42);

    expect(value()).toBe('foo');

    otherSource.set('bar');

    expect(value()).toBe('bar');
  });
});

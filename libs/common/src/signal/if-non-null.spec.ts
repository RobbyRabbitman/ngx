import { signal } from '@angular/core';
import { ifNonNull } from './if-non-null';
import { pipe } from './pipe';

describe('ifNonNull', () => {
  it('should execute the callback whenever a non nullish value was emitted', () => {
    const source = signal<number | undefined | null>(undefined);

    const double = jest.fn().mockImplementation((x) => x * 2);

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

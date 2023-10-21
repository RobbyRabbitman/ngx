import { signal } from '@angular/core/';
import { ifNonNull } from './if-non-null';

describe('ifNonNull', () => {
  it('should execute the callback whenever a non nullish value was emitted', () => {
    const source$ = signal<number | undefined | null>(undefined);

    const doubled = ifNonNull(source$, (x) => x * 2);
    expect(doubled()).toBeUndefined();

    source$.set(2);
    expect(doubled()).toBe(4);

    source$.set(10);
    expect(doubled()).toBe(20);

    source$.set(null);
    expect(doubled()).toBeUndefined();

    source$.set(undefined);
    expect(doubled()).toBeUndefined();
  });

  it('should not execute the callback on init when source is nullish', () => {
    const source = signal<number | undefined>(undefined);

    const fn = jest.fn();

    const value = ifNonNull(source, fn);
    expect(fn).toHaveBeenCalledTimes(0);

    value();
    expect(fn).toHaveBeenCalledTimes(0);

    source.set(42);
    value();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should accept signals', () => {
    const source$ = signal<number | undefined>(0);

    const thenBranch$ = signal('thenBranch');
    const elseBranch$ = signal('elseBranch');

    const computed$ = ifNonNull(source$, thenBranch$, elseBranch$);

    expect(computed$()).toBe('thenBranch');

    thenBranch$.set('changed thenBranch');
    expect(computed$()).toBe('changed thenBranch');

    source$.set(undefined);
    expect(computed$()).toBe('elseBranch');

    elseBranch$.set('changed elseBranch');
    expect(computed$()).toBe('changed elseBranch');

    thenBranch$.set('changed thenBranch again');
    expect(computed$()).toBe('changed elseBranch');

    source$.set(0);
    expect(computed$()).toBe('changed thenBranch again');
  });

  it('should accept functions that return signals', () => {
    const source$ = signal<number | undefined>(undefined);

    const s1 = signal('s1');
    const s2 = signal('s2');

    const factory = (x: number) => (x >= 0 ? s1 : s2);

    const computed$ = ifNonNull(source$, factory);
    expect(computed$()).toBe(undefined);

    source$.set(0);
    expect(computed$()).toBe('s1');

    s1.set('changed s1');
    expect(computed$()).toBe('changed s1');

    source$.set(-1);
    expect(computed$()).toBe('s2');

    s2.set('changed s2');
    expect(computed$()).toBe('changed s2');

    s1.set('changed s1 again');
    expect(computed$()).toBe('changed s2');

    source$.set(0);
    expect(computed$()).toBe('changed s1 again');

    source$.set(undefined);
    expect(computed$()).toBe(undefined);
  });
});

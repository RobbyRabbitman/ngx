import { signal } from '@angular/core/';
import { iif } from './iif';

describe('iif', () => {
  it('should execute the then branch when the predicate evaluates truthy, else the else branch', () => {
    const source$ = signal<number>(0);

    const thenBranch = jest.fn();
    const elseBranch = jest.fn();

    const computed$ = iif(source$, (x) => x >= 0, thenBranch, elseBranch);

    computed$();
    expect(elseBranch).toHaveBeenCalledTimes(0);
    expect(thenBranch).toHaveBeenCalledTimes(1);
    expect(thenBranch).toHaveBeenNthCalledWith(1, 0);

    source$.set(42);
    computed$();
    expect(elseBranch).toHaveBeenCalledTimes(0);
    expect(thenBranch).toHaveBeenCalledTimes(2);
    expect(thenBranch).toHaveBeenNthCalledWith(2, 42);

    source$.set(-1);
    computed$();
    expect(elseBranch).toHaveBeenNthCalledWith(1, -1);
    expect(thenBranch).toHaveBeenCalledTimes(2);
  });

  it('should have an optional else branch', () => {
    const source$ = signal<number>(0);

    const thenBranch = jest.fn();

    const computed$ = iif(source$, (x) => x >= 0, thenBranch);

    computed$();
    expect(thenBranch).toHaveBeenCalled();

    source$.set(-1);
    expect(computed$()).toBe(undefined);
  });

  it('should accept signals', () => {
    const source$ = signal<number>(0);

    const s1 = signal('s1');
    const s2 = signal('s2');

    const computed$ = iif(source$, (x) => x >= 0, s1, s2);

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
  });

  it('should accept functions that return signals', () => {
    const source$ = signal<number | undefined>(undefined);

    const t1 = signal('t1');
    const t2 = signal('t2');
    const e = signal('e');

    const thenFactory = (x: number | undefined) =>
      x != null && x >= 0 ? t1 : t2;
    const elseFactory = () => e;

    const computed$ = iif(source$, (x) => x != null, thenFactory, elseFactory);
    expect(computed$()).toBe('e');

    e.set('changed e');

    expect(computed$()).toBe('changed e');

    source$.set(42);
    expect(computed$()).toBe('t1');

    t1.set('changed t1');
    expect(computed$()).toBe('changed t1');

    source$.set(-1);
    expect(computed$()).toBe('t2');

    t2.set('changed t2');
    expect(computed$()).toBe('changed t2');

    t1.set('changed t1 again');
    expect(computed$()).toBe('changed t2');

    source$.set(0);
    expect(computed$()).toBe('changed t1 again');
  });
});

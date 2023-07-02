import { signal } from '@angular/core';
import { pipe } from '../pipe';
import { iif } from './iif';

describe('iif', () => {
  it('should switch branches', () => {
    const source = signal(true);
    const truthyBranch = signal('t1');
    const falsyBranch = signal('f1');

    const value = iif(truthyBranch, falsyBranch)(source);

    expect(value()).toBe('t1');

    source.set(false);

    expect(value()).toBe('f1');

    falsyBranch.set('f2');

    expect(value()).toBe('f2');

    source.set(true);

    expect(value()).toBe('t1');

    truthyBranch.set('t2');

    expect(value()).toBe('t2');
  });

  it('should be integratable in a pipe', () => {
    const source = signal(true);
    const truthyBranch = signal('t1');
    const falsyBranch = signal('f1');

    const value = pipe(source, iif(truthyBranch, falsyBranch));

    expect(value()).toBe('t1');

    source.set(false);

    expect(value()).toBe('f1');

    falsyBranch.set('f2');

    expect(value()).toBe('f2');

    source.set(true);

    expect(value()).toBe('t1');

    truthyBranch.set('t2');

    expect(value()).toBe('t2');
  });
});

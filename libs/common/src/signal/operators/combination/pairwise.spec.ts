import { signal } from '@angular/core';
import { pairwise } from './pairwise';

describe('pairwise', () => {
  it('should return a pair', () =>
    expect(pairwise()(signal(1))()).toHaveLength(2));

  it('should return undefined and the value of its signal as a pair when executed', () =>
    expect(pairwise()(signal(1))()).toEqual([undefined, 1]));

  it('should return an initial value and the value of its signal as a pair when executed', () =>
    expect(pairwise(0)(signal(1))()).toEqual([0, 1]));

  it('should return the previous and current value as a pair', () => {
    const source = signal(1);

    const pair = pairwise(0)(source);

    expect(pair()).toEqual([0, 1]);

    source.set(42);

    expect(pair()).toEqual([1, 42]);

    source.set(-99);

    expect(pair()).toEqual([42, -99]);
  });
});

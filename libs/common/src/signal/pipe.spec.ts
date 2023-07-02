import { signal } from '@angular/core';
import { map } from './map';
import { pipe } from './pipe';

describe('pipe', () => {
  it('', () => {
    const source = signal(2);

    const doubledAndNegated = pipe(
      source,
      map((x) => x * 2),
      map((x) => x * -1)
    );

    expect(doubledAndNegated()).toBe(-4);

    source.set(10);

    expect(doubledAndNegated()).toBe(-20);
  });
});

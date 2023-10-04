import { signal } from '@angular/core';
import { iif } from './conditional/iif';
import { pipe } from './pipe';
import { map } from './transforming/map';

describe('pipe', () => {
  it('should chain operators', () => {
    const source = signal(42);

    const value = pipe(
      source,
      map((x) => x > 0),
      iif(
        () => 'positive',
        () => 'non-positive'
      ),
      map((x) => x.toUpperCase())
    );

    expect(value()).toBe('POSITIVE');

    source.set(1);

    expect(value()).toBe('POSITIVE');

    source.set(0);

    expect(value()).toBe('NON-POSITIVE');
  });
});

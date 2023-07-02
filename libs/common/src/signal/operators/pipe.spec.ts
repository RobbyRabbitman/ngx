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
      )
    );

    expect(value()).toBe('positive');

    source.set(1);

    expect(value()).toBe('positive');

    source.set(0);

    expect(value()).toBe('non-positive');
  });
});

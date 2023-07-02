import { signal } from '@angular/core';
import { iif } from './iif';
import { map } from './map';
import { pipe } from './pipe';

describe('pipe', () => {
  it('should chain operators', () => {
    const source = signal(20);

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

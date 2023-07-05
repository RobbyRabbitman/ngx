import { signal } from '@angular/core';
import { mapTo } from './map-to';

describe('mapTo', () => {
  it('should map to a value', () => {
    const source = signal(42);

    const mapped = mapTo('foo')(source);

    expect(mapped()).toBe('foo');

    source.set(1);

    expect(mapped()).toBe('foo');
  });
});

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

  it('should map to a signal', () => {
    const source = signal(42);

    const value = signal('foo');

    const mapped = mapTo(value)(source);

    expect(mapped()).toBe('foo');

    source.set(1);

    expect(mapped()).toBe('foo');

    value.set('bar');

    expect(mapped()).toBe('bar');

    source.set(123);

    expect(mapped()).toBe('bar');
  });
});

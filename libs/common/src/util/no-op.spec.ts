import { noop } from './no-op';

describe('noop', () => {
  it('should always return undefined', () => {
    expect(noop()).toBe(undefined);

    expect(noop(1, 2, 3)).toBe(undefined);

    expect(noop([], null)).toBe(undefined);

    expect(noop({ foo: 42 })).toBe(undefined);
  });
});

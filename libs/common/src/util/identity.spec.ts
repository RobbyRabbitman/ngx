import { identity } from './identity';

describe('identity', () => {
  it('should project any value', () => {
    const value = Symbol();
    expect(identity(value)).toBe(value);
  });
});

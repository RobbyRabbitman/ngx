import { isNonNull } from './is-non-null';

describe('isNonNull', () => {
  it('should return false for null', () =>
    expect(isNonNull(null)).toEqual(false));

  it('should return false for undefined', () =>
    expect(isNonNull(undefined)).toEqual(false));

  it('should return true for any value besides null and undefined', () => {
    // number
    expect(isNonNull(-1)).toEqual(true);
    expect(isNonNull(0)).toEqual(true);
    expect(isNonNull(-0)).toEqual(true);
    expect(isNonNull(1)).toEqual(true);

    // bigint
    expect(isNonNull(-1n)).toEqual(true);
    expect(isNonNull(0n)).toEqual(true);
    expect(isNonNull(-0n)).toEqual(true);
    expect(isNonNull(1n)).toEqual(true);

    // string
    expect(isNonNull('')).toEqual(true);
    expect(isNonNull(' ')).toEqual(true);

    // boolean
    expect(isNonNull(true)).toEqual(true);
    expect(isNonNull(false)).toEqual(true);

    // symbol
    expect(isNonNull(Symbol())).toEqual(true);

    // object
    expect(isNonNull({})).toEqual(true);
  });
});

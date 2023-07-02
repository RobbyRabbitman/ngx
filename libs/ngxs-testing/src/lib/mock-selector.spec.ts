import { MockSelector } from './mock-selector';

describe('MockSelector', () => {
  it('should have a value of undefined when a value was not set', () =>
    expect(new MockSelector().value()).toBeUndefined());

  it('should indicate if a value was set', () => {
    const mockA = new MockSelector();

    expect(mockA.isSet()).toBe(false);

    mockA.set(undefined);

    expect(mockA.isSet()).toBe(true);

    const mockB = new MockSelector();

    expect(mockB.isSet()).toBe(false);

    mockB.set(null);

    expect(mockB.isSet()).toBe(true);

    const mockC = new MockSelector();

    expect(mockC.isSet()).toBe(false);

    mockC.set(42);

    expect(mockC.isSet()).toBe(true);
  });

  it('should return the value which was set', () => {
    const mock = new MockSelector();

    const x = Symbol();

    mock.set(x);

    expect(mock.value()).toBe(x);

    const y = Symbol();

    mock.set(y);

    expect(mock.value()).toBe(y);

    expect(x).not.toBe(y);
  });
});

import { WritableSignal } from '@angular/core';
import { EMPTY } from './empty';

describe('EMPTY', () => {
  it('should be undefined', () => expect(EMPTY()).toBeUndefined());
  it('should be read-only', () =>
    expect(() => (EMPTY as WritableSignal<unknown>).set(42)).toThrow());
});

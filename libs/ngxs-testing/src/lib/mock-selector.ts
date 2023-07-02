import { signal } from '@angular/core';

/**
 * Represents a selector, which returns a value which was previously set.
 */
export class MockSelector<T> {
  /**
   * @ignore
   */
  private readonly _isSet = signal(false);

  /**
   * @ignore
   */
  private readonly _value = signal<T | undefined>(undefined);

  /**
   * The value of this selector. Undefined, when a value has not been set yet.
   *
   * @see {@link MockSelector.set}
   */
  public readonly value = this._value.asReadonly();

  /**
   * Whether a value was set.
   */
  public readonly isSet = this._isSet.asReadonly();

  /**
   * Sets this value.
   *
   * @param value
   *
   * @see {@link MockSelector.value}
   */
  public set(value: T) {
    this._value.set(value);
    this._isSet.set(true);
  }
}

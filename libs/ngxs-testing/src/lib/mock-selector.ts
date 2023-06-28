import { BehaviorSubject, map } from 'rxjs';

/**
 * Represents a selector, which returns a value which was previously set.
 */
export class MockSelector<T> {
  private readonly _initialValue = Symbol();

  private readonly _value$ = new BehaviorSubject<T>(this._initialValue as T);

  /**
   * The value of this selector. Emits undefined, when a value has not been set yet.
   *
   * @see {@link MockSelector.set}
   */
  public readonly value$ = this._value$
    .asObservable()
    .pipe(map((value) => (this.isSet ? value : undefined)));

  /**
   * Whether a value was set.
   */
  public readonly isSet$ = this._value$
    .asObservable()
    .pipe(map((value) => value !== this._initialValue));

  /**
   * Sets this value.
   *
   * @param value
   *
   * @see {@link MockSelector.value}
   * @see {@link MockSelector.value$}
   */
  public set(value: T) {
    this._value$.next(value);
  }

  /**
   * The value of this selector. Returns undefined, when a value has not been set yet.
   *
   * @see {@link MockSelector.set}
   */
  public get value() {
    return this.isSet ? this._value$.value : undefined;
  }

  /**
   * Whether a value was set.
   */
  public get isSet() {
    return this._value$.value !== this._initialValue;
  }
}

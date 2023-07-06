import {
  Directive,
  HostListener,
  Input,
  Output,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { pairwise } from '../signal';
import { noop } from '../util';

/**
 * This Directive mixes in a generic implemantion of the {@link ControlValueAccessor}.
 */
@Directive({
  standalone: true,
})
export class MixinControlValueAccessor<T> implements ControlValueAccessor {
  /**
   * The control directive. Is null if not present this host.
   */
  public readonly ngControl = inject(NgControl, {
    self: true,
    optional: true,
  });

  /**
   * This function is set by the forms api, if a control is present.
   *
   * @see {@link MixinControlValueAccessor.registerOnChange}
   * @see {@link MixinControlValueAccessor.ngControl}
   */
  private readonly _onChange$ = signal<(value: T) => void>(noop);

  /**
   * This function is set by the forms api, if a control is present.
   *
   * @see {@link MixinControlValueAccessor.registerOnTouched}
   * @see {@link MixinControlValueAccessor.ngControl}
   */
  private readonly _onTouched$ = signal<() => void>(noop);

  /**
   * This value is set by the forms api, if a control is present.
   *
   * @see {@link MixinControlValueAccessor.setDisabledState}
   * @see {@link MixinControlValueAccessor.ngControl}
   */
  private readonly _disabled$ = signal(this.ngControl?.disabled ?? false);

  /**
   * Internal value, which does not reflect {@link MixinControlValueAccessor.compareTo$}.
   * In fact, this value is used to compute {@link MixinControlValueAccessor.value$}.
   *
   * @ignore
   */
  private readonly _value$ = signal(this.ngControl?.value as T);

  /**
   * The value of this mixin. If a control is present, it reflects it's value.
   *
   * @see {@link MixinControlValueAccessor.writeValue}
   * @see {@link MixinControlValueAccessor.ngControl}
   * @see {@link MixinControlValueAccessor.compareTo$}
   */
  public readonly value$ = computed(() => {
    const [currentValue, newValue] = pairwise(this._value$())(this._value$)();
    return !this.compareTo$()(currentValue, newValue) ? newValue : currentValue;
  });

  /**
   * Whether this mixin is disabled. If a control is present, it reflects it's disabled state.
   *
   * @see {@link MixinControlValueAccessor.setDisabledState}
   * @see {@link MixinControlValueAccessor.ngControl}
   */
  public readonly disabled$ = this._disabled$.asReadonly();

  /**
   * A comparator, which is used to determine {@link MixinControlValueAccessor.value$}. Defaults to strict equality.
   * Should return true, if two values are considered semanticly equal.
   */
  public readonly compareTo$ = signal((a: T, b: T) => a === b);

  /**
   * Ensures the control is up to date with the UI of this host.
   *
   * @see {@link MixinControlValueAccessor.value$}
   * @see {@link MixinControlValueAccessor._onChange$}
   *
   * @ignore
   */
  private readonly _updateControl$$ = effect(
    // If not put in next change detection cycle: NG100 ng-pristine: true -> false
    () => requestAnimationFrame(() => this._onChange$()(this.value$()))
  );

  @Input()
  public set value(value: T) {
    this._value$.set(value);
  }

  @Input()
  public set compareTo(compareTo: (a: T, b: T) => boolean) {
    this.compareTo$.set(compareTo);
  }

  /**
   * An observable representing this {@link MixinControlValueAccessor.value$}.
   */
  // eslint-disable-next-line @angular-eslint/no-output-rename
  @Output('valueChange')
  public readonly valueChange$ = toObservable(this.value$);

  public constructor() {
    if (this.ngControl) this.ngControl.valueAccessor = this;
  }

  /**
   * This function should be called when this host is considered 'touched'. Has no effect without a present control.
   *
   * Whenever a 'blur' event is triggered on this host, this function gets called.
   *
   * @see {@link MixinControlValueAccessor.registerOnTouched}
   * @see {@link MixinControlValueAccessor.ngControl}
   */
  @HostListener('blur')
  public blur = () => this._onTouched$()();

  // control value accessor

  public writeValue = (value: T) => this._value$.set(value);

  public registerOnChange = (fn: (value: T) => void) => this._onChange$.set(fn);

  public registerOnTouched = (fn: () => void) => this._onTouched$.set(fn);

  public setDisabledState = (disabled: boolean) =>
    this._disabled$.set(disabled);
}

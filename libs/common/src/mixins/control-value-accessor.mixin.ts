import {
  Directive,
  HostListener,
  Input,
  Output,
  computed,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';
import { skip } from 'rxjs';
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
   * A signal which tracks value changes.
   *
   * @ignore
   */
  private readonly _valueChange$ = signal<{
    source: 'modelToView' | 'viewToModel';
    value: T;
  }>({
    source: 'modelToView',
    value: this.ngControl?.value as T,
  });

  /**
   * Like {@link MixinControlValueAccessor._valueChange$} but filtered according to this {@link MixinControlValueAccessor.compareTo$}
   *
   * @ignore
   */
  private readonly _distinctValueChange$ = computed(
    (() => {
      // keep track of the current value change
      let currentValueChange$ = this._valueChange$();
      return () =>
        // if there is a value change according to this comparator update the current value change
        !this.compareTo$()(
          currentValueChange$.value,
          this._valueChange$().value
        )
          ? (currentValueChange$ = this._valueChange$())
          : currentValueChange$;
    })(),
    // non-primitives are considered not equal -> override
    // https://github.com/angular/angular/blob/2b0850331105f72d9128e63dfffbb1d8af883525/packages/core/src/signals/src/api.ts#L86
    { equal: (a, b) => a === b }
  );

  /**
   * The value of this mixin. If a control is present, it reflects it's value.
   *
   * @see {@link MixinControlValueAccessor.writeValue}
   * @see {@link MixinControlValueAccessor.ngControl}
   * @see {@link MixinControlValueAccessor.compareTo$}
   */
  public readonly value$ = computed(() => this._distinctValueChange$().value);

  /**
   * Whether this mixin is disabled. If a control is present, it reflects it's disabled state.
   *
   * @see {@link MixinControlValueAccessor.setDisabledState}
   * @see {@link MixinControlValueAccessor.ngControl}
   */
  public readonly disabled$ = this._disabled$.asReadonly();

  /**
   * A comparator, which is used to determine {@link MixinControlValueAccessor._distinctValueChange$}.
   * Should return true, if two values are considered semanticly equal.
   *
   * Default: all values are considered not equal (in order to align with {@link FormControl.setValue}).
   */
  public readonly compareTo$ = signal<(a: T, b: T) => boolean>(() => false);

  /**
   * Ensures the model (control) is up to date with this view.
   *
   * @see {@link MixinControlValueAccessor._distinctValueChange$}
   * @see {@link MixinControlValueAccessor._onChange$}
   *
   * @ignore
   */
  private readonly _viewToModel$$ = effect(
    () =>
      // ensure the value change is from view to model
      this._distinctValueChange$().source === 'viewToModel' &&
      // ensure a value change according to this comparator
      !untracked(this.compareTo$)(
        this.ngControl?.value,
        this._distinctValueChange$().value
      ) &&
      // update model
      this._onChange$()(this._distinctValueChange$().value)
  );

  private readonly _disabled$$ = effect(
    () =>
      this.ngControl?.control &&
      this.ngControl.control[this.disabled$() ? 'disable' : 'enable']
  );

  /**
   * Sets this value.
   */
  @Input()
  public set value(value: T) {
    this._valueChange$.set({ source: 'viewToModel', value });
  }

  /**
   * Sets this comparator.
   *
   * @see {@link MixinControlValueAccessor.compareTo$}
   */
  @Input()
  public set compareTo(compareTo: (a: T, b: T) => boolean) {
    this.compareTo$.set(compareTo);
  }

  /**
   * A hot observable representing changes of {@link MixinControlValueAccessor._distinctValueChange$}.
   */
  // eslint-disable-next-line @angular-eslint/no-output-rename
  @Output('valueChange')
  public readonly valueChange$ = toObservable(this.value$).pipe(skip(1)); // -> hot observable

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

  public writeValue = (value: T) =>
    this._valueChange$.set({ source: 'modelToView', value });

  public registerOnChange = (fn: (value: T) => void) => this._onChange$.set(fn);

  public registerOnTouched = (fn: () => void) => this._onTouched$.set(fn);

  public setDisabledState = (disabled: boolean) =>
    this._disabled$.set(disabled);
}

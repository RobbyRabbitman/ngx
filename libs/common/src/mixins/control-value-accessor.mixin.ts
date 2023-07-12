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
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { skip } from 'rxjs';
import { noop } from '../util';

type MixinControlValueAccessorChangeSource = 'model' | 'view';

interface MixinControlValueAccessorChange<T> {
  source: MixinControlValueAccessorChangeSource;
  value: T;
}

/**
 * This Directive mixes in a generic implemantion of the {@link ControlValueAccessor}.
 *
 * @example
 *
  ### Custom Checkbox
  ```html
  <custom-checkbox [formControl]="control">fancy label</custom-checkbox>
  ```
  The following custom checkbox component implements the {@link ControlValueAccessor}.
  When declaring this directive as a host directive, the checkbox inherits the implementation by the composition api.
  Via DI the checkbox is able to access the control value accessor and utilize its api in order to sync the checkbox with the control and vice versa:
  ```ts
  import { MixinControlValueAccessor } from '@robby-rabbitman/ngx-common';

  @Component({
    selector: 'custom-checkbox',
    standalone: true,
    template: `<label [for]="id"><ng-content></ng-content></label>
      <input
        [id]="id"
        (change)="cva.value = $event.target.checked"
        (blur)="cva.blur()"
        [value]="cva.value$()"
        [disabled]="cva.disabled$()"
        type="checkbox"
      />`,
    hostDirectives: [
      {
        directive: MixinControlValueAccessor,
        inputs: ['value', 'disabled'],
        outputs: ['valueChange'],
      }
    ],
  })
  class CustomCheckbox {
    public static nextId = 0

    public cva = inject(MixinControlValueAccessor);

    @Input()
    public id = CustomCheckbox.nextId++;
  }
  ```
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
   * Value changes (model <-> view ).
   *
   * @ignore
   */
  private readonly _valueChange$ = signal<MixinControlValueAccessorChange<T>>({
    source: 'model',
    value: this.ngControl?.value as T,
  });

  /**
   * Like {@link MixinControlValueAccessor._valueChange$} but distinct according to this {@link MixinControlValueAccessor.compareTo$}.
   *
   * @ignore
   */
  private readonly _distinctValueChange$ = computed(this._valueChange$, {
    equal: (a, b) => this.compareTo$()(a.value, b.value),
  });

  /**
   * The value of this mixin. If a control is present, it reflects it's value.
   *
   * @see {@link MixinControlValueAccessor.value}
   * @see {@link MixinControlValueAccessor.writeValue}
   * @see {@link MixinControlValueAccessor.compareTo$}
   */
  public readonly value$ = computed(() => this._distinctValueChange$().value, {
    // distinctiveness is already checked by _distinctValueChange$, so every value must be considered distinct.
    equal: () => false,
  });

  /**
   * Whether this mixin is disabled. If a control is present, it reflects it's disabled state.
   *
   * @see {@link MixinControlValueAccessor.setDisabledState}
   * @see {@link MixinControlValueAccessor.ngControl}
   */
  public readonly disabled$ = signal(this.ngControl?.disabled ?? false);

  /**
   * A comparator, which is used to determine {@link MixinControlValueAccessor.value$}.
   * Should return true, if two values are considered semanticly equal.
   *
   * Default: same value in memory via Object.is - like Change Detection for Inputs
   */
  public readonly compareTo$ = signal<(a?: T, b?: T) => boolean>(Object.is);

  /**
   * Ensures the model's value is up to date with this view.
   *
   * @see {@link MixinControlValueAccessor._distinctValueChange$}
   * @see {@link MixinControlValueAccessor._onChange$}
   *
   * @ignore
   */
  private readonly _valueViewToModel$$ = effect(
    () =>
      // ensure the value change is from view to model
      this._distinctValueChange$().source === 'view' &&
      // ensure a distinc value change according to this comparator
      !untracked(this.compareTo$)(
        this.ngControl?.value,
        this._distinctValueChange$().value
      ) &&
      // update model
      this._onChange$()(this._distinctValueChange$().value)
  );

  /**
   * Ensures the model's disable state is up to date with this view.
   *
   * @see {@link MixinControlValueAccessor.disabled$}
   *
   * @ignore
   */
  private readonly _disabledViewToModel$$ = effect(
    () =>
      this.ngControl?.control &&
      this.ngControl.control[this.disabled$() ? 'disable' : 'enable']()
  );

  /**
   * Sets this value.
   */
  @Input()
  public set value(value: T) {
    this._valueChange$.set({ source: 'view', value });
  }

  /**
   * Sets this disabled state.
   */
  @Input()
  public set disabled(disabled: boolean) {
    this.disabled$.set(disabled);
  }

  /**
   * Sets this comparator.
   *
   * @see {@link MixinControlValueAccessor.compareTo$}
   */
  @Input()
  public set compareTo(compareTo: (a?: T, b?: T) => boolean) {
    typeof compareTo === 'function' && this.compareTo$.set(compareTo);
  }

  /**
   * A hot observable representing changes of {@link MixinControlValueAccessor.value$}.
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
    this._valueChange$.set({ source: 'model', value });

  public registerOnChange = (fn: (value: T) => void) => this._onChange$.set(fn);

  public registerOnTouched = (fn: () => void) => this._onTouched$.set(fn);

  public setDisabledState = (disabled: boolean) =>
    this.disabled$() !== disabled && this.disabled$.set(disabled);
}

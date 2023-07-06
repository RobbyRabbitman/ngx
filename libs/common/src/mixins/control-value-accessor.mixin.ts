import {
  Directive,
  HostListener,
  Input,
  Output,
  effect,
  inject,
  signal,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { pairwise } from '../signal';
import { noop } from '../util';

@Directive({
  standalone: true,
})
export class MixinControlValueAccessor<T> implements ControlValueAccessor {
  private readonly _ngControl = inject(NgControl, {
    self: true,
    optional: true,
  });

  private readonly onChange$ = signal<(value: T) => void>(noop);

  private readonly onTouched$ = signal<() => void>(noop);

  private readonly _disabled$ = signal(this._ngControl?.disabled ?? false);

  private readonly _value$ = signal(this._ngControl?.value as T);

  public readonly value$ = pairwise(
    (currentValue, newValue) =>
      this.compareTo$()(currentValue, newValue) ? newValue : currentValue,
    this._value$()
  )(this._value$);

  public readonly disabled$ = this._disabled$.asReadonly();

  public readonly compareTo$ = signal((a: T, b: T) => a !== b);

  public _updateControl$$ = effect(
    // If not put in next change detection cycle: NG100 ng-pristine: true -> false
    () => requestAnimationFrame(() => this.onChange$()(this.value$()))
  );

  @Input()
  public set value(value: T) {
    this._value$.set(value);
  }

  @Input()
  public set compareTo(compareTo: (a: T, b: T) => boolean) {
    this.compareTo$.set(compareTo);
  }

  // eslint-disable-next-line @angular-eslint/no-output-rename
  @Output('valueChange')
  public readonly valueChange$ = toObservable(this.value$);

  public constructor() {
    if (this._ngControl) this._ngControl.valueAccessor = this;
  }

  @HostListener('blur')
  public blur = () => this.onTouched$()();

  // control value accessor

  public writeValue = (value: T) => this._value$.set(value);

  public registerOnChange = (fn: (value: T) => void) => this.onChange$.set(fn);

  public registerOnTouched = (fn: () => void) => this.onTouched$.set(fn);

  public setDisabledState = (disabled: boolean) =>
    this._disabled$.set(disabled);
}

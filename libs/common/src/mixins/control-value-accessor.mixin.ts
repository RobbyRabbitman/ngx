import {
  Directive,
  HostListener,
  Input,
  Output,
  Signal,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { combineLatest, filter, map, pairwise } from 'rxjs';
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

  public readonly value$ = signal(this._value$()) as Signal<T>;

  public readonly disabled$ = this._disabled$.asReadonly();

  public readonly compareTo$ = signal((a: T, b: T) => a !== b);

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

  public _value$$ = combineLatest([
    toObservable(this._value$).pipe(pairwise()),
    toObservable(this.compareTo$),
  ])
    .pipe(
      filter(([[a, b], compareTo]) => compareTo(a, b)),
      map(([[_, b]]) => {
        (this.value$ as WritableSignal<T>).set(b);
        this.onChange$()(b);
      }),
      takeUntilDestroyed()
    )
    .subscribe();

  @HostListener('blur')
  public blur = () => this.onTouched$()();

  // control value accessor

  public writeValue = (value: T) => this._value$.set(value);

  public registerOnChange = (fn: (value: T) => void) => this.onChange$.set(fn);

  public registerOnTouched = (fn: () => void) => this.onTouched$.set(fn);

  public setDisabledState = (disabled: boolean) =>
    this._disabled$.set(disabled);
}

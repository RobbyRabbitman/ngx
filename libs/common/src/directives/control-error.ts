import {
  Directive,
  InjectionToken,
  Injector,
  Input,
  TemplateRef,
  ViewContainerRef,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ifNonNull } from '../signal';
import { Arguments } from '../util/ts/arguments';

export const dirty$ = (control: AbstractControl) => {
  const dirty$ = signal(control.dirty);

  const markAsPristine = control.markAsPristine.bind(control);

  const markAsDirty = control.markAsDirty.bind(control);

  control.markAsPristine = (
    ...args: Arguments<AbstractControl['markAsPristine']>
  ) => {
    markAsPristine(...args);
    dirty$.set(false);
  };

  control.markAsDirty = (
    ...args: Arguments<AbstractControl['markAsDirty']>
  ) => {
    markAsDirty(...args);
    dirty$.set(true);
  };

  return dirty$;
};

export const touched$ = (control: AbstractControl) => {
  const touched$ = signal(control.touched);

  const markAsTouched = control.markAsTouched.bind(control);

  const markAsUntouched = control.markAsUntouched.bind(control);

  control.markAsTouched = (
    ...args: Arguments<AbstractControl['markAsTouched']>
  ) => {
    markAsTouched(...args);
    touched$.set(true);
  };

  control.markAsUntouched = (
    ...args: Arguments<AbstractControl['markAsUntouched']>
  ) => {
    markAsUntouched(...args);
    touched$.set(false);
  };

  return touched$;
};

export type StateMatcher = (
  control: AbstractControl,
  parent?: FormGroupDirective | NgForm
) => boolean;

export const DEFAULT_STATE_MATCHER: StateMatcher = (control, parent) =>
  control.invalid && (control.touched || !!parent?.submitted);

export const STATE_MATCHER = new InjectionToken<StateMatcher>(
  'NGX State Matcher',
  { factory: () => DEFAULT_STATE_MATCHER }
);

@Directive({
  selector: '[ngxControlError]',
  standalone: true,
})
export class ControlError<T> {
  private readonly _templateRef = inject(TemplateRef);

  private readonly _injector = inject(Injector);

  private readonly _viewContainerRef = inject(ViewContainerRef);

  public readonly error$ = signal<undefined | string | string[]>(undefined);

  public readonly parent$ = signal(
    inject(FormGroupDirective, { optional: true }) ??
      inject(NgForm, { optional: true }) ??
      undefined
  );

  public readonly control$ = signal<AbstractControl<T> | undefined>(undefined);

  public readonly touched$ = ifNonNull(touched$)(this.control$);

  public readonly dirty$ = ifNonNull(dirty$)(this.control$);

  public readonly status$ = ifNonNull((control: AbstractControl) =>
    toSignal(control.statusChanges, {
      initialValue: control.status,
      injector: this._injector,
    })
  )(this.control$);

  public readonly value$ = ifNonNull((control: AbstractControl) =>
    toSignal(control.valueChanges, {
      initialValue: control.value,
      injector: this._injector,
    })
  )(this.control$);

  public readonly errorStateMatcher$ = signal(inject(STATE_MATCHER));

  public readonly hasError$ = computed(() => {
    const error = this.error$();
    const control = this.control$();
    const parent = this.parent$();
    const errorStateMatcher = this.errorStateMatcher$();

    // this computation needs to be also executed when these values change
    this.touched$(), this.dirty$(), this.value$(), this.status$();

    const hasError = !!(
      error &&
      control &&
      (typeof error === 'string'
        ? control.hasError(error)
        : error.some((x) => control.hasError(x))) &&
      errorStateMatcher(control, parent)
    );

    return hasError;
  });

  @Input('ngxControlError')
  public set _error(error: string | string[]) {
    this.error$.set(error);
  }

  @Input('ngxControlErrorOf')
  public set _control(control: AbstractControl) {
    this.control$.set(control);
  }

  @Input('ngxControlErrorErrorStateMatcher')
  public set _errorStateMatcher(errorStateMatcher: StateMatcher) {
    this.errorStateMatcher$.set(errorStateMatcher);
  }

  private readonly _render$$ = effect(() => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const error = this.error$()!;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const control = this.control$()!;

    this._viewContainerRef.clear();

    if (this.hasError$())
      this._viewContainerRef.createEmbeddedView(this._templateRef, {
        $implicit:
          typeof error === 'string'
            ? control.getError(error)
            : error
                .filter((x) => control.hasError(x))
                .reduce(
                  (errors, x) => ({
                    ...errors,
                    [x]: control.getError(x),
                  }),
                  {}
                ),
        get ngxControlErrorOf() {
          return this.$implicit;
        },
      });
  });
}

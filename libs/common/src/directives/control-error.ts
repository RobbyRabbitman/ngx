import {
  Directive,
  InjectionToken,
  Input,
  TemplateRef,
  ViewContainerRef,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { AbstractControl, FormGroupDirective, NgForm } from '@angular/forms';

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
  exportAs: 'ngxControlError',
  standalone: true,
})
export class ControlError<T> {
  private readonly _templateRef = inject(TemplateRef);

  private readonly _viewContainerRef = inject(ViewContainerRef);

  public readonly error = signal<undefined | string | string[]>(undefined);

  public readonly parent = signal(
    inject(FormGroupDirective, { optional: true }) ??
      inject(NgForm, { optional: true }) ??
      undefined
  );

  public readonly control = signal<AbstractControl<T> | undefined>(undefined);

  public readonly errorStateMatcher = signal(inject(STATE_MATCHER));

  public readonly hasError$ = computed(() => {
    const error = this.error();
    const control = this.control();
    const parent = this.parent();
    const errorStateMatcher = this.errorStateMatcher();
    return !!(
      error &&
      control &&
      (typeof error === 'string'
        ? control.hasError(error)
        : error.some((x) => control.hasError(x))) &&
      errorStateMatcher(control, parent)
    );
  });

  @Input('ngxControlError')
  public set _error(error: string | string[]) {
    this.error.set(error);
  }

  @Input('ngxControlErrorOf')
  public set _control(control: AbstractControl) {
    this.control.set(control);
  }

  @Input('ngxControlErrorErrorStateMatcher')
  public set _errorStateMatcher(errorStateMatcher: StateMatcher) {
    this.errorStateMatcher.set(errorStateMatcher);
  }

  private readonly _render$$ = effect(() => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const error = this.error()!;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const control = this.control()!;

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

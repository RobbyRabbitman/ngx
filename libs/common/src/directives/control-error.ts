import {
  Directive,
  EmbeddedViewRef,
  InjectionToken,
  Input,
  Provider,
  TemplateRef,
  ViewContainerRef,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormGroupDirective,
  NgForm,
  ValidationErrors,
} from '@angular/forms';
import { EMPTY, switchMap } from 'rxjs';
import { ifNonNull } from '../signal';

export const dirty$ = (control: AbstractControl) => {
  const dirty$ = signal(control.dirty);

  const markAsPristine = control.markAsPristine.bind(control);

  const markAsDirty = control.markAsDirty.bind(control);

  control.markAsPristine = (
    ...args: Parameters<AbstractControl['markAsPristine']>
  ) => {
    markAsPristine(...args);
    dirty$.set(false);
  };

  control.markAsDirty = (
    ...args: Parameters<AbstractControl['markAsDirty']>
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
    ...args: Parameters<AbstractControl['markAsTouched']>
  ) => {
    markAsTouched(...args);
    touched$.set(true);
  };

  control.markAsUntouched = (
    ...args: Parameters<AbstractControl['markAsUntouched']>
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

export const DEFAULT_ERROR_STATE_MATCHER: StateMatcher = (control, parent) =>
  control.invalid && (control.touched || !!parent?.submitted);

export const ERROR_STATE_MATCHER = new InjectionToken<StateMatcher>(
  'NGX State Matcher',
  { factory: () => DEFAULT_ERROR_STATE_MATCHER }
);

export const provideErrorStateMatcher = (errorStateMatcher: StateMatcher) =>
  ({
    provide: ERROR_STATE_MATCHER,
    useValue: errorStateMatcher,
  } satisfies Provider);

export interface ControlErrorContext {
  $implicit: any | ValidationErrors;
  ngxControlErrorOf: any | ValidationErrors;
  control: AbstractControl;
  track: string | string[];
}

@Directive({
  selector: '[ngxControlError]',
  standalone: true,
})
export class ControlError {
  private readonly _templateRef = inject(TemplateRef);

  private readonly _viewContainerRef = inject(ViewContainerRef);

  public readonly track$ = signal<undefined | string | string[]>(undefined);

  public readonly parent$ = signal(
    inject(FormGroupDirective, { optional: true }) ??
      inject(NgForm, { optional: true }) ??
      undefined
  );

  public readonly control$ = signal<AbstractControl | undefined>(undefined);

  public readonly touched$ = ifNonNull(touched$)(this.control$);

  public readonly dirty$ = ifNonNull(dirty$)(this.control$);

  public readonly status$ = toSignal(
    toObservable(this.control$).pipe(
      switchMap((control) => control?.statusChanges ?? EMPTY)
    )
  );

  public readonly value$ = toSignal(
    toObservable(this.control$).pipe(
      switchMap((control) => control?.valueChanges ?? EMPTY)
    )
  );

  public readonly errorStateMatcher$ = signal(inject(ERROR_STATE_MATCHER));

  public readonly hasError$ = computed(() => this._hasError$());

  @Input({ alias: 'ngxControlErrorTrack', required: true })
  public set _track(track: string | string[]) {
    this.track$.set(track);
  }

  @Input({ alias: 'ngxControlErrorOf', required: true })
  public set _control(control: AbstractControl) {
    this.control$.set(control);
  }

  @Input({ alias: 'ngxControlErrorErrorStateMatcher' })
  public set _errorStateMatcher(errorStateMatcher: StateMatcher) {
    this.errorStateMatcher$.set(errorStateMatcher);
  }

  private readonly _hasError$ = computed(
    () => {
      const track = this.track$();
      const control = this.control$();
      const parent = this.parent$();
      const errorStateMatcher = this.errorStateMatcher$();

      this.touched$(), this.dirty$(), this.value$(), this.status$();

      const hasError = !!(
        track &&
        control &&
        (typeof track === 'string'
          ? control.hasError(track)
          : track.some((x) => control.hasError(x))) &&
        errorStateMatcher(control, parent)
      );

      return hasError;
    },
    { equal: () => false }
  );

  public get context() {
    return (
      this._viewContainerRef.get(0) as EmbeddedViewRef<ControlErrorContext>
    )?.context;
  }

  private readonly _render$$ = effect(() => {
    const track = this.track$();
    const control = this.control$();
    const hasError = this._hasError$();

    this._viewContainerRef.clear();

    if (hasError && control != null && track != null)
      this._viewContainerRef.createEmbeddedView(this._templateRef, {
        $implicit:
          typeof track === 'string'
            ? control.getError(track)
            : track
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
        track,
        control,
      } satisfies ControlErrorContext);
  });

  public static ngTemplateContextGuard = (
    directive: ControlError,
    context: unknown
  ): context is ControlErrorContext => true;
}

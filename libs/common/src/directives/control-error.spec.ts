import { fakeAsync, tick } from '@angular/core/testing';
import {
  AbstractControl,
  FormControl,
  NgForm,
  Validators,
} from '@angular/forms';
import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';
import { delay, of } from 'rxjs';
import {
  ControlError,
  DEFAULT_ERROR_STATE_MATCHER,
  provideErrorStateMatcher,
} from './control-error';

describe('ControlError', () => {
  beforeEach(() => MockBuilder(ControlError));

  const findInstance = () => ngMocks.findInstance(ControlError);

  it('should create an instance', () => {
    MockRender(`<ng-template ngxControlError></ng-template>`);
    expect(findInstance()).toBeTruthy();
  });

  it('should have a context guard', () => {
    MockRender(`<ng-template ngxControlError></ng-template>`);
    expect(ControlError.ngTemplateContextGuard(findInstance(), {})).toBe(true);
  });

  it('should support micro syntax', () => {
    const params = {
      error: 'required',
      control: new FormControl('', Validators.required),
      stateMatcher: () => true,
    };

    const fixture = MockRender(
      `<span *ngxControlError="let errors of control; track: error; errorStateMatcher: stateMatcher; let implicit">42</span>`,
      // NG100 ...
      // `<span *ngxControlError="error of control as error; errorStateMatcher: stateMatcher; let implicit">{{ error }} {{ implicit }}</span>`,
      params
    );

    expect(ngMocks.formatText(fixture)).toEqual('42');

    expect(findInstance().context.$implicit).toEqual(true);
    expect(findInstance().context.ngxControlErrorOf).toEqual(true);
    expect(findInstance().context.control).toEqual(params.control);
  });

  it('should have an injectable error state matcher', () => {
    const errorStateMatcher = jest.fn();

    MockRender(`<ng-template ngxControlError></ng-template>`, undefined, {
      providers: [provideErrorStateMatcher(errorStateMatcher)],
    });

    expect(findInstance().errorStateMatcher$()).toBe(errorStateMatcher);
  });

  it('should use the default error state matcher as default', () => {
    MockRender(`<ng-template ngxControlError></ng-template>`);

    expect(findInstance().errorStateMatcher$()).toBe(
      DEFAULT_ERROR_STATE_MATCHER
    );
  });

  describe('should have an error when the control has the specified error and the control is in an error state based on the error state matcher', () => {
    it('respecting error changes', () => {
      const fixture = MockRender(`<ng-template ngxControlError></ng-template>`);
      const controlError = findInstance();

      controlError.track$.set('required');
      controlError.control$.set(new FormControl('', Validators.required));
      controlError.errorStateMatcher$.set(() => true);

      fixture.detectChanges();

      expect(controlError.hasError$()).toBe(true);

      controlError.track$.set('otherError');

      fixture.detectChanges();

      expect(controlError.hasError$()).toBe(false);
    });

    it('when it has at least 1 tracked error ', () => {
      const fixture = MockRender(`<ng-template ngxControlError></ng-template>`);
      const controlError = findInstance();

      controlError.track$.set(['minlength', 'email']);
      controlError.control$.set(
        new FormControl('42', [Validators.minLength(3), Validators.email])
      );
      controlError.errorStateMatcher$.set(() => true);

      fixture.detectChanges();

      expect(controlError.hasError$()).toBe(true);
    });

    it('respecting error state matcher changes', () => {
      const fixture = MockRender(`<ng-template ngxControlError></ng-template>`);
      const controlError = findInstance();

      controlError.track$.set('required');
      controlError.control$.set(new FormControl('', Validators.required));
      controlError.errorStateMatcher$.set(() => true);

      fixture.detectChanges();

      expect(controlError.hasError$()).toBe(true);

      controlError.errorStateMatcher$.set(() => false);

      fixture.detectChanges();

      expect(controlError.hasError$()).toBe(false);
    });

    it('respecting control instance changes', () => {
      const fixture = MockRender(`<ng-template ngxControlError></ng-template>`);
      const controlError = findInstance();

      controlError.track$.set('required');
      controlError.control$.set(new FormControl('', Validators.required));
      controlError.errorStateMatcher$.set(() => true);

      fixture.detectChanges();

      expect(controlError.hasError$()).toBe(true);

      controlError.control$.set(new FormControl(''));

      fixture.detectChanges();

      expect(controlError.hasError$()).toBe(false);
    });

    describe('respecting control changes', () => {
      it('touched/untouched', () => {
        const fixture = MockRender(
          `<ng-template ngxControlError></ng-template>`
        );
        const controlError = findInstance();

        controlError.track$.set('required');
        controlError.control$.set(new FormControl('', Validators.required));
        controlError.errorStateMatcher$.set((control) => control.touched);

        fixture.detectChanges();

        expect(controlError.hasError$()).toBe(false);

        controlError.control$()?.markAsTouched();

        fixture.detectChanges();

        expect(controlError.hasError$()).toBe(true);

        controlError.control$()?.markAsUntouched();

        fixture.detectChanges();

        expect(controlError.hasError$()).toBe(false);
      });

      it('dirty/pristine', () => {
        const fixture = MockRender(
          `<ng-template ngxControlError></ng-template>`
        );
        const controlError = findInstance();

        controlError.track$.set('required');
        controlError.control$.set(new FormControl('', Validators.required));
        controlError.errorStateMatcher$.set((control) => control.dirty);

        fixture.detectChanges();

        expect(controlError.hasError$()).toBe(false);

        controlError.control$()?.markAsDirty();

        fixture.detectChanges();

        expect(controlError.hasError$()).toBe(true);

        controlError.control$()?.markAsPristine();

        fixture.detectChanges();

        expect(controlError.hasError$()).toBe(false);
      });

      it('value', () => {
        const fixture = MockRender(
          `<ng-template ngxControlError></ng-template>`
        );
        const controlError = findInstance();

        controlError.track$.set('minlength');
        controlError.control$.set(
          new FormControl('1', [
            Validators.minLength(3),
            // set this validator here so that the control is from begin in an 'INVALID' status,
            // so that there is no status change emit from the control.statusChange when the required length is fulfilled.
            () => ({ alwaysError: true }),
          ])
        );
        controlError.errorStateMatcher$.set(() => true);

        fixture.detectChanges();

        expect(controlError.hasError$()).toBe(true);

        controlError.control$()?.setValue('12');

        fixture.detectChanges();

        expect(controlError.hasError$()).toBe(true);

        controlError.control$()?.setValue('123');

        fixture.detectChanges();

        expect(controlError.hasError$()).toBe(false);
      });

      it('adding validators', () => {
        const fixture = MockRender(
          `<ng-template ngxControlError></ng-template>`
        );
        const controlError = findInstance();

        controlError.track$.set('required');
        controlError.control$.set(new FormControl(''));
        controlError.errorStateMatcher$.set((control) => control.invalid);

        fixture.detectChanges();

        expect(controlError.hasError$()).toBe(false);

        controlError.control$()?.addValidators(Validators.required);
        controlError.control$()?.updateValueAndValidity();

        fixture.detectChanges();

        expect(controlError.hasError$()).toBe(true);
      });

      it('removing validators', () => {
        const fixture = MockRender(
          `<ng-template ngxControlError></ng-template>`
        );
        const controlError = findInstance();

        controlError.track$.set('required');
        controlError.control$.set(new FormControl('', Validators.required));
        controlError.errorStateMatcher$.set((control) => control.invalid);

        fixture.detectChanges();

        expect(controlError.hasError$()).toBe(true);

        controlError.control$()?.removeValidators(Validators.required);
        controlError.control$()?.updateValueAndValidity();

        fixture.detectChanges();

        expect(controlError.hasError$()).toBe(false);
      });

      describe('status', () => {
        it('invalid/valid', () => {
          const fixture = MockRender(
            `<ng-template ngxControlError></ng-template>`
          );
          const controlError = findInstance();

          controlError.track$.set('required');
          controlError.control$.set(new FormControl('', Validators.required));
          controlError.errorStateMatcher$.set((control) => control.invalid);

          fixture.detectChanges();

          expect(controlError.hasError$()).toBe(true);

          controlError.control$()?.setValue('42');

          fixture.detectChanges();

          expect(controlError.hasError$()).toBe(false);

          controlError.control$()?.setValue('');

          fixture.detectChanges();

          expect(controlError.hasError$()).toBe(true);
        });

        it('disabled', () => {
          const fixture = MockRender(
            `<ng-template ngxControlError></ng-template>`
          );
          const controlError = findInstance();

          controlError.track$.set('required');
          controlError.control$.set(new FormControl('', Validators.required));
          controlError.errorStateMatcher$.set((control) => control.disabled);

          fixture.detectChanges();

          expect(controlError.hasError$()).toBe(false);

          controlError.control$()?.disable();

          fixture.detectChanges();

          // still false cuz when the control gets disabled the errors are set to null.
          // https://github.com/angular/angular/blob/c1052cf7a77e0bf2a4ec14f9dd5abc92034cfd2e/packages/forms/src/model/abstract_model.ts#L946
          expect(controlError.hasError$()).toBe(false);
          expect(controlError.control$()?.errors).toBe(null);

          controlError.control$()?.enable();

          fixture.detectChanges();

          expect(controlError.hasError$()).toBe(false);
        });

        it('pending', fakeAsync(() => {
          const fixture = MockRender(
            `<ng-template ngxControlError></ng-template>`
          );
          const controlError = findInstance();

          controlError.track$.set('required');
          controlError.control$.set(
            new FormControl('', undefined, (control) =>
              of(Validators.required(control)).pipe(delay(500))
            )
          );
          controlError.errorStateMatcher$.set(() => true);

          fixture.detectChanges();
          tick(500);

          expect(controlError.hasError$()).toBe(true);

          controlError.control$()?.setValue('42');

          fixture.detectChanges();
          tick(500);

          expect(controlError.hasError$()).toBe(false);
        }));
      });
    });
  });
  it('should render when it has an error', () => {
    const fixture = MockRender(`<ng-template ngxControlError>42</ng-template>`);
    const controlError = findInstance();

    controlError.track$.set('required');
    controlError.control$.set(new FormControl('', Validators.required));
    controlError.errorStateMatcher$.set(() => true);

    fixture.detectChanges();

    expect(ngMocks.formatText(fixture)).toBe('42');

    controlError.errorStateMatcher$.set(() => false);

    fixture.detectChanges();

    expect(ngMocks.formatText(fixture)).toBe('');
  });

  it('should reference the tracked error value in its context', () => {
    const fixture = MockRender(`<ng-template ngxControlError>42</ng-template>`);
    const controlError = findInstance();

    controlError.track$.set('required');
    controlError.control$.set(new FormControl('', Validators.required));
    controlError.errorStateMatcher$.set(() => true);

    fixture.detectChanges();

    expect(findInstance().context.$implicit).toBe(
      findInstance().context.ngxControlErrorOf
    );
    expect(findInstance().context.$implicit).toBe(true);
  });

  it('should reference the control in its context', () => {
    const fixture = MockRender(`<ng-template ngxControlError>42</ng-template>`);
    const controlError = findInstance();
    const control = new FormControl('', Validators.required);

    controlError.track$.set('required');
    controlError.control$.set(control);
    controlError.errorStateMatcher$.set(() => true);

    fixture.detectChanges();

    expect(findInstance().context.control).toBe(control);
  });

  it('should reference the tracked error in its context', () => {
    const fixture = MockRender(`<ng-template ngxControlError>42</ng-template>`);
    const controlError = findInstance();

    controlError.track$.set('required');
    controlError.control$.set(new FormControl('', Validators.required));
    controlError.errorStateMatcher$.set(() => true);

    fixture.detectChanges();

    expect(findInstance().context.track).toBe('required');
  });

  it('should reference the tracked errors in its context', () => {
    const fixture = MockRender(`<ng-template ngxControlError>42</ng-template>`);
    const controlError = findInstance();

    controlError.track$.set(['minlength', 'email']);
    controlError.control$.set(
      new FormControl('42', [Validators.minLength(3), Validators.email])
    );
    controlError.errorStateMatcher$.set(() => true);

    fixture.detectChanges();

    expect(findInstance().context.track).toEqual(['minlength', 'email']);
  });

  it('should reference the tracked error values in its context', () => {
    const fixture = MockRender(`<ng-template ngxControlError>42</ng-template>`);
    const controlError = findInstance();

    controlError.track$.set(['minlength', 'email']);
    controlError.control$.set(
      new FormControl('42', [Validators.minLength(3), Validators.email])
    );
    controlError.errorStateMatcher$.set(() => true);

    fixture.detectChanges();

    expect(findInstance().context.$implicit).toBe(
      findInstance().context.ngxControlErrorOf
    );
    expect(findInstance().context.$implicit).toEqual({
      email: true,
      minlength: { actualLength: 2, requiredLength: 3 },
    });
  });
});

describe('DEFAULT_ERROR_STATE_MATCHER', () => {
  it('should return true if the control is invalid and it has been touched or the parent has been submitted', () => {
    const withOutParent = (
      invalid: boolean,
      touched: boolean,
      expected: boolean
    ) =>
      expect(
        DEFAULT_ERROR_STATE_MATCHER({
          invalid,
          touched,
        } as AbstractControl)
      ).toBe(expected);

    withOutParent(true, true, true);
    withOutParent(true, false, false);
    withOutParent(false, true, false);
    withOutParent(false, false, false);

    const withParent = (
      invalid: boolean,
      touched: boolean,
      submitted: boolean,
      expected: boolean
    ) =>
      expect(
        DEFAULT_ERROR_STATE_MATCHER(
          {
            invalid,
            touched,
          } as AbstractControl,
          { submitted } as NgForm
        )
      ).toBe(expected);

    withParent(true, true, true, true);
    withParent(true, true, false, true);
    withParent(true, false, true, true);
    withParent(true, false, false, false);
    withParent(false, true, true, false);
    withParent(false, true, false, false);
    withParent(false, false, true, false);
    withParent(false, false, false, false);
  });
});

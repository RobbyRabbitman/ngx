import { fakeAsync, tick } from '@angular/core/testing';
import { FormControl, Validators } from '@angular/forms';
import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';
import { delay, of } from 'rxjs';
import { ControlError, provideErrorStateMatcher } from './control-error';

describe('ControlError', () => {
  beforeEach(() => MockBuilder(ControlError));

  const findInstance = () => ngMocks.findInstance(ControlError);

  it('should create an instance', () => {
    MockRender(`<ng-template ngxControlError></ng-template>`);
    expect(findInstance()).toBeTruthy();
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
    expect(findInstance().context.errors).toEqual({ required: true });
  });

  it('should have an injectable error state matcher', () => {
    const errorStateMatcher = jest.fn();

    MockRender(`<ng-template ngxControlError></ng-template>`, undefined, {
      providers: [provideErrorStateMatcher(errorStateMatcher)],
    });

    expect(findInstance().errorStateMatcher$()).toBe(errorStateMatcher);
  });

  describe('should has an error when the control has the specified error and the control is in an error state based on the error state matcher', () => {
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
});

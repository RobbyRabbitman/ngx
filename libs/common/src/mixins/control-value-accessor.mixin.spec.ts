import { Component, Signal } from '@angular/core';
import {
  FormControl,
  FormsModule,
  NgControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';
import { merge } from 'rxjs';
import { MixinControlValueAccessor } from './control-value-accessor.mixin';

describe('A MixinControlValueAccessor instance used as a host directive by a component', () => {
  @Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'some-component',
    standalone: true,
    hostDirectives: [
      {
        directive: MixinControlValueAccessor,
        inputs: ['value'],
        // eslint-disable-next-line @angular-eslint/no-outputs-metadata-property
        outputs: ['valueChange'],
      },
    ],
  })
  class SomeComponent {}

  const findMixin = () => ngMocks.findInstance(MixinControlValueAccessor);

  const findNgControl = () => ngMocks.findInstance(NgControl);

  beforeEach(() =>
    MockBuilder([
      MixinControlValueAccessor,
      SomeComponent,
      ReactiveFormsModule,
      FormsModule,
    ])
  );

  describe('should be created', () => {
    it('without a control directive', () =>
      expect(MockRender(SomeComponent).point.componentInstance).toBeTruthy());

    it('with a control directive', () => {
      expect(
        MockRender(`<some-component ngModel></some-component>`).point
          .componentInstance
      ).toBeTruthy();
      ngMocks.flushTestBed();
      expect(
        MockRender(
          `<some-component [formControl]="control"></some-component>`,
          {
            control: new FormControl(),
          }
        ).point.componentInstance
      ).toBeTruthy();
    });
  });

  describe('without a control directive', () => {
    it('should enabled by default', () => {
      MockRender(SomeComponent);

      expect(findMixin().disabled$()).toBe(false);
    });
  });

  describe('with a control directive', () => {
    it('should register itself as the value accessor', () => {
      MockRender(`<some-component ngModel></some-component>`);

      const mixin = findMixin();

      const ngControl = findNgControl();

      expect(mixin).toBe(ngControl.valueAccessor);
    });

    it('should reflect the disabled state of the control', () => {
      MockRender(`<some-component ngModel></some-component>`);

      const mixin = ngMocks.findInstance(MixinControlValueAccessor);

      const ngControl = ngMocks.findInstance(NgControl);

      ngControl.control?.enable();

      expect(mixin.disabled$()).toBe(ngControl.disabled);
      expect(mixin.disabled$()).toBe(false);

      ngControl.control?.disable();

      expect(mixin.disabled$()).toBe(ngControl.disabled);
      expect(mixin.disabled$()).toBe(true);
    });

    it('should reflect the value of the control', async () => {
      const params = { value: 42 };
      const fixture = MockRender(
        `<some-component [ngModel]="value"></some-component>`,
        params
      );

      const mixin = ngMocks.findInstance(MixinControlValueAccessor);

      await fixture.whenStable();

      expect(mixin.value$()).toBe(42);

      params.value = -1;

      fixture.detectChanges();
      await fixture.whenStable();

      expect(mixin.value$()).toBe(-1);
    });

    it('when setting a value via the control (Model -> UI), it should not trigger an UI -> Model update', () => {
      const control = new FormControl<number>(777);

      const fixture = MockRender(
        `<some-component [formControl]="control"></some-component>`,
        {
          control,
        }
      );

      const mixin = ngMocks.findInstance(MixinControlValueAccessor);

      const spyOnChange = jest.fn();

      const onChange = (
        mixin as unknown as { _onChange$: Signal<(value: unknown) => void> }
      )._onChange$();

      mixin.registerOnChange((value: unknown) => {
        spyOnChange(value);
        onChange(value);
      });

      const values: number[] = [];

      expect(mixin.value$()).toBe(777);

      expect(control.value).toBe(777);

      const values$$ = merge(
        control.valueChanges,
        mixin.valueChange$
      ).subscribe({
        next: (x) => values.push(x),
      });

      control.setValue(1);
      fixture.detectChanges();

      control.setValue(99);
      fixture.detectChanges();

      mixin.value = 42;
      fixture.detectChanges();

      // setting the 'same' value should be filtered
      mixin.value = 42;
      fixture.detectChanges();

      values$$.unsubscribe();

      expect(values).toEqual([1, 1, 99, 99, 42, 42]);

      expect(spyOnChange).toHaveBeenCalledTimes(1);

      expect(spyOnChange).toHaveBeenCalledWith(42);
    });

    it('should update the value of the control', async () => {
      const fixture = MockRender(
        `<some-component [formControl]="control"></some-component>`,
        { control: new FormControl() }
      );

      const mixin = ngMocks.findInstance(MixinControlValueAccessor);

      const ngControl = ngMocks.findInstance(NgControl);

      mixin.value = 42;

      fixture.detectChanges();
      await fixture.whenStable();

      expect(mixin.value$()).toBe(42);
      expect(ngControl.value).toBe(42);
    });
  });
});

import { Component } from '@angular/core';
import {
  FormControl,
  FormsModule,
  NgControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';
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

      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(mixin.value$()).toBe(42);

      params.value = -1;

      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(mixin.value$()).toBe(-1);
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

      fixture.detectChanges();
      await fixture.whenStable();

      expect(ngControl.value).toBe(42);
    });
  });
});

import { Component, Input, Signal, inject } from '@angular/core';
import {
  FormControl,
  FormsModule,
  NgControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';
import { noop } from '../util';
import { MixinControlValueAccessor } from './control-value-accessor.mixin';
import exp = require('constants');

jest.mock('../util', () => ({
  ...jest.requireActual('../util'),
  noop: jest.fn(),
}));

describe('A MixinControlValueAccessor instance used as a host directive by a component', () => {
  @Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'custom-checkbox',
    standalone: true,
    template: `<label [for]="id"><ng-content></ng-content></label>
      <input
        [id]="id"
        (change)="cva.value = $event.target.checked"
        (blur)="cva.blur()"
        [checked]="cva.value$() ?? false"
        [disabled]="cva.disabled$() ?? false"
        type="checkbox"
      />`,
    hostDirectives: [
      {
        directive: MixinControlValueAccessor,
        inputs: ['value', 'disabled', 'compareTo'],
        // eslint-disable-next-line @angular-eslint/no-outputs-metadata-property
        outputs: ['valueChange'],
      },
    ],
  })
  class CustomCheckboxComponent {
    public static nextId = 0;

    public cva = inject(MixinControlValueAccessor);

    @Input()
    public id = CustomCheckboxComponent.nextId++;
  }

  @Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'custom-cva',
    standalone: true,
    hostDirectives: [
      {
        directive: MixinControlValueAccessor,
        inputs: ['value', 'disabled', 'compareTo'],
        // eslint-disable-next-line @angular-eslint/no-outputs-metadata-property
        outputs: ['valueChange'],
      },
    ],
  })
  class CustomCvaComponent {}

  const mixin = () => ngMocks.findInstance(MixinControlValueAccessor);

  const checkbox = () =>
    ngMocks.find('input').nativeElement as HTMLInputElement;

  const ngControl = () => ngMocks.findInstance(NgControl);

  const control = () => ngControl().control!;

  beforeEach(() =>
    MockBuilder([
      MixinControlValueAccessor,
      CustomCheckboxComponent,
      CustomCvaComponent,
      ReactiveFormsModule,
      FormsModule,
    ])
  );

  beforeEach(() => {
    (noop as jest.Mock).mockReset();
  });

  it('should query just the current injector when resolving the control directive', () => {
    const control = new FormControl();
    const hostControl = new FormControl();

    MockRender(`<custom-cva></custom-cva>`, undefined, {
      providers: [{ provide: NgControl, useValue: hostControl }],
    });

    expect(mixin().ngControl).toBe(null);

    ngMocks.flushTestBed();

    MockRender(
      `<custom-cva [formControl]="control"></custom-cva>`,
      { control },
      {
        providers: [{ provide: NgControl, useValue: hostControl }],
      }
    );

    expect(mixin().ngControl?.control).toBe(control);
    expect(mixin().ngControl?.control).not.toBe(hostControl);
  });

  it('should compare in memory value per default', async () => {
    const fixture = MockRender(CustomCvaComponent, {});

    const values: unknown[] = [];

    const values$$ = mixin().valueChange$.subscribe({
      next: (x) => values.push(x),
    });

    mixin().value = 42;
    fixture.detectChanges();
    mixin().value = 42;
    fixture.detectChanges();
    mixin().value = { foo: 1 };
    fixture.detectChanges();
    mixin().value = { foo: 1 };
    fixture.detectChanges();
    mixin().value = { foo: 1 };
    fixture.detectChanges();
    mixin().value = true;
    fixture.detectChanges();
    mixin().value = true;
    fixture.detectChanges();

    expect(values).toEqual([42, { foo: 1 }, { foo: 1 }, { foo: 1 }, true]);

    values$$.unsubscribe();
  });

  describe('without a control directive', () => {
    it('should be created', () =>
      expect(
        MockRender(CustomCvaComponent, {}).point.componentInstance
      ).toBeTruthy());

    it('should accept a comparator', () => {
      const fixture = MockRender(CustomCvaComponent, {});

      const values: unknown[] = [];

      const values$$ = mixin().valueChange$.subscribe({
        next: (x) => values.push(x),
      });

      mixin().compareTo = (a, b) => a?.id === b?.id;
      mixin().value = { id: 33 };
      fixture.detectChanges();
      expect(values).toEqual([{ id: 33 }]);

      mixin().value = { id: 33 };
      fixture.detectChanges();
      expect(values).toEqual([{ id: 33 }]);

      mixin().value = { id: 1 };
      fixture.detectChanges();
      expect(values).toEqual([{ id: 33 }, { id: 1 }]);

      values$$.unsubscribe();
    });

    it('should be enabled by default', () => {
      MockRender(CustomCheckboxComponent, {});

      expect(mixin().disabled$()).toBe(false);
      expect(checkbox().disabled).toBe(false);
    });

    it('should be capable of disablement', () => {
      const fixture = MockRender(CustomCheckboxComponent, {});

      mixin().disabled = true;
      fixture.detectChanges();

      expect(mixin().disabled$()).toBe(true);
      expect(checkbox().disabled).toBe(true);
    });

    it('should have undefined as a value per default', () => {
      MockRender(CustomCvaComponent, {});

      expect(mixin().value$()).toBeUndefined();
    });

    it('should have a value', () => {
      const fixture = MockRender(CustomCheckboxComponent, {});

      mixin().value = true;
      fixture.detectChanges();

      expect(mixin().value$()).toBe(true);
      expect(checkbox().checked).toBe(true);

      checkbox().click();

      expect(mixin().value$()).toBe(false);
      expect(checkbox().checked).toBe(false);
    });

    describe('should do nothing effecting the control value accessor interface', () => {
      it('when updating view to model', () => {
        const fixture = MockRender(CustomCvaComponent, {});

        mixin().value = 42;
        fixture.detectChanges();

        expect(noop).toHaveBeenCalledWith(42);
      });

      it('when the view is considered touched', () => {
        const fixture = MockRender(CustomCvaComponent, {});

        (noop as jest.Mock).mockReset();
        mixin().blur();
        fixture.detectChanges();

        expect(noop).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('with a control directive', () => {
    it('should be created', () => {
      expect(
        MockRender(`<custom-cva ngModel></custom-cva>`).point.componentInstance
      ).toBeTruthy();
      ngMocks.flushTestBed();
      expect(
        MockRender(`<custom-cva [formControl]="control"></custom-cva>`, {
          control: new FormControl(),
        }).point.componentInstance
      ).toBeTruthy();
    });

    it('should have its initial value of the control', () => {
      MockRender(`<custom-cva [formControl]="control"></custom-cva>`, {
        control: new FormControl(42),
      });

      expect(mixin().value$()).toBe(42);
    });

    it('should register itself as the value accessor', () => {
      MockRender(`<custom-cva ngModel></custom-cva>`);

      expect(mixin()).toBe(ngControl().valueAccessor);
    });

    it('should update the disabled state of the control', () => {
      const fixture = MockRender(`<custom-cva ngModel></custom-cva>`);

      mixin().disabled = true;
      fixture.detectChanges();

      expect(ngControl().disabled).toBe(true);

      mixin().disabled = false;
      fixture.detectChanges();

      expect(ngControl().disabled).toBe(false);

      mixin().disabled = true;
      fixture.detectChanges();

      expect(ngControl().disabled).toBe(true);
    });

    it('should reflect the disabled state of the control', () => {
      MockRender(`<custom-cva ngModel></custom-cva>`);

      ngControl().control?.enable();

      expect(mixin().disabled$()).toBe(ngControl().disabled);
      expect(mixin().disabled$()).toBe(false);

      ngControl().control?.disable();

      expect(mixin().disabled$()).toBe(ngControl().disabled);
      expect(mixin().disabled$()).toBe(true);

      ngMocks.flushTestBed();
      MockRender(`<custom-cva [formControl]="control"></custom-cva>`, {
        control: new FormControl({ value: 42, disabled: true }),
      });

      expect(mixin().disabled$()).toBe(true);
    });

    it('should reflect the value of the control', async () => {
      const params = { value: 42 };
      const fixture = MockRender(
        `<custom-cva [ngModel]="value"></custom-cva>`,
        params
      );

      await fixture.whenStable();

      expect(mixin().value$()).toBe(42);

      params.value = -1;

      fixture.detectChanges();
      await fixture.whenStable();

      expect(mixin().value$()).toBe(-1);
    });

    it('should not trigger a view to model update after a model to view update', () => {
      const fixture = MockRender(
        `<custom-cva [formControl]="control"></custom-cva>`,
        {
          control: new FormControl<number>(777),
        }
      );

      const spyOnChange = jest.fn();

      const onChange = (
        mixin() as unknown as { _onChange$: Signal<(value: unknown) => void> }
      )._onChange$();

      mixin().registerOnChange((value: unknown) => {
        spyOnChange(value);
        onChange(value);
      });

      const values: number[] = [];

      expect(mixin().value$()).toBe(777);

      expect(control().value).toBe(777);

      const values$$ = mixin().valueChange$.subscribe({
        next: (x) => values.push(x),
      });

      control().setValue(1);
      fixture.detectChanges();

      control().setValue(99);
      fixture.detectChanges();

      mixin().value = 42;
      fixture.detectChanges();

      mixin().value = 42;
      fixture.detectChanges();

      control().setValue(42);
      fixture.detectChanges();

      values$$.unsubscribe();

      expect(values).toEqual([1, 99, 42]);

      expect(spyOnChange).nthCalledWith(1, 42);
    });

    it('should update the value of the control', async () => {
      const fixture = MockRender(
        `<custom-cva [formControl]="control"></custom-cva>`,
        { control: new FormControl() }
      );

      mixin().value = 42;

      fixture.detectChanges();
      await fixture.whenStable();

      expect(mixin().value$()).toBe(42);
      expect(ngControl().value).toBe(42);
    });
  });
});

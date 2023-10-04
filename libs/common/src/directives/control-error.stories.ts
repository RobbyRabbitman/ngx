import {
  AbstractControl,
  FormControl,
  FormGroupDirective,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  applicationConfig,
  moduleMetadata,
  type Meta,
  type StoryObj,
} from '@storybook/angular';
import { delay, of } from 'rxjs';
import {
  ControlError,
  StateMatcher,
  provideErrorStateMatcher,
} from './control-error';

interface ControlErrorArgs {
  error: string | string[];
  label: string;
  control: AbstractControl<unknown>;
  errorStateMatcher: StateMatcher;
}

const meta = {
  title: 'Common/Control Error',
  decorators: [
    moduleMetadata({
      imports: [
        ControlError,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
      ],
    }),
    applicationConfig({ providers: [provideAnimations()] }),
  ],
  render: (args) => ({
    props: args,
    template: `<mat-form-field>
    <mat-label>{{ label }}</mat-label>
    <input matInput [formControl]="control">
    <mat-error *ngxControlError="let errors of control; track: error">{{ errors | json }}</mat-error>
    </mat-form-field>`,
  }),
  args: {
    label: 'some control',
  },
  argTypes: {
    control: {
      table: {
        disable: true,
      },
    },
  },
} satisfies Meta<ControlErrorArgs>;

export default meta;

export const Basic = {
  args: {
    error: 'required',
    control: new FormControl('', Validators.required),
  },
} satisfies StoryObj<ControlErrorArgs>;

export const AsyncValidator = {
  args: {
    error: ['required', 'minlength'],
    control: new FormControl('', undefined, [
      (control) => of(Validators.required(control)).pipe(delay(1000)),
      (control) => of(Validators.minLength(5)(control)).pipe(delay(2000)),
    ]),
  },
} satisfies StoryObj<ControlErrorArgs>;

export const Multiple = {
  args: {
    error: ['required', 'minlength'],
    control: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
    ]),
  },
} satisfies StoryObj<ControlErrorArgs>;

export const ShowErrorOnDirtyOrTouched = {
  args: {
    error: ['required', 'minlength'],
    control: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
    ]),
  },
  decorators: [
    applicationConfig({
      providers: [
        {
          provide: ErrorStateMatcher,
          useValue: {
            isErrorState: (
              control: AbstractControl,
              parent?: FormGroupDirective
            ) =>
              control.invalid &&
              (control.dirty || control.touched || !!parent?.submitted),
          },
        },
        provideErrorStateMatcher(
          (control, parent) =>
            control.invalid &&
            (control.dirty || control.touched || !!parent?.submitted)
        ),
      ],
    }),
  ],
} satisfies StoryObj<ControlErrorArgs>;

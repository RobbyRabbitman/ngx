import {
  AbstractControl,
  FormControl,
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
import { ControlError, StateMatcher } from './control-error';

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
    <mat-error *ngxControlError="error of control as plucked">{{ error }}: {{ plucked | json }}</mat-error>
  </mat-form-field>`,
  }),
  args: {
    label: 'some control',
  },
} satisfies Meta<ControlErrorArgs>;

export default meta;

export const Basic = {
  args: {
    error: 'required',
  },
  render: (args) =>
    meta.render({ ...args, control: new FormControl('', Validators.required) }),
} satisfies StoryObj<ControlErrorArgs>;

export const errorStateMatcher = {
  args: {
    error: 'required',
  },
  render: (args) => ({
    props: {
      ...args,
      control: new FormControl('', Validators.required),
      errorStateMatcher: () => true,
    },
    template: `<mat-form-field>
    <mat-label>{{ label }}</mat-label>
    <input matInput [formControl]="control">
    <mat-error *ngxControlError="error of control as plucked; errorStateMatcher: errorStateMatcher">{{ error }}: {{ plucked | json }}</mat-error>
  </mat-form-field>`,
  }),
  decorators: [
    applicationConfig({
      providers: [
        { provide: ErrorStateMatcher, useValue: { isErrorState: () => true } },
      ],
    }),
  ],
} satisfies StoryObj<ControlErrorArgs>;

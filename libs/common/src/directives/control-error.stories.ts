import { AbstractControl, FormControl, Validators } from '@angular/forms';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { ControlError, StateMatcher } from './control-error';

interface ControlErrorArgs {
  error: string | string[];
  control: AbstractControl<unknown>;
  errorStateMatcher: StateMatcher;
}

export default {
  title: 'Common/Control Error',
  decorators: [
    moduleMetadata({
      imports: [ControlError],
    }),
  ],
  render: (args) => ({
    props: args,
    template: `<div *ngxControlError="error of control as errorMap">{{ error }}: {{ errorMap | json }}</div>`,
  }),
  argTypes: {
    errorStateMatcher: { type: 'function', control: 'function' },
  },
} satisfies Meta<ControlErrorArgs>;

export const Default = {
  args: {
    error: 'required',
    control: new FormControl('', Validators.required),
  },
} satisfies StoryObj<ControlErrorArgs>;

export const ErrorStateMatcher = {
  args: {
    error: 'required',
    control: new FormControl('', Validators.required),
    errorStateMatcher: () => true,
  },
  render: (args) => ({
    props: args,
    template: `<div *ngxControlError="error of control as errorMap; errorStateMatcher: errorStateMatcher">{{ error }}: {{ errorMap | json }}</div>`,
  }),
} satisfies StoryObj<ControlErrorArgs>;

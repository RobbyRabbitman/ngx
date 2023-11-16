import { Meta, StoryObj } from '@storybook/angular';
import { ForIn, ForInTypes } from './for-in';

interface ForInArgs {
  object: ForInTypes<unknown>;
}

const meta = {
  title: 'Common/For in',
  component: ForIn,
  render: (args) => ({
    props: args,
    template: `<div *ngxFor="let key in object">{{ key }}</div>`,
  }),
} satisfies Meta<ForInArgs>;

export default meta;

export const object = {
  args: { object: { foo: 'what', bar: 'ever' } },
} satisfies StoryObj<ForInArgs>;

export const map = {
  args: {
    object: new Map([
      ['foo', 'what'],
      ['bar', 'ever'],
    ]),
  },
} satisfies StoryObj<ForInArgs>;

export const string = {
  args: {
    object: 'whatever',
  },
} satisfies StoryObj<ForInArgs>;

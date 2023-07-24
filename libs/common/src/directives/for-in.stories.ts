import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { ForIn, ForInIterable } from '../directives/for-in';

interface ForInArgs {
  iterable: ForInIterable<unknown>;
}

const meta = {
  title: 'Common/For in',
  decorators: [
    moduleMetadata({
      imports: [ForIn],
    }),
  ],
  render: (args) => ({
    props: args,
    template: `<div *ngxFor="let key in iterable">{{ key }}</div>`,
  }),
} satisfies Meta<ForInArgs>;

export default meta;

export const object = {
  args: { iterable: { foo: 'what', bar: 'ever' } },
} satisfies StoryObj<ForInArgs>;

export const map = {
  args: {
    iterable: new Map([
      ['foo', 'what'],
      ['bar', 'ever'],
    ]),
  },
} satisfies StoryObj<ForInArgs>;

export const string = {
  args: {
    iterable: 'whatever',
  },
} satisfies StoryObj<ForInArgs>;

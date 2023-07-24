import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { ForIn } from '../directives/for-in';

const meta = {
  title: 'Common/For in',
  decorators: [
    moduleMetadata({
      imports: [ForIn],
    }),
  ],
} satisfies Meta<ForIn<unknown>>;

export default meta;

export const Basic = {
  render: (args) => ({
    props: { args, iterable: { foo: 1, bar: 2 } },
    template: `<div *ngxFor="let key in iterable">{{ key }}</div>`,
  }),
} satisfies StoryObj<ForIn<unknown>>;

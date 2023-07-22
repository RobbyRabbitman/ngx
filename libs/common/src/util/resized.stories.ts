import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { Resized } from './resized';

const meta = {
  title: 'Common/Util/Resized',
  decorators: [
    moduleMetadata({
      imports: [Resized],
    }),
  ],
} satisfies Meta<Resized>;

export default meta;

export const resized = {
  render: (args) => ({
    props: { ...args, width: 400, events: [] },
    template: `
    <input type="number" (input)="width = $event.target.valueAsNumber" [value]="width" />px
    <div [style.width.px]="width" (ngxResized)="events.push($event.contentRect.width)">Change my width</div>
    Events: {{ events | json }}
    `,
  }),
} satisfies StoryObj<Resized>;

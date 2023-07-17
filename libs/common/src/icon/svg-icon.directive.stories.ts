import {
  applicationConfig,
  moduleMetadata,
  type Meta,
  type StoryObj,
} from '@storybook/angular';

import { SvgIcon, provideIconSprites } from './svg-icon.directive';

interface Args {
  icon: string;
  sprite: string;
}

const meta: Meta<Args> = {
  title: 'Common/SVG Icon',
  decorators: [
    applicationConfig({
      providers: [
        provideIconSprites(
          {
            name: 'fa-solid',
            path: (icon) => `assets/icons/font-awesome-solid.svg#${icon}`,
          },
          {
            name: 'fa-regular',
            path: (icon) => `assets/icons/font-awesome-regular.svg#${icon}`,
          }
        ),
      ],
    }),
    moduleMetadata({
      imports: [SvgIcon],
    }),
  ],
  argTypes: {
    icon: { control: { type: 'text' } },
    sprite: {
      options: ['fa-regular', 'fa-solid'],
      control: { type: 'select' },
    },
  },
  args: {
    icon: 'user',
    sprite: 'fa-regular',
  },
};

export default meta;

type Story = StoryObj<Args>;

export const SVGIcon: Story = {
  render: (args) => ({
    props: args,
    template: `<svg [ngxSvgIcon]="icon" [sprite]="sprite" height="1em"></svg>`,
  }),
};

import { Directive, Input, inject } from '@angular/core';
import {
  applicationConfig,
  moduleMetadata,
  type Meta,
  type StoryObj,
} from '@storybook/angular';
import { SvgIcon, provideIconSprites } from './svg-icon.directive';

interface SvgIconInputs {
  icon: string;
  sprite: string;
}

interface FontAwesomeIconInputs {
  icon: string;
  type: 'solid' | 'regular';
}

/**
 * Font awesome icon. Inherits {@link SvgIcon}.
 */
@Directive({
  standalone: true,
  selector: 'svg[faIcon]',
  hostDirectives: [{ directive: SvgIcon, inputs: ['ngxSvgIcon:faIcon'] }],
})
class FontAwesomeIcon {
  private readonly svg = inject(SvgIcon);

  public constructor() {
    this.type = 'regular';
  }

  @Input()
  public set type(type: 'solid' | 'regular') {
    this.svg.sprite.set(`fa-${type}`);
  }
}

const meta = {
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
      imports: [SvgIcon, FontAwesomeIcon],
    }),
  ],
  argTypes: {
    icon: { control: { type: 'text' } },
  },
  args: {
    icon: 'newspaper',
  },
} satisfies Meta<SvgIconInputs & FontAwesomeIconInputs>;

export default meta;

export const Basic = {
  argTypes: {
    sprite: {
      options: ['fa-regular', 'fa-solid'],
      control: { type: 'select' },
    },
  },
  args: {
    sprite: 'fa-solid',
  },
  render: (args) => ({
    props: args,
    template: `<svg [ngxSvgIcon]="icon" [sprite]="sprite" height="1em"></svg>`,
  }),
} satisfies StoryObj<SvgIconInputs>;

/**
 * @see {@link FontAwesomeIcon}
 */
export const Custom = {
  argTypes: {
    type: {
      options: ['regular', 'solid'],
      control: { type: 'select' },
    },
  },
  args: {
    type: 'solid',
  },
  render: (args) => ({
    props: args,
    template: `<svg [faIcon]="icon" [type]="type" height="1em"></svg>`,
  }),
} satisfies StoryObj<FontAwesomeIconInputs>;

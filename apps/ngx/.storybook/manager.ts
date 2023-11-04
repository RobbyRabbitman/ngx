import { addons } from '@storybook/manager-api';
import { create } from '@storybook/theming/create';

addons.setConfig({
  theme: create({
    base: 'dark',
    brandTitle: 'NGX',
    brandTarget: '_self',
    brandImage: 'favicon.ico',
  }),
});

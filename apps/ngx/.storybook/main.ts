import type { StorybookConfig } from '@storybook/angular';

const config: StorybookConfig = {
  stories: [
    '../**/*.stories.@(js|jsx|ts|tsx|mdx)',
    '../../../libs/**/*.stories.@(js|jsx|ts|tsx|mdx)',
  ],
  addons: ['@storybook/addon-essentials', '@storybook/addon-storysource'],
  framework: {
    name: '@storybook/angular',
    options: {},
  },
  docs: {
    autodocs: true,
    defaultName: 'Docs',
  },
  staticDirs: ['./public'],
};

export default config;

module.exports = {
  core: {
    builder: 'webpack5',
  },
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  staticDirs: ['../public'],
  addons: [
    '@storybook/preset-create-react-app',
    '@storybook/addon-essentials',
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addon-storysource/register',
    '@storybook/addon-knobs',
    '@storybook/addon-a11y',
    '@storybook/addon-docs/preset',
  ],
};

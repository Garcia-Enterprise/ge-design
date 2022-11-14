module.exports = {
  core: {
    builder: 'webpack5',
  },
  stories: [
    '../src/Intro.stories.mdx',
    '../src/**/*.stories.mdx',
    '../src/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  staticDirs: ['../public'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/preset-create-react-app',
    '@storybook/addon-storysource/register',
    '@storybook/addon-knobs',
    '@storybook/addon-a11y',
    '@storybook/addon-docs/preset',
  ],
  framework: '@storybook/react',
  features: {
    interactionsDebugger: true,
  },
};

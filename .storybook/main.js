module.exports = {
  stories: ['../**/*.stories.js'],
  staticDirs: ['../public'],
  addons: [
    '@storybook/preset-create-react-app',
    '@storybook/addon-actions/register',
    '@storybook/addon-links/register',
    '@storybook/addon-storysource/register',
    '@storybook/addon-knobs/register',
    '@storybook/addon-a11y/register',
    '@storybook/addon-docs/preset',
  ],
};

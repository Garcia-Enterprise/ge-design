import React from 'react';

import { GlobalStyle } from '../src/shared/global';

// Global decorator to apply the styles to all stories
export const decorators = [
  (Story) => (
    <>
      <GlobalStyle />
      <Story />
    </>
  ),
];

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

// import React from 'react';
// import { configure, addDecorator, addParameters } from '@storybook/react';
// import { themes } from '@storybook/theming';
// import { withA11y } from '@storybook/addon-a11y';

// import { GlobalStyle } from '../src/shared/global';

// addDecorator(withA11y);
// addDecorator((story) => (
//   <>
//     <GlobalStyle />
//     {story()}
//   </>
// ));
// addParameters({
//   options: {
//     theme: themes.dark,
//   },
// });

// // automatically import all files ending in *.stories.js|mdx
// configure(
//   [
//     require.context('../src', false, /Intro\.stories\.mdx/),
//     require.context('../src', true, /\.stories\.(js|mdx)$/),
//   ],
//   module
// );

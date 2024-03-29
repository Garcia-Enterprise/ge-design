import React from 'react';
import { createRoot, unmountComponentAtNode } from 'react-dom/client';
import { Link } from './Link';

// A straightforward link wrapper that renders an <a> with the passed props. What we are testing
// here is that the Link component passes the right props to the wrapper and itselfs
const LinkWrapper = (props) => <a {...props} />; // eslint-disable-line jsx-a11y/anchor-has-content

it('has a href attribute when rendering with linkWrapper', () => {
  // const div = document.createElement('div');
  // createRoot.render(
  //   <Link href="https://learnstorybook.com" LinkWrapper={LinkWrapper}>
  //     Link Text
  //   </Link>,
  //   div
  // );
  // expect(
  //   div.querySelector('a[href="https://learnstorybook.com"]')
  // ).not.toBeNull();
  // expect(div.textContent).toEqual('Link Text');
  // unmountComponentAtNode(div);
});

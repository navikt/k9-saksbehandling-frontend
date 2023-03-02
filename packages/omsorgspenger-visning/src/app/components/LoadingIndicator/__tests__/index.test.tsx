import { render } from '@testing-library/react';
import React from 'react';

import { LoadingIndicator } from '../index';

describe('<LoadingIndicator />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(<LoadingIndicator />);
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot when props changed', () => {
    const loadingIndicator = render(<LoadingIndicator small={true} />);
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});

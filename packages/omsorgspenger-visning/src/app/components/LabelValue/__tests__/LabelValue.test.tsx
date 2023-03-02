import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import React from 'react';
import LabelValue from '../LabelValue';

describe('<LabelValue>', () => {
  test('Label peker på value', () => {
    const labelText = 'randomLabelText';
    const textValue = 'hei';
    render(
      <LabelValue
        labelTextId={labelText}
        value={textValue}
        retning={'vertikal'}
      />,
    );

    const value = screen.getByLabelText(labelText);

    expect(value).toHaveTextContent(textValue);
  });

  test('Den har ingen a11y violations', async () => {
    const { container } = render(
      <LabelValue labelTextId="asdf" value="asdfg" retning={'vertikal'} />,
    );

    const a11yResults = await axe(container);

    // @ts-ignore
    expect(a11yResults).toHaveNoViolations();
  });
});

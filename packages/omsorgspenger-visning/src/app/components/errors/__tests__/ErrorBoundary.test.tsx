import { render, screen } from '@testing-library/react';
import React from 'react';
import ErrorBoundary from '../ErrorBoundary';

const ErrorComponent = () => {
  throw new Error();
};

const ikkeLoggErrors = () =>
  jest.spyOn(global.console, 'error').mockImplementation();

describe('<ErrorBoundary>', () => {
  test('Viser ErrorPage dersom det kastes feil i en subkomponent', async () => {
    ikkeLoggErrors();

    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>,
    );

    const feilmelding = await screen.findByText(/det skjedde en uventet feil/i);

    expect(feilmelding).toBeInTheDocument();
  });
});

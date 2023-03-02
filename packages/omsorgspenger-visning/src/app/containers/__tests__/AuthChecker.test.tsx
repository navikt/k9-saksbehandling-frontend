import { render, screen } from '@testing-library/react';
import React from 'react';
import { AuthProvider } from '../../state/auth/AuthProvider';
import AuthChecker from '../AuthChecker';

const mockFetch = (response: Partial<Response>) => {
  (global as any).fetch = jest.fn(() => Promise.resolve(response));
};

const ikkeLogg = () => jest.spyOn(global.console, 'log').mockImplementation();

describe('<AuthChecker>', () => {
  ikkeLogg();

  test('Rendrer ikke innhold hvis 403', async () => {
    mockFetch({
      status: 403,
      json: () => Promise.resolve({}),
    });

    const testinnhold = 'innhold';

    render(
      <AuthProvider>
        <AuthChecker>{testinnhold}</AuthChecker>
      </AuthProvider>,
    );

    const ingenTilgang = await screen.findByText(/du har ikke tilgang/i);
    expect(ingenTilgang).toBeInTheDocument();

    const innholdHvisTilgang = screen.queryByText(testinnhold);
    expect(innholdHvisTilgang).not.toBeInTheDocument();
  });

  test('Rendrer innhold hvis tilgang', async () => {
    mockFetch({
      status: 200,
      json: () => Promise.resolve({ name: 'Test Brukersen ' }),
    });

    const testinnhold = 'innhold';

    render(
      <AuthProvider>
        <AuthChecker>{testinnhold}</AuthChecker>
      </AuthProvider>,
    );

    const innholdHvisTilgang = await screen.findByText(testinnhold);
    expect(innholdHvisTilgang).toBeInTheDocument();

    const ingenTilgang = screen.queryByText(/du har ikke tilgang/i);
    expect(ingenTilgang).not.toBeInTheDocument();
  });

  test('Rendrer feilmelding hvis feil ved innlogging', async () => {
    mockFetch({
      status: 500,
      json: () => Promise.resolve(),
    });

    const testinnhold = 'innhold';

    render(
      <AuthProvider>
        <AuthChecker>{testinnhold}</AuthChecker>
      </AuthProvider>,
    );

    const feilmelding = await screen.findByText(/det skjedde en feil/i);
    expect(feilmelding).toBeInTheDocument();

    const innhold = screen.queryByText(testinnhold);
    expect(innhold).not.toBeInTheDocument();
  });
});

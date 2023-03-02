import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import React from 'react';
import PersonSøk from '../PersonSok';
import { MemoryRouter } from "react-router-dom";

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as Record<string, unknown>),
  useNavigate: () => mockNavigate,
}));

const mockFetch = (response: Partial<Response>) => {
  (global as any).fetch = jest.fn(() => Promise.resolve(response));
};

describe('<PersonSøk>', () => {
  test('Søk på ufullstendig personident gir feilmelding', async () => {
    render(<PersonSøk />);

    const inputElement = screen.getByLabelText(/fødselsnummer/i);
    await userEvent.type(inputElement, '111');

    const søkeknapp = screen.getByRole('button');
    await userEvent.click(søkeknapp);

    const feilmelding = screen.getByText(/11 sifre/i);
    expect(feilmelding).toBeInTheDocument();
  });

  test('Søk på ident som finnes, redirecter til saken', async () => {
    const saksnummer = 'Sk233';

    mockFetch({
      status: 200,
      json: () => Promise.resolve({ saksnummer }),
    });

    render(<MemoryRouter><PersonSøk /></MemoryRouter>);

    const inputElement = screen.getByLabelText(/fødselsnummer/i);
    await userEvent.type(inputElement, '11111111111');

    const søkeknapp = screen.getByRole('button');

    await userEvent.click(søkeknapp);

    await waitFor(() => expect(mockNavigate.mock.calls[0][0]).toBe('sak/Sk233'));
  });

  const testFeilmeldingForStatus = async (
    status: number,
    feilmelding: string | RegExp,
  ) => {
    mockFetch({
      status,
      json: () => Promise.resolve(),
    });

    render(<PersonSøk />);

    const inputElement = screen.getByLabelText(/fødselsnummer/i);
    await userEvent.type(inputElement, '11111111111');

    const søkeknapp = screen.getByRole('button');
    userEvent.click(søkeknapp);

    const beskjed = await screen.findByText(feilmelding);
    expect(beskjed).toBeInTheDocument();
  };

  test('Gir beskjed om man søker på ident som ikke finnes', async () => {
    await testFeilmeldingForStatus(404, /Fant ingen personer/i);
  });

  test('Gir beskjed om man ikke har tilgang til søk', async () => {
    await testFeilmeldingForStatus(403, /Du har ikke tilgang/i);
  });

  test('Gir beskjed om det skjedde en ukjent feil', async () => {
    await testFeilmeldingForStatus(500, /Det skjedde en ukjent feil/i);
  });

  test('Ingen a11y feil', async () => {
    const { container } = render(<PersonSøk />);

    const a11yResults = await axe(container);

    // @ts-ignore
    expect(a11yResults).toHaveNoViolations();
  });
});

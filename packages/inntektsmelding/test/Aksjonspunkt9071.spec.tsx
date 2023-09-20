/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';

import {render, screen, waitFor, cleanup, act} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {rest} from "msw";
import {setupServer} from 'msw/node';
import MainComponent from '../src/ui/MainComponent';
import {alleErMottatt, manglerInntektsmelding} from "../mock/mockedKompletthetsdata";
import ContainerContract from "../src/types/ContainerContract";
import {aksjonspunkt9071Props} from "../mock/inntektsmeldingPropsMock";

describe('9071 - Mangler inntektsmelding', () => {

    const mangler9071Handlers = [rest.get('/tilstand', (req, res, ctx) => res(ctx.json(manglerInntektsmelding)))]
    const alleInntektsmeldingerMottattHandlers = [rest.get('/tilstand', (req, res, ctx) => res(ctx.json(alleErMottatt)))]

    const server = setupServer(...mangler9071Handlers)

    beforeAll(() => server.listen())

    afterEach(() => {
        server.resetHandlers()
        cleanup()
    })

    afterAll(() => server.close());

    const renderMangler9071 = (onFinished = () => undefined) => {
        const mangler9071Props: ContainerContract = {
            ...aksjonspunkt9071Props,
            onFinished,
        }
        return render(<MainComponent data={mangler9071Props} />)
    }

    test('Viser ikke knapp for å sende inn når beslutning ikke er valgt', async () => {
        // ARRANGE
        renderMangler9071()
        await waitFor(() => screen.getByText(/Når kan du gå videre uten inntektsmelding?/i));

        // ASSERT
        expect(screen.getByLabelText(/Nei, avslå periode på grunn av manglende inntektsopplysninger/i)).toBeDefined();
        expect(screen.queryByRole('button', { name: /Fortsett uten inntektsmelding/i })).toBeNull();
        expect(screen.queryByRole('button', { name: /Send purring med varsel om avslag/i })).toBeNull();
    });

    test('Viser riktig knapp når purring er valgt', async () => {
        // ARRANGE
        renderMangler9071()
        await waitFor(() => screen.getByText(/Når kan du gå videre uten inntektsmelding?/i));

        // ACT
        await act(() => userEvent.click(screen.getByLabelText(/Nei, avslå periode på grunn av manglende inntektsopplysninger/i)))


        // ASSERT
        expect(screen.queryByRole('button', { name: /Fortsett uten inntektsmelding/i })).toBeNull();
        expect(screen.getByRole('button', { name: /Avslå Periode/i })).toBeDefined();
    });

    test('Må skrive begrunnelse når man har valgt A-inntekt', async () => {
        // ARRANGE
        renderMangler9071()
        await waitFor(() => screen.getByText(/Når kan du gå videre uten inntektsmelding?/i));

        // ACT
        await act(async () => {
            await userEvent.click(screen.getByText(/ja, bruk a-inntekt for sauefabrikk \(2\) og sauefabrikk \(1\)/i));
            await userEvent.click(screen.getByRole('button', { name: /Fortsett uten inntektsmelding/i }));
        })

        // ASSERT
        expect(screen.getByText('Du må fylle inn en verdi')).toBeDefined();
    });

    test('Kan sende purring med varsel om avslag', async () => {
        // ARRANGE
        const onClickSpy = jest.fn();
        renderMangler9071(onClickSpy)

        await waitFor(() => screen.getByText(/Når kan du gå videre uten inntektsmelding?/i));

        // ACT
        await act(async () => {
            await act(async () => userEvent.click(screen.getByText(/ja, bruk a-inntekt for sauefabrikk \(2\) og sauefabrikk \(1\)/i)));
            await act(async () => userEvent.type(screen.getByLabelText(/Begrunnelse/i), 'Inntektsmelding? LOL! Nei takk'));
            await act(async () => userEvent.click(screen.getByRole('button', { name: /Fortsett uten inntektsmelding/i })));
        })

        // ASSERT
        expect(onClickSpy).toBeCalledWith({
            '@type': '9071',
            kode: '9071',
            begrunnelse: 'Inntektsmelding? LOL! Nei takk',
            perioder: [
                {
                    begrunnelse: 'Inntektsmelding? LOL! Nei takk',
                    periode: '2022-02-01/2022-02-16',
                    fortsett: true,
                    kode: '9071',
                },
            ],
        });
    });

    test('Kan submitte begrunnelse når man har valgt A-inntekt', async () => {
        // ARRANGE
        const onClickSpy = jest.fn();
        renderMangler9071(onClickSpy)

        await waitFor(() => screen.getByText(/Når kan du gå videre uten inntektsmelding?/i));

        // ACT
        await act(async () => {
            await act(() => userEvent.click(screen.getByText(/ja, bruk a-inntekt for sauefabrikk \(2\) og sauefabrikk \(1\)/i)));
            await act(async () => userEvent.type(screen.getByLabelText(/Begrunnelse/i), 'Inntektsmelding? LOL! Nei takk'));
            await act(() => userEvent.click(screen.getByRole('button', { name: /Fortsett uten inntektsmelding/i })));
        })

        // ASSERT
        expect(onClickSpy).toBeCalledWith({
            '@type': '9071',
            kode: '9071',
            begrunnelse: 'Inntektsmelding? LOL! Nei takk',
            perioder: [
                {
                    begrunnelse: 'Inntektsmelding? LOL! Nei takk',
                    periode: '2022-02-01/2022-02-16',
                    fortsett: true,
                    kode: '9071',
                },
            ],
        });
    });
    test('Hvis det tidligere er blitt gjort en vurdering og behandlingen har hoppet tilbake må man kunne løse aksjonspunktet', async () => {
        // ARRANGE
        const onClickSpy = jest.fn();
        // Replace the request handler that the other tests use
        server.resetHandlers(...alleInntektsmeldingerMottattHandlers)
        renderMangler9071(onClickSpy)

        await waitFor(() => screen.getByText(/Når kan du gå videre uten inntektsmelding?/i));

        // ACT
        await act(() => userEvent.click(screen.getByRole('button', { name: /Send inn/i })))

        // ASSERT
        expect(onClickSpy).toBeCalledWith({
            '@type': '9071',
            kode: '9071',
            perioder: [],
        });
    });
});

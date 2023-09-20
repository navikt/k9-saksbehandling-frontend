import React from 'react';

import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {rest} from "msw";
import {setupServer} from 'msw/node';
import MainComponent from '../src/ui/MainComponent';
import inntektsmeldingPropsMock from "../mock/inntektsmeldingPropsMock";
import ContainerContract from "../src/types/ContainerContract";
import {manglerInntektsmelding} from "../mock/mockedKompletthetsdata";

describe('9069 - Mangler inntektsmelding', () => {

    const handlers = [
        rest.get('/tilstand', (req, res, ctx) =>
            res(ctx.json(manglerInntektsmelding))),
    ]
    const server = setupServer(...handlers)

    beforeAll(() => {
        server.listen()
    })

    afterEach(() => {
        server.resetHandlers()
        cleanup();
    });

    afterAll(() => {
        server.close()
    });

    const defaultData: ContainerContract = {
        ...inntektsmeldingPropsMock,
        onFinished: () => undefined,
    };

    const renderMangler9069 = (data?: ContainerContract) => render(<MainComponent data={data || defaultData} />)

    test('Viser ikke knapp for å sende inn når beslutning ikke er valgt', async () => {
        // ARRANGE
        renderMangler9069();
        await waitFor(() => screen.getByText(/Når kan du gå videre uten inntektsmelding?/i));

        // ASSERT
        expect(screen.getByLabelText(/Nei, send purring med varsel om avslag/i)).toBeDefined();
        expect(screen.queryByRole('button', { name: /Fortsett uten inntektsmelding/i })).toBeNull();
        expect(screen.queryByRole('button', { name: /Send purring med varsel om avslag/i })).toBeNull();
    });

    test('Viser riktig knapp når purring er valgt', async () => {
        // ARRANGE
        renderMangler9069();
        await waitFor(() => screen.getByText(/Når kan du gå videre uten inntektsmelding?/i));

        // ACT
        await userEvent.click(screen.getByLabelText(/Nei, send purring med varsel om avslag/i));

        // ASSERT
        expect(screen.queryByRole('button', { name: /Fortsett uten inntektsmelding/i })).toBeNull();
        expect(screen.getByRole('button', { name: /Send purring med varsel om avslag/i })).toBeDefined();
    });

    test('Må skrive begrunnelse når man har valgt A-inntekt', async () => {
        // ARRANGE
        renderMangler9069();
        await waitFor(() => screen.getByText(/Når kan du gå videre uten inntektsmelding?/i));

        // ACT
        await userEvent.click(screen.getByText(/ja, bruk a-inntekt for sauefabrikk \(2\) og sauefabrikk \(1\)/i));
        await userEvent.click(screen.getByRole('button', { name: /Fortsett uten inntektsmelding/i }));

        // ASSERT
        expect(screen.getByText('Du må fylle inn en verdi')).toBeDefined();
    });

    test('Kan sende purring med varsel om avslag', async () => {
        // ARRANGE
        const onClickSpy = jest.fn();
        // eslint-disable-next-line react/jsx-props-no-spreading
        renderMangler9069({...defaultData, onFinished: onClickSpy});

        await waitFor(() => screen.getByText(/Når kan du gå videre uten inntektsmelding?/i));

        // ACT
        await userEvent.click(screen.getByText(/ja, bruk a-inntekt for sauefabrikk \(2\) og sauefabrikk \(1\)/i));
        await userEvent.type(screen.getByLabelText(/Begrunnelse/i), 'Inntektsmelding? LOL! Nei takk');
        await userEvent.click(screen.getByRole('button', { name: /Fortsett uten inntektsmelding/i }));

        // ASSERT
        expect(onClickSpy).toBeCalledWith({
            '@type': '9069',
            kode: '9069',
            begrunnelse: 'Inntektsmelding? LOL! Nei takk',
            perioder: [
                {
                    begrunnelse: 'Inntektsmelding? LOL! Nei takk',
                    periode: '2022-02-01/2022-02-16',
                    fortsett: true,
                    kode: '9069',
                },
            ],
        });
    });

    test('Kan submitte begrunnelse når man har valgt A-inntekt', async () => {
        // ARRANGE
        const onClickSpy = jest.fn();
        // eslint-disable-next-line react/jsx-props-no-spreading
        renderMangler9069({...defaultData, onFinished: onClickSpy});

        await waitFor(() => screen.getByText(/Når kan du gå videre uten inntektsmelding?/i));

        // ACT
        await userEvent.click(screen.getByText(/ja, bruk a-inntekt for sauefabrikk \(2\) og sauefabrikk \(1\)/i));
        await userEvent.type(screen.getByLabelText(/Begrunnelse/i), 'Inntektsmelding? LOL! Nei takk');
        await userEvent.click(screen.getByRole('button', { name: /Fortsett uten inntektsmelding/i }));

        // ASSERT
        expect(onClickSpy).toBeCalledWith({
            '@type': '9069',
            kode: '9069',
            begrunnelse: 'Inntektsmelding? LOL! Nei takk',
            perioder: [
                {
                    begrunnelse: 'Inntektsmelding? LOL! Nei takk',
                    periode: '2022-02-01/2022-02-16',
                    fortsett: true,
                    kode: '9069',
                },
            ],
        });
    });
});

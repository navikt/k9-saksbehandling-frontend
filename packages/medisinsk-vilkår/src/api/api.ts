import { post, HttpErrorHandler, get } from '@navikt/k9-http-utils';
import { Period } from '@navikt/k9-period-utils';
import { Vurderingsversjon } from '../types/Vurdering';
import Vurderingstype from '../types/Vurderingstype';
import { PerioderMedEndringResponse } from '../types/PeriodeMedEndring';
import { RequestPayload } from '../types/RequestPayload';
import { InnleggelsesperiodeResponse } from '../types/InnleggelsesperiodeResponse';
import { InnleggelsesperiodeFormState } from '../ui/components/innleggelsesperiodeForm/InnleggelsesperiodeFormState';

type VurderingsversjonMedType = Partial<Vurderingsversjon> & {
    type: Vurderingstype;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyType = any;

export async function postNyVurdering(
    href: string,
    behandlingUuid: string,
    vurderingsversjonMedType: VurderingsversjonMedType,
    httpErrorHandler: HttpErrorHandler,
    signal?: AbortSignal,
    dryRun?: boolean
): Promise<AnyType> {
    try {
        const { perioder, resultat, tekst, dokumenter, type } = vurderingsversjonMedType;
        return post(
            href,
            {
                behandlingUuid,
                type,
                perioder,
                resultat,
                tekst,
                tilknyttedeDokumenter: dokumenter.map((dokument) => dokument.id),
                dryRun: dryRun || false,
            },
            httpErrorHandler,
            { signal }
        );
    } catch (error) {
        throw new Error(error);
    }
}

export async function postNyVurderingDryRun(
    href: string,
    behandlingUuid: string,
    vurderingsversjonMedType: VurderingsversjonMedType,
    httpErrorHandler: HttpErrorHandler,
    signal?: AbortSignal
): Promise<PerioderMedEndringResponse> {
    return postNyVurdering(href, behandlingUuid, vurderingsversjonMedType, httpErrorHandler, signal, true);
}

export async function postEndreVurdering(
    href: string,
    behandlingUuid: string,
    vurderingsid: string,
    vurderingsversjon: Partial<Vurderingsversjon>,
    httpErrorHandler: HttpErrorHandler,
    signal?: AbortSignal,
    dryRun?: boolean
): Promise<AnyType> {
    try {
        const { perioder, resultat, tekst, dokumenter, versjon } = vurderingsversjon;
        return post(
            href,
            {
                behandlingUuid,
                id: vurderingsid,
                versjon,
                tekst,
                resultat,
                perioder,
                tilknyttedeDokumenter: dokumenter.map((dokument) => dokument.id),
                dryRun: dryRun || false,
            },
            httpErrorHandler,
            { signal }
        );
    } catch (error) {
        throw new Error(error);
    }
}

export async function postEndreVurderingDryRun(
    href: string,
    behandlingUuid: string,
    vurderingsid: string,
    vurderingsversjon: Vurderingsversjon,
    httpErrorHandler: HttpErrorHandler,
    signal?: AbortSignal
): Promise<PerioderMedEndringResponse> {
    return postEndreVurdering(href, behandlingUuid, vurderingsid, vurderingsversjon, httpErrorHandler, signal, true);
}

interface InnleggelsesperioderRequestBody extends RequestPayload {
    perioder: Period[];
}

export interface InnleggelsesperiodeDryRunResponse {
    førerTilRevurdering: boolean;
}

export async function postInnleggelsesperioder(
    href: string,
    body: InnleggelsesperioderRequestBody,
    httpErrorHandler: HttpErrorHandler,
    signal?: AbortSignal,
    dryRun?: boolean
): Promise<AnyType> {
    return post(href, { ...body, dryRun: dryRun || false }, httpErrorHandler, { signal });
}

export async function postInnleggelsesperioderDryRun(
    href: string,
    body: InnleggelsesperioderRequestBody,
    httpErrorHandler: HttpErrorHandler,
    signal?: AbortSignal
): Promise<InnleggelsesperiodeDryRunResponse> {
    return postInnleggelsesperioder(href, body, httpErrorHandler, signal, true);
}

export const getInnleggelsesperioder = (
    href: string,
    httpErrorHandler: HttpErrorHandler,
    controller: AbortController
) =>
    get(href, httpErrorHandler, {
        signal: controller.signal,
    }).then((response: InnleggelsesperiodeResponse) => response);

export const endringerPåvirkerAndreBehandlinger = (
    nyeInnleggelsesperioder,
    href: string,
    requestPayload,
    httpErrorHandler: HttpErrorHandler,
    controller: AbortController
): Promise<InnleggelsesperiodeDryRunResponse> =>
    postInnleggelsesperioderDryRun(
        href,
        { ...requestPayload, perioder: nyeInnleggelsesperioder },
        httpErrorHandler,
        controller.signal
    );

export const lagreInnleggelsesperioder = (
    formState: InnleggelsesperiodeFormState,
    href: string,
    behandlingUuid,
    versjon,
    httpErrorHandler: HttpErrorHandler,
    controller: AbortController
) => {
    let nyeInnleggelsesperioder = [];
    if (formState.innleggelsesperioder?.length > 0) {
        nyeInnleggelsesperioder = formState.innleggelsesperioder
            .filter((periodeWrapper) => periodeWrapper.period?.fom && periodeWrapper.period?.tom)
            .map((periodeWrapper) => new Period(periodeWrapper.period.fom, periodeWrapper.period.tom));
    }

    return postInnleggelsesperioder(
        href,
        { behandlingUuid, versjon, perioder: nyeInnleggelsesperioder },
        httpErrorHandler,
        controller.signal
    );
};

import { Period } from '@navikt/k9-period-utils';

export interface InnleggelsesperiodeFormState {
    innleggelsesperioder: {
        period: Period;
    }[];
}

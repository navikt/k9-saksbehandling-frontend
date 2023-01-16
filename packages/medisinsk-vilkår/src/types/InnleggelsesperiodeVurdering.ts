import { Period } from '@k9-saksbehandling-frontend/period-utils';

interface InnleggelsesperiodeVurdering {
    id: string;
    periode: Period;
    erInnleggelsesperiode: true;
}

export default InnleggelsesperiodeVurdering;

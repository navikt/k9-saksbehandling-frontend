import { Period } from '@k9-saksbehandling-frontend/period-utils';
import Link from './Link';

export interface InnleggelsesperiodeResponse {
    behandlingUuid: string;
    versjon: string;
    perioder: Period[];
    links: Link[];
}

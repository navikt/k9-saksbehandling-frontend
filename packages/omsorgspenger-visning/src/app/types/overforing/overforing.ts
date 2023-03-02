import Dato from '../Dato';
import Personidentifikator from '../Personidentifikator';

export enum OverføringStatus {
  Gjeldende = 'Gjeldende',
  IkkeGjeldende = 'IkkeGjeldende',
}

export interface BegrunnelserForPeriode {
  gjelderFraOgMed: Dato;
  gjelderTilOgMed: Dato;
  begrunnelser: string[];
}

export interface Overføring {
  dagerOverført: number;
  dagerØnsketOverført?: number;
  gjennomført: Date;
  gjelderFraOgMed: Dato;
  gjelderTilOgMed: Dato;
  status: OverføringStatus;
  begrunnelserForPeriode?: BegrunnelserForPeriode[];
  til?: {saksnummer: string; identitetsnummer: Personidentifikator};
  fra?: {saksnummer: string; identitetsnummer: Personidentifikator};
}

export interface Overføringer {
  gitt: Overføring[];
  fått: Overføring[];
}

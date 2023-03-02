import Dato from 'app/types/Dato';
import Personidentifikator from 'app/types/Personidentifikator';

export default interface Fordeling {
  antallDager: number;
  til?: Personidentifikator;
  fra?: Personidentifikator;
  gjelderFraOgMed: Dato;
  gjelderTilOgMed: Dato;
}
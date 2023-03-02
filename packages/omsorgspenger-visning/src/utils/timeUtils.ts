import { Dato } from 'app/types';

const stringToDate = (date: Dato) => new Date(date);

const now = new Date();

export const erPeriodeGjeldende = (fom: Dato, tom: Dato) =>
  stringToDate(fom) <= now && stringToDate(tom) >= now;

export const erDatoTidligere = (dato: Dato) => stringToDate(dato) < now;

export const erDatoSenere = (dato: Dato) => stringToDate(dato) > now;

export const isoDateToLocale = (date: Dato) => new Date(date).toLocaleDateString();
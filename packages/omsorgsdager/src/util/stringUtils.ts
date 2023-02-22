import dayjs from 'dayjs';

export const tekstTilBoolean = (string: string) => {
    if (string !== undefined && string !== null && string.length > 0) {
        return string.toLowerCase() === 'true';
    }
    return false;
};

export const booleanTilTekst = (bool: boolean) => (bool ? 'true' : 'false');

export const safeJSONParse = str => {
    try {
        return JSON.parse(str);
    } catch {
        return null;
    }
};

export const formatereDato = (dato: string): string => dato.replaceAll('-', '.');

export const formatereDatoTilLesemodus = (dato: string): string => dayjs(dato).format('DD.MM.YYYY');

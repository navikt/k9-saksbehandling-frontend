import dayjs from 'dayjs';

export const tekstTilBoolean = (string: string) => {
    if (string !== undefined && string !== null && string.length > 0) {
        return string.toLowerCase() === 'true';
    }
    return false;
};

export const booleanTilTekst = (bool: boolean) => (bool ? 'true' : 'false');

export const safeJSONParse = (str) => {
    try {
        return JSON.parse(str);
    } catch {
        return null;
    }
};

export const formatereDato = (dato: string): string => dato.replaceAll('-', '.');

export const formatereDatoTilLesemodus = (dato: string): string => dayjs(dato).format('DD.MM.YYYY');

export const utledTilgjengeligeÅr = (fraDato: string): { value: string; title: string }[] => {
    const nåværendeÅr = dayjs().year();
    const årFraDato = dayjs(fraDato).year();
    const tidligsteMuligeÅr = årFraDato > nåværendeÅr ? årFraDato : nåværendeÅr;

    const år = [
        { value: 'false', title: 'Utløper ikke' },
    ];

    for (let i = tidligsteMuligeÅr; i <= dayjs().year() + 2; i++) {
        år.push({ value: i.toString(), title: i.toString() });
    }
    return år;
};

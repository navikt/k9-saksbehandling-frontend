import { Period } from '@navikt/k9-period-utils';
import { Dokumenttype } from './Dokument';

export enum StrukturerDokumentFormFieldName {
    INNEHOLDER_MEDISINSKE_OPPLYSNINGER = 'inneholderMedisinskeOpplysninger',
    DATERT = 'datert',
    DUPLIKAT_AV_ID = 'duplikatAvId',
    INNEHOLDER_NYE_DIAGNOSEKODER = 'inneholderNyeDiagnosekoder',
    INNEHOLDER_NYE_INNLEGGELSESPERIODER = 'inneholderNyeInnleggelsesperioder',
    INNLEGGELSESPERIODER = 'innleggelsesperioder',
}

export interface StrukturerDokumentFormState {
    [StrukturerDokumentFormFieldName.INNEHOLDER_MEDISINSKE_OPPLYSNINGER]?: Dokumenttype;
    [StrukturerDokumentFormFieldName.DATERT]: string;
    [StrukturerDokumentFormFieldName.DUPLIKAT_AV_ID]: string;
    [StrukturerDokumentFormFieldName.INNEHOLDER_NYE_DIAGNOSEKODER]: string;
    [StrukturerDokumentFormFieldName.INNEHOLDER_NYE_INNLEGGELSESPERIODER]: string;
    [StrukturerDokumentFormFieldName.INNLEGGELSESPERIODER]: {
        period: Period;
    }[];
}

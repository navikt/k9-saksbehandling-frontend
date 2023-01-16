export enum StepId {
    Dokument = 'dokument',
    TilsynOgPleie = 'tilsynOgPleie',
    ToOmsorgspersoner = 'toOmsorgspersoner',
    LivetsSluttfase = 'livetsSluttfase',
}

interface Step {
    id: StepId;
    title: string;
}

export const dokumentSteg: Step = {
    id: StepId.Dokument,
    title: 'Dokumentasjon av sykdom',
};

export const sluttfaseDokumentSteg: Step = {
    id: StepId.Dokument,
    title: 'Dokumentasjon av livets sluttfase',
};

export const tilsynOgPleieSteg: Step = {
    id: StepId.TilsynOgPleie,
    title: 'Tilsyn og pleie',
};

export const livetsSluttfaseSteg: Step = {
    id: StepId.LivetsSluttfase,
    title: 'Livets sluttfase',
}

export const toOmsorgspersonerSteg: Step = {
    id: StepId.ToOmsorgspersoner,
    title: 'To omsorgspersoner',
};

export default Step;

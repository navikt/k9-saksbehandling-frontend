import React from 'react';

import OverstyrUttakForm from './OverstyrUttakForm';

export enum FieldName {
    BEGRUNNELSE = 'begrunnelse',
    AKTIVITET = 'aktivitet',
    FRA_DATO = 'fraDato',
    TIL_DATO = 'tilDato',
    UTTAKSGRAD = 'uttaksgrad',
}

const aktiviteter = [
    {
        id: '1',
        navn: 'Bedrift1 AS (910909087) Ref#',
        aktivitet: 'aktivitetId1',
        fraDato: '2021-04-01',
        tilDato: '2021-04-14',
        uttaksgrad: 10,
        begrunnelse: 'Bedrift1 begrunnelse',
    },
    {
        id: '2',
        navn: 'Bedreviter1 AS (910909088) Ref#',
        aktivitet: 'aktivitetId2',
        fraDato: '2021-03-23',
        tilDato: '2121-03-31',
        uttaksgrad: 20,
        begrunnelse: 'Bedreviter1 begrunnelse',
    },
    {
        id: '3',
        navn: 'Bedrit1 AS (910909086) Ref#',
        aktivitet: 'aktivitetId3',
        fraDato: '2021-03-09',
        tilDato: '2021-03-22',
        uttaksgrad: 30,
        begrunnelse: 'Bedrit1 begrunnelse',
    },
    {
        id: '4',
        navn: 'Bebreider1 AS (910909085) Ref#',
        aktivitet: 'aktivitetId1',
        fraDato: '2021-03-01',
        tilDato: '2021-03-08',
        uttaksgrad: 40,
        begrunnelse: 'Bebreider1 begrunnelse',
    },
    {
        id: '5',
        navn: 'Bearbeider1 AS (910909084) Ref#',
        aktivitet: 'aktivitetId2',
        fraDato: '2021-04-01',
        tilDato: '2021-04-14',
        uttaksgrad: 50,
        begrunnelse: 'Bearbeider1 begrunnelse',
    },
];

interface OverstyrProps {}

const Overstyr: React.FC<OverstyrProps> = ({}) => {
    // const { erFagytelsetypeLivetsSluttfase } = React.useContext(ContainerContext);
    // const [visNyOverstyringSkjema, setVisNyOverstyringSkjema] = React.useState<boolean>(false);

    return (
        <div>
            <OverstyrUttakForm aktiviteter={aktiviteter} />
        </div>
    );
};

export default Overstyr;

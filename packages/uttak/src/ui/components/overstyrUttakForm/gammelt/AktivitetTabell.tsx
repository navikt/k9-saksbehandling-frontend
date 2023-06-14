import React from 'react';

import { Edit } from '@navikt/ds-icons';
import { Button, Table } from '@navikt/ds-react';
import { OverstyrUttakAktivitet } from './OverstyrUttakFormContent';
import AktivitetRad from './AktivitetRad';

interface AktivitetListeProps {
    aktiviteter: OverstyrUttakAktivitet[];
}
interface AktivitetRadLeseProps {
    aktivitet: OverstyrUttakAktivitet;
}

const tableHeaders = (
    <Table.Header>
        <Table.Row>
            <Table.HeaderCell></Table.HeaderCell>
            <Table.HeaderCell>Aktivitet</Table.HeaderCell>
            <Table.HeaderCell>Fra og med</Table.HeaderCell>
            <Table.HeaderCell>Til og med</Table.HeaderCell>
            <Table.HeaderCell>Uttaksgrad</Table.HeaderCell>
            <Table.HeaderCell>Handlinger</Table.HeaderCell>
        </Table.Row>
    </Table.Header>
);

const AktivitetRadLese: React.FC<AktivitetRadLeseProps> = ({ aktivitet }) => {
    const { id, navn, fraDato, tilDato, uttaksgrad, begrunnelse } = aktivitet;

    return (
        <Table.ExpandableRow key={`aktivitet-rad-${id}`} content={<>{begrunnelse}</>}>
            <Table.DataCell>{navn}</Table.DataCell>
            <Table.DataCell>{fraDato}</Table.DataCell>
            <Table.DataCell>{tilDato}</Table.DataCell>
            <Table.DataCell>{uttaksgrad}</Table.DataCell>
            <Table.DataCell></Table.DataCell>
        </Table.ExpandableRow>
    );
};

export const AktivitetListe: React.FC<AktivitetListeProps> = ({ aktiviteter }) => {
    return (
        <Table>
            {tableHeaders}
            <Table.Body>
                {aktiviteter.map((aktivitet) => (
                    <AktivitetRadLese aktivitet={aktivitet} />
                ))}
            </Table.Body>
        </Table>
    );
};

export default AktivitetListe;

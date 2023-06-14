import React from 'react';

import { Edit } from "@navikt/ds-icons";
import { Button, Table } from '@navikt/ds-react';

interface AktivitetRadProps {
    aktivitet: {
        id: string;
        navn: string;
        fraDato: string;
        tilDato: string;
        uttaksgrad: number;
        begrunnelse: string;
      };
      overstyrId?: string;
      setOverstyrId?: (id: string) => void;
      readonly?: boolean;
}

const AktivitetRad: React.FC<AktivitetRadProps> = ({ aktivitet, overstyrId, setOverstyrId }) => {
    const { id, navn, fraDato, tilDato, uttaksgrad, begrunnelse } = aktivitet;
    console.log("overstyrId", overstyrId)
    return (
        <Table.ExpandableRow key={`aktivitet-rad-${id}`} content={<>{begrunnelse}</>}>
            <Table.DataCell>{navn}</Table.DataCell>
            <Table.DataCell>{fraDato}</Table.DataCell>
            <Table.DataCell>{tilDato}</Table.DataCell>
            <Table.DataCell>{uttaksgrad}</Table.DataCell>
            <Table.DataCell>
                <Button size='small' icon={<Edit aria-hidden />} onClick={() => setOverstyrId(id)} disabled={overstyrId !== ''} />
            </Table.DataCell>
        </Table.ExpandableRow>
    );
};

export default AktivitetRad;

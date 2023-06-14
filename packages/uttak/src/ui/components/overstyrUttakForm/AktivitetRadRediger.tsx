import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Table, Button } from '@navikt/ds-react';
import { Datepicker, TextField, SelectField } from '@navikt/k9-fe-form-utils';
import { TextArea } from '@navikt/k9-fe-form-utils';
import { Edit, Delete } from '@navikt/ds-icons';

import { required } from '../../form/validators';
import { FieldName } from './Overstyr';
import dayjs from 'dayjs';

import styles from './aktivitetRad.css';
import BegrunnelseBoks from './components/BegrunnelseBoks';

interface AktivitetRadRedigerProps {
    index: number;
    aktivIndex: number;
    setAktivIndex: (index: number) => void;
    remove: (index: number) => void;
    erNyOverstyring?: boolean;
    setNyOverstyringIndex?: (index: number) => void;
}

const AktivitetRadRediger: React.FC<AktivitetRadRedigerProps> = ({
    index,
    setAktivIndex,
    aktivIndex,
    remove,
    erNyOverstyring = false,
    setNyOverstyringIndex = () => {},
}) => {
    const [ekspandert, setEkspandert] = React.useState<boolean>(false);

    const { getValues, setValue } = useFormContext();
    const values = getValues(`aktiviteter.${index}`);
    const verdierFørEndring = { ...values };
    const { id, navn, fraDato, tilDato, uttaksgrad, begrunnelse } = values;
    const aktiv = aktivIndex === index;

    const handleAvbryt = () => {
        setAktivIndex(-1);
        if (erNyOverstyring) {
            remove(index);
            setNyOverstyringIndex(-1);
        } else {
            setValue(`aktiviteter.${index}`, verdierFørEndring);
        }
    };

    return (
        <Table.ExpandableRow
            key={`aktivitet-rad-${index}`}
            togglePlacement="right"
            content={
                <div className={styles.begrunnelseWrapper}>
                    {aktiv && (
                        <TextArea
                            id="begrunnelsesfelt"
                            disabled={false}
                            name={`aktiviteter.${index}.${FieldName.BEGRUNNELSE}`}
                            label={'Begrunn endringen'}
                            validators={{ required }}
                            resize={true}
                        />
                    )}
                    {!aktiv && (
                        <BegrunnelseBoks begrunnelse={begrunnelse} saksbehandler="Saks B. Handler" dato="12.34.5678" />
                    )}
                </div>
            }
            open={aktiv || ekspandert}
            onClick={() => {
                if (!aktiv) setEkspandert(!ekspandert);
            }}
        >
            <Table.DataCell>
                {aktiv && (
                    <SelectField
                        label="Aktivitet"
                        hideLabel={true}
                        name={`aktiviteter.${index}.${FieldName.AKTIVITET}`}
                        validators={{ required }}
                        size="small"
                    >
                        <option value="">Velg aktivitet</option>
                        <option value="aktivitetId1">Bedrift AS (910909087) ref#</option>
                        <option value="aktivitetId2">Bedreviter AS (910909088) ref#</option>
                        <option value="aktivitetId3">Bedriten AS (910909089) ref#</option>
                    </SelectField>
                )}
                {!aktiv && navn}
            </Table.DataCell>
            <Table.DataCell>
                {aktiv && (
                    <Datepicker
                        name={`aktiviteter.${index}.${FieldName.FRA_DATO}`}
                        disabled={false}
                        ariaLabel="Fra dato"
                        validators={{ required }}
                        // limitations={{ maxDate: dateConstants.today.toISOString() }}
                        inputId={FieldName.FRA_DATO}
                    />
                )}
                {!aktiv && <>{dayjs(fraDato).format('DD.MM.YYYY')}</>}
            </Table.DataCell>
            <Table.DataCell>
                {aktiv && (
                    <Datepicker
                        name={`aktiviteter.${index}.${FieldName.TIL_DATO}`}
                        disabled={false}
                        ariaLabel="Til dato"
                        // defaultValue=""
                        validators={{ required }}
                        // limitations={{ maxDate: dateConstants.today.toISOString() }}
                        inputId={FieldName.TIL_DATO}
                    />
                )}
                {!aktiv && <>{dayjs(tilDato).format('DD.MM.YYYY')}</>}
            </Table.DataCell>
            <Table.DataCell>
                {aktiv && (
                    <TextField
                        label="Uttaksgrad"
                        hideLabel={true}
                        name={`aktiviteter.${index}.${FieldName.UTTAKSGRAD}`}
                        validators={{ required }}
                        size="small"
                        htmlSize={3}
                    />
                )}
                {!aktiv && <>{uttaksgrad} %</>}
            </Table.DataCell>
            <Table.DataCell>
                {aktiv && (
                    <>
                        <Button size="small" onClick={() => setAktivIndex(-1)}>
                            Lagre
                        </Button>
                        <Button size="small" variant="tertiary" onClick={() => handleAvbryt()}>
                            Avbryt
                        </Button>
                    </>
                )}
                {!aktiv && (
                    <Button
                        size="xsmall"
                        variant="tertiary"
                        disabled={aktivIndex > -1}
                        icon={<Edit aria-hidden />}
                        onClick={() => setAktivIndex(index)}
                    >
                        Endre
                    </Button>
                )}
                {aktivIndex != index && (
                    <Button
                        size="xsmall"
                        variant="tertiary"
                        disabled={aktivIndex > -1}
                        icon={<Delete aria-hidden />}
                        onClick={() => remove(index)}
                    >
                        Slett
                    </Button>
                )}
            </Table.DataCell>
        </Table.ExpandableRow>
    );
};

export default AktivitetRadRediger;

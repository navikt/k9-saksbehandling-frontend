import React from 'react';
import { FormProvider, useForm, useFieldArray } from 'react-hook-form';

import { Form } from '@navikt/ft-plattform-komponenter';
import { Button, Table } from '@navikt/ds-react';
import { PlusIcon } from '@navikt/ft-plattform-komponenter';

import AktivitetRadRediger from './AktivitetRadRediger';

import styles from './overstyrUttakForm.css';
import ContainerContext from '../../context/ContainerContext';

export type OverstyrUttakAktivitet = {
  id: string;
  navn: string;
  fraDato: string;
  tilDato: string;
  uttaksgrad: number;
  begrunnelse: string;
};

interface OverstyrUttakFormProps {
    aktiviteter: OverstyrUttakAktivitet[];
}

const tableHeaders = (
    <Table.Header>
        <Table.Row>
            <Table.HeaderCell>Aktivitet</Table.HeaderCell>
            <Table.HeaderCell>Fra og med</Table.HeaderCell>
            <Table.HeaderCell>Til og med</Table.HeaderCell>
            <Table.HeaderCell>Uttaksgrad</Table.HeaderCell>
            <Table.HeaderCell>Valg for overstyring</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
        </Table.Row>
    </Table.Header>
);

const nyAktivitet: OverstyrUttakAktivitet = {
    id: '',
    navn: '',
    fraDato: '',
    tilDato: '',
    uttaksgrad: 0,
    begrunnelse: '',
};

type FormData = {
    aktiviteter: OverstyrUttakAktivitet[];
};

const OverstyrUttakForm: React.FC<OverstyrUttakFormProps> = ({ aktiviteter }) => {
  const { handleOverstyringAksjonspunkt } = React.useContext(ContainerContext);
  
    const [aktivIndex, setAktivIndex] = React.useState<number>(-1);
    const [nyOverstyringIndex, setNyOverstyringIndex] = React.useState<number>(-1);

    const formMethods = useForm<FormData>({
        reValidateMode: 'onSubmit',
        defaultValues: {
            aktiviteter: aktiviteter,
        },
        mode: 'onChange',
    });

    const {
        control,
        formState: { errors },
        getValues,
    } = formMethods;

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'aktiviteter',
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        const formValues = getValues();
        // console.log('values', formValues);
        handleOverstyringAksjonspunkt(formValues);
    };

    const handleLeggTilOverstyring = () => {
        append(nyAktivitet);
        setAktivIndex(fields.length);
        setNyOverstyringIndex(fields.length);
    };

    return (
        <FormProvider {...formMethods}>
            <Form shouldShowSubmitButton={false} onSubmit={handleSubmit}>
                <div className={styles.leggTilOverstyringKnapp}>
                    <Button
                        variant="secondary"
                        size="small"
                        disabled={aktivIndex > -1}
                        onClick={handleLeggTilOverstyring}
                        icon={<PlusIcon />}
                    >
                        Legg til overstyring av uttaksgrad
                    </Button>
                </div>

                <Table size="small">
                    {tableHeaders}
                    <Table.Body>
                        {fields.map((field, index) => (
                            <AktivitetRadRediger
                                key={field.id}
                                setAktivIndex={setAktivIndex}
                                index={index}
                                aktivIndex={aktivIndex}
                                remove={remove}
                                erNyOverstyring={nyOverstyringIndex === index}
                                setNyOverstyringIndex={setNyOverstyringIndex}
                            />
                        ))}
                    </Table.Body>
                </Table>
                <div className={styles.overstyrUttakFormFooter}>
                    <Button variant="primary" size="small" type="submit" disabled={aktivIndex > -1}>
                        Bekreft og fortsett
                    </Button>
                </div>
            </Form>
        </FormProvider>
    );
};

export default OverstyrUttakForm;

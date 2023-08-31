import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@navikt/ds-react';
import { Datepicker, Form, TextAreaField } from '@navikt/ft-form-hooks';
import styles from './VurderDatoAksjonspunkt.css';
import ContainerContext from '../../context/ContainerContext';

interface FormData {
    virkningsdato: string;
    begrunnelse: string;
}

const VurderDatoAksjonspunkt = () => {
    const { løsAksjonspunktVurderDatoNyRegelUttak } = React.useContext(ContainerContext);
    const formMethods = useForm<FormData>();

    const onSubmit = (data: FormData) => {
        løsAksjonspunktVurderDatoNyRegelUttak(data);
    };

    return (
        <Form formMethods={formMethods} onSubmit={onSubmit}>
            <div className={styles.vurderDatoAksjonspunktContainer}>
                <Datepicker
                    name="virkningsdato"
                    label="Endringsdato"
                    disabledDays={{
                        fromDate: new Date('01.01.2019'),
                    }}
                />
                <TextAreaField name="begrunnelse" label="Begrunnelse" size="small" />
                <Button size="small" type="submit" className={styles.bekreft}>
                    Bekreft og fortsett
                </Button>
            </div>
        </Form>
    );
};

export default VurderDatoAksjonspunkt;

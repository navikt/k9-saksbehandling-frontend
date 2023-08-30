import React from 'react';
import { Button } from '@navikt/ds-react';
import { useForm } from 'react-hook-form';
import ContainerContext from '../../context/ContainerContext';
import { Datepicker, Form } from '@navikt/ft-form-hooks';

interface FormData {
    virkningsdato: string;
    begrunnelse: string;
}

const VurderDatoAksjonspunkt = () => {
    const { løsAksjonspunktVurderDatoNyRegelUttak } = React.useContext(ContainerContext);
    const formMethods = useForm<FormData>();
    const { register } = formMethods;

    const onSubmit = (data: FormData) => {
        løsAksjonspunktVurderDatoNyRegelUttak(data);
    };

    return (
        <Form formMethods={formMethods} onSubmit={onSubmit}>
            <Datepicker name="virkningsdato" />
            <label htmlFor="begrunnelse">Begrunnelse:</label>
            <input type="text" id="begrunnelse" {...register('begrunnelse')} />

            <Button type="submit">Submit</Button>
        </Form>
    );
};

export default VurderDatoAksjonspunkt;

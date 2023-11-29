/*
 * Brukes når aksjonspnkt for å bekrefte overstyring av uttak er atkivt
 */
import React from 'react';

import { FormProvider, useForm, useWatch } from 'react-hook-form';

import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import { Box, Margin, DetailView, LabelledContent, Form } from '@navikt/ft-plattform-komponenter';
import { CheckboxGroup, PeriodpickerList, TextArea, YesOrNoQuestion } from '@navikt/k9-fe-form-utils';
import { Datepicker, RadioGroupPanel } from '@navikt/k9-fe-form-utils';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Select, Table } from '@navikt/ds-react';

import AktivitetRad from './AktivitetRad';
import { OverstyrUttakAktivitet } from './OverstyrUttakFormContent';

const nyAktivitet = {
    id: '',
    navn: '',
    fraDato: '',
    tilDato: '',
    uttaksgrad: 0,
    begrunnelse: '',
};

interface BekreftOverstyringUttakProps {
    aktiviteter: OverstyrUttakAktivitet[];
}

const BekreftOverstyringUttak: React.FC<BekreftOverstyringUttakProps> = ({ aktiviteter }) => {
    // const { erFagytelsetypeLivetsSluttfase } = React.useContext(ContainerContext);
    const [visNyOverstyringSkjema, setVisNyOverstyringSkjema] = React.useState<boolean>(false);
    const [overstyringAktiv, setOverstyringAktiv] = React.useState<boolean>(true);
    const [overstyrId, setOverstyrId] = React.useState<string>('');

    const methods = useForm<FormData>({
        reValidateMode: 'onSubmit',
        defaultValues: {
            // begrunnelse: harAksjonspunktOgVilkarLostTidligere ? informasjonTilLesemodus.begrunnelse : '',
        },
    });

    const {
        formState: { errors },
    } = methods;

    // const handleSubmit = ({ overstyrUttak, aktivitet, fraDato, tilDato, uttaksgrad }) => {
    const handleSubmit = (test) => {
        // if(

        // )
        // console.log('errors', errors, test);
        // event.preventDefault();
        // console.log(overstyrUttak, aktivitet, fraDato, tilDato, uttaksgrad);
    };

    const formMethods = useForm({
        defaultValues: {},
        mode: 'onChange',
    });

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

    if (overstyringAktiv) {
        return (
            <FormProvider {...formMethods}>
                <button onClick={() => setVisNyOverstyringSkjema(!visNyOverstyringSkjema)}>OverstyrNøkkel</button>
                <Form
                    buttonLabel={'Bekreft'}
                    onSubmit={formMethods.handleSubmit(handleSubmit)}
                    // submitButtonDisabled={isSubmitting}
                    // shouldShowSubmitButton={!readOnly}
                >
                    <Table>
                        {tableHeaders}
                        <Table.Body>
                            {aktiviteter.map((aktivitet) => (<></>
                                // <AktivitetRadRediger
                                //     aktivitet={aktivitet}
                                //     overstyrId={overstyrId}
                                //     setOverstyrId={setOverstyrId}
                                // />
                            ))}
                            {/* {overstyrId === 'new' && (
                                <AktivitetRadRediger
                                    aktivitet={nyAktivitet}
                                    overstyrId={overstyrId}
                                    setOverstyrId={setOverstyrId}
                                />
                            )} */}
                        </Table.Body>
                    </Table>
                    {/* <AddButton
                        disabled={overstyrId !== ''}
                        onClick={() => setOverstyrId('new')}
                        label="Legg til overstyring"
                    /> */}
                </Form>
            </FormProvider>
        );
    } else {
        return (
            <div>
                <Table>
                    {tableHeaders}
                    <Table.Body>
                        {aktiviteter.map((aktivitet) => (
                            <AktivitetRad
                                aktivitet={aktivitet}
                                //  setOverstyrId={setOverstyrId}
                                //  overstyrId={overstyrId}
                            />
                        ))}
                    </Table.Body>
                </Table>
                {/* <AddButton onClick={() => setOverstyrId('new')} label="Legg til overstyring" /> */}
            </div>
        );
    }
};

export default BekreftOverstyringUttak;
/*
<FormProvider {...formMethods}>
                <button onClick={() => setVisNyOverstyringSkjema(!visNyOverstyringSkjema)}>OverstyrNøkkel</button>
                {visNyOverstyringSkjema && (
                    <Form
                        buttonLabel={'Bekreft'}
                        onSubmit={formMethods.handleSubmit(handleSubmit)}
                        // submitButtonDisabled={isSubmitting}
                        // shouldShowSubmitButton={!readOnly}
                    >
                        <Box marginTop={Margin.xLarge}>
                            <SelectField
                                label="Aktivitet"
                                description="Filtrer bort AT, FL, SN"
                                name={FieldName.AKTIVITET}
                                validators={{ required }}
                            >
                                <option value="">Velg aktivitet</option>
                                <option value="aktivitetId1">Bedrift AS (910909087) ref#</option>
                                <option value="aktivitetId2">Bedreviter AS (910909088) ref#</option>
                                <option value="aktivitetId3">Bedriten AS (910909089) ref#</option>
                            </SelectField>
                        </Box>
                        <Box marginTop={Margin.xLarge}>
                            <Datepicker
                                name={FieldName.FRA_DATO}
                                disabled={false}
                                label="Fom"
                                defaultValue=""
                                validators={{ required }}
                                // limitations={{ maxDate: dateConstants.today.toISOString() }}
                                inputId={FieldName.FRA_DATO}
                            />
                            <Datepicker
                                name={FieldName.TIL_DATO}
                                disabled={false}
                                label="Tom"
                                defaultValue=""
                                validators={{ required }}
                                // limitations={{ maxDate: dateConstants.today.toISOString() }}
                                inputId={FieldName.TIL_DATO}
                            />
                        </Box>
                        <Box marginTop={Margin.xLarge}>
                            <TextField label="Uttaksgrad" name={FieldName.UTTAKSGRAD} validators={{ required }} />
                        </Box>
                        <Box marginTop={Margin.xLarge}>
                            <TextArea
                                id="begrunnelsesfelt"
                                disabled={false}
                                textareaClass={styles.begrunnelsesfelt}
                                name={FieldName.OVERSTYR_UTTAK}
                                label={'Begrunnelse'}
                                validators={{ required }}
                            />
                        </Box>
                    </Form>
                )}
            </FormProvider>*/

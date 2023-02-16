import { Box, DetailView, Form, Margin } from '@navikt/ft-plattform-komponenter';
import { dateConstants } from '@navikt/k9-date-utils';
import { Datepicker, PeriodpickerList, RadioGroupPanel } from '@navikt/k9-form-utils';
import { get, post } from '@navikt/k9-http-utils';
import { Period } from '@navikt/k9-period-utils';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import { Element } from 'nav-frontend-typografi';
import React, { useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { useMutation, useQuery } from 'react-query';
import {
    endringerPåvirkerAndreBehandlinger,
    getInnleggelsesperioder,
    lagreInnleggelsesperioder,
} from '../../../api/api';
import LinkRel from '../../../constants/LinkRel';
import { DiagnosekodeResponse } from '../../../types/DiagnosekodeResponse';
import { Dokumenttype } from '../../../types/Dokument';
import StrukturerDokumentFormProps from '../../../types/StrukturerDokumentFormProps';
import {
    StrukturerDokumentFormFieldName as FieldName,
    StrukturerDokumentFormState,
} from '../../../types/StrukturerDokumentFormState';
import { lagStrukturertDokument } from '../../../util/dokumentUtils';
import { findLinkByRel } from '../../../util/linkUtils';
import ContainerContext from '../../context/ContainerContext';
import PureDiagnosekodeSelector from '../../form/pure/PureDiagnosekodeSelector';
import { dateIsNotInTheFuture, required } from '../../form/validators';
import AddButton from '../add-button/AddButton';
import DeleteButton from '../delete-button/DeleteButton';
import DokumentKnapp from '../dokument-knapp/DokumentKnapp';
import DuplikatRadiobuttons from '../duplikat-radiobuttons/DuplikatRadiobuttons';
import { InnleggelsesperiodeFormState } from '../innleggelsesperiodeForm/InnleggelsesperiodeFormState';
import styles from './strukturerDokumentForm.css';

export const ikkeDuplikatValue = 'ikkeDuplikat';

const StrukturerDokumentForm = ({
    dokument,
    onSubmit,
    editMode,
    isSubmitting,
    strukturerteDokumenter,
}: StrukturerDokumentFormProps): JSX.Element => {
    const { endpoints, httpErrorHandler, readOnly } = React.useContext(ContainerContext);
    const [selectedDiagnosekoder, setSelectedDiagnosekoder] = useState([]);
    const [showInnleggelsesperioderWarningMessage, setShowInnleggelsesperioderWarningMessage] = React.useState(false);
    const formMethods = useForm<StrukturerDokumentFormState>({
        defaultValues: editMode && {
            [FieldName.INNEHOLDER_MEDISINSKE_OPPLYSNINGER]: dokument.type,
            [FieldName.DATERT]: dokument.datert,
        },
    });
    const controller = useMemo(() => new AbortController(), []);

    const dokumentLink = findLinkByRel(LinkRel.DOKUMENT_INNHOLD, dokument.links);

    const buttonLabel = editMode === true ? 'Oppdater' : 'Bekreft';

    const inneholderMedisinskeOpplysninger = useWatch({
        control: formMethods.control,
        name: FieldName.INNEHOLDER_MEDISINSKE_OPPLYSNINGER,
    });

    const inneholderNyeDiagnosekoder =
        useWatch({
            control: formMethods.control,
            name: FieldName.INNEHOLDER_NYE_DIAGNOSEKODER,
        }) === 'true';

    const inneholderNyeInnleggelsesperioder =
        useWatch({
            control: formMethods.control,
            name: FieldName.INNEHOLDER_NYE_INNLEGGELSESPERIODER,
        }) === 'true';

    useEffect(() => {
        if (inneholderNyeInnleggelsesperioder) {
            formMethods.setValue(FieldName.INNLEGGELSESPERIODER, [{ period: new Period('', '') }]);
        } else {
            formMethods.setValue(FieldName.INNLEGGELSESPERIODER, []);
            setShowInnleggelsesperioderWarningMessage(false);
        }
    }, [inneholderNyeInnleggelsesperioder]);

    const hentDiagnosekoder = () =>
        get<DiagnosekodeResponse>(endpoints.diagnosekoder, httpErrorHandler).then(
            (response: DiagnosekodeResponse) => response
        );

    const { data, refetch } = useQuery('diagnosekodeResponse', hentDiagnosekoder);
    const innleggelsesperioderResponse = useQuery('innleggelsesperioder', () =>
        getInnleggelsesperioder(endpoints.innleggelsesperioder, httpErrorHandler, controller)
    );

    const lagreDiagnosekoder = (nyeDiagnosekoder: string[]) => {
        const { diagnosekoder, links, behandlingUuid, versjon } = data;
        const endreDiagnosekoderLink = findLinkByRel(LinkRel.ENDRE_DIAGNOSEKODER, links);
        return post(
            endreDiagnosekoderLink.href,
            {
                behandlingUuid,
                versjon,
                diagnosekoder: [...new Set([...diagnosekoder, ...nyeDiagnosekoder])],
            },
            httpErrorHandler
        );
    };

    const lagreDiagnosekodeMutation = useMutation(
        (nyeDiagnosekoder: string[]) => lagreDiagnosekoder(nyeDiagnosekoder),
        {
            onSuccess: () => {
                refetch();
            },
        }
    );

    const lagreInnleggelsesperioderMutation = useMutation(
        (formState: InnleggelsesperiodeFormState) => {
            const { behandlingUuid, versjon, links } = innleggelsesperioderResponse.data;
            const { href } = findLinkByRel(LinkRel.ENDRE_INNLEGGELSESPERIODER, links);
            const alleInnleggelsesperioder = {
                innleggelsesperioder: [
                    ...innleggelsesperioderResponse.data?.perioder?.map((period) => ({ period })),
                    ...formState.innleggelsesperioder,
                ],
            };
            return lagreInnleggelsesperioder(
                alleInnleggelsesperioder,
                href,
                behandlingUuid,
                versjon,
                httpErrorHandler,
                controller
            );
        },
        {
            onSuccess: () => {
                innleggelsesperioderResponse.refetch();
            },
        }
    );

    useEffect(() => {
        if (!inneholderNyeDiagnosekoder) {
            setSelectedDiagnosekoder([]);
        }
    }, [inneholderNyeDiagnosekoder]);

    const lagNyttStrukturertDokument = async (formState: StrukturerDokumentFormState) => {
        if (selectedDiagnosekoder.length > 0) {
            await lagreDiagnosekodeMutation.mutateAsync(selectedDiagnosekoder);
        }
        if (formState.innleggelsesperioder.length > 0) {
            await lagreInnleggelsesperioderMutation.mutateAsync({
                innleggelsesperioder: formState.innleggelsesperioder,
            });
        }
        onSubmit(lagStrukturertDokument(formState, dokument));
    };

    return (
        <DetailView title="Om dokumentet">
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <FormProvider {...formMethods}>
                <Form
                    buttonLabel={buttonLabel}
                    onSubmit={formMethods.handleSubmit(lagNyttStrukturertDokument)}
                    submitButtonDisabled={isSubmitting}
                    shouldShowSubmitButton={!readOnly}
                >
                    <Box marginTop={Margin.xLarge}>
                        <DokumentKnapp href={dokumentLink.href} />
                    </Box>
                    <Box marginTop={Margin.xLarge}>
                        <RadioGroupPanel
                            name={FieldName.INNEHOLDER_MEDISINSKE_OPPLYSNINGER}
                            disabled={readOnly}
                            question="Inneholder dokumentet medisinske opplysninger?"
                            radios={[
                                {
                                    label: 'Ja, legeerklæring fra sykehus/spesialisthelsetjenesten',
                                    value: Dokumenttype.LEGEERKLÆRING,
                                },
                                {
                                    label: 'Ja, andre medisinske opplysninger (f.eks. legeerklæring fra fastlege, uttalelse fra psykolog)',
                                    value: Dokumenttype.ANDRE_MEDISINSKE_OPPLYSNINGER,
                                },
                                {
                                    label: 'Dokumentet inneholder ikke medisinske opplysninger',
                                    value: Dokumenttype.MANGLER_MEDISINSKE_OPPLYSNINGER,
                                },
                            ]}
                            validators={{ required }}
                        />
                    </Box>

                    <Box marginTop={Margin.xLarge}>
                        <Datepicker
                            name={FieldName.DATERT}
                            disabled={readOnly}
                            label="Hvilken dato er dokumentet datert?"
                            defaultValue=""
                            validators={{ required, dateIsNotInTheFuture }}
                            limitations={{ maxDate: dateConstants.today.toISOString() }}
                            inputId="datertField"
                        />
                    </Box>
                    <DuplikatRadiobuttons dokument={dokument} strukturerteDokumenter={strukturerteDokumenter} />
                    {inneholderMedisinskeOpplysninger && (
                        <Box marginTop={Margin.xLarge}>
                            <RadioGroupPanel
                                name={FieldName.INNEHOLDER_NYE_DIAGNOSEKODER}
                                disabled={readOnly}
                                question="Er det nye diagnosekoder i dokumentet?"
                                radios={[
                                    {
                                        label: 'Ja',
                                        value: 'true',
                                        id: 'inneholderNyeDiagnosekoderJa',
                                    },
                                    {
                                        label: 'Nei',
                                        value: 'false',
                                        id: 'inneholderNyeDiagnosekoderNei',
                                    },
                                ]}
                                validators={{ required }}
                                horizontal
                            />
                        </Box>
                    )}
                    {inneholderNyeDiagnosekoder && (
                        <Box marginTop={Margin.medium}>
                            <div className={styles.diagnosekodeSelectorContainer}>
                                <PureDiagnosekodeSelector
                                    initialDiagnosekodeValue=""
                                    name="diagnosekode"
                                    onChange={(nyeDiagnosekoder) => {
                                        setSelectedDiagnosekoder(nyeDiagnosekoder);
                                    }}
                                    label="Diagnosekode"
                                    selectedDiagnosekoder={selectedDiagnosekoder}
                                    hideLabel
                                />
                            </div>
                        </Box>
                    )}
                    {inneholderMedisinskeOpplysninger && (
                        <Box marginTop={Margin.xLarge}>
                            <RadioGroupPanel
                                name={FieldName.INNEHOLDER_NYE_INNLEGGELSESPERIODER}
                                disabled={readOnly}
                                question="Er det nye innleggelsesperioder i dokumentet?"
                                radios={[
                                    {
                                        label: 'Ja',
                                        value: 'true',
                                        id: 'inneholderNyeInnleggelsesperioderJa',
                                    },
                                    {
                                        label: 'Nei',
                                        value: 'false',
                                        id: 'inneholderNyeInnleggelsesperioderNei',
                                    },
                                ]}
                                validators={{ required }}
                                horizontal
                            />
                        </Box>
                    )}
                    {inneholderNyeInnleggelsesperioder && (
                        <Box marginTop={Margin.medium}>
                            <div className={styles.innleggelsesperioder}>
                                <PeriodpickerList
                                    name="innleggelsesperioder"
                                    legend="Innleggelsesperioder"
                                    fromDatepickerProps={{
                                        ariaLabel: 'Fra',
                                    }}
                                    toDatepickerProps={{
                                        ariaLabel: 'Til',
                                    }}
                                    afterOnChange={() => {
                                        const initialiserteInnleggelsesperioder = formMethods
                                            .getValues()
                                            .innleggelsesperioder.map(
                                                ({ period }: any) => new Period(period.fom, period.tom)
                                            );
                                        const erAllePerioderGyldige = initialiserteInnleggelsesperioder.every(
                                            (periode) => periode.isValid()
                                        );
                                        if (erAllePerioderGyldige) {
                                            const { href, requestPayload } = findLinkByRel(
                                                LinkRel.ENDRE_INNLEGGELSESPERIODER,
                                                innleggelsesperioderResponse.data.links
                                            );
                                            endringerPåvirkerAndreBehandlinger(
                                                initialiserteInnleggelsesperioder,
                                                href,
                                                requestPayload,
                                                httpErrorHandler,
                                                controller
                                            ).then(({ førerTilRevurdering }) =>
                                                setShowInnleggelsesperioderWarningMessage(førerTilRevurdering)
                                            );
                                        }
                                    }}
                                    defaultValues={[]}
                                    validators={{
                                        overlaps: (periodValue: Period) => {
                                            const innleggelsesperioderFormValue = formMethods
                                                .getValues()
                                                .innleggelsesperioder.filter(
                                                    (periodWrapper: any) => periodWrapper.period !== periodValue
                                                )
                                                .map(({ period }: any) => new Period(period.fom, period.tom));
                                            const { fom, tom } = periodValue;
                                            const period = new Period(fom, tom);
                                            if (period.overlapsWithSomePeriodInList(innleggelsesperioderFormValue)) {
                                                return 'Innleggelsesperiodene kan ikke overlappe';
                                            }
                                            return null;
                                        },
                                        hasEmptyPeriodInputs: (periodValue: Period) => {
                                            const { fom, tom } = periodValue;
                                            if (!fom) {
                                                return 'Fra-dato er påkrevd';
                                            }
                                            if (!tom) {
                                                return 'Til-dato er påkrevd';
                                            }
                                            return null;
                                        },
                                        fomIsBeforeOrSameAsTom: (periodValue: Period) => {
                                            const { fom, tom } = periodValue;
                                            const period = new Period(fom, tom);

                                            if (period.fomIsBeforeOrSameAsTom() === false) {
                                                return 'Fra-dato må være tidligere eller samme som til-dato';
                                            }
                                            return null;
                                        },
                                    }}
                                    renderBeforeFieldArray={(fieldArrayMethods) => (
                                        <>
                                            <Box marginTop={Margin.large} marginBottom={Margin.medium}>
                                                <AddButton
                                                    label="Legg til innleggelsesperiode"
                                                    onClick={() => fieldArrayMethods.append({ fom: '', tom: '' })}
                                                    id="leggTilInnleggelsesperiodeKnapp"
                                                />
                                            </Box>
                                            <Box marginTop={Margin.medium}>
                                                <div className={styles.innleggelsesperiodeForm__pickerLabels}>
                                                    <Element
                                                        className={styles.innleggelsesperiodeForm__firstLabel}
                                                        aria-hidden
                                                    >
                                                        Fra
                                                    </Element>
                                                    <Element aria-hidden>Til</Element>
                                                </div>
                                            </Box>
                                        </>
                                    )}
                                    renderContentAfterElement={(index, numberOfItems, fieldArrayMethods) => (
                                        <DeleteButton onClick={() => fieldArrayMethods.remove(index)} />
                                    )}
                                />
                            </div>

                            {showInnleggelsesperioderWarningMessage && (
                                <Box marginTop={Margin.large}>
                                    <AlertStripeAdvarsel>
                                        Endringene du har gjort på innleggelsesperiodene vil føre til en ny revurdering
                                        av en annen behandling. Påvirker alle søkere.
                                    </AlertStripeAdvarsel>
                                </Box>
                            )}
                        </Box>
                    )}
                </Form>
            </FormProvider>
        </DetailView>
    );
};

export default StrukturerDokumentForm;

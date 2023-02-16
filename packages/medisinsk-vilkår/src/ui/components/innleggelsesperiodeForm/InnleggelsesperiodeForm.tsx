/* eslint-disable react/jsx-props-no-spreading */
import { Box, Form, Margin, PageError } from '@navikt/ft-plattform-komponenter';
import { PeriodpickerList } from '@navikt/k9-form-utils';
import { Period } from '@navikt/k9-period-utils';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { Element } from 'nav-frontend-typografi';
import React, { useEffect, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useMutation, useQuery } from 'react-query';
import {
    endringerPåvirkerAndreBehandlinger,
    getInnleggelsesperioder,
    lagreInnleggelsesperioder,
} from '../../../api/api';
import LinkRel from '../../../constants/LinkRel';
import { findLinkByRel } from '../../../util/linkUtils';
import ContainerContext from '../../context/ContainerContext';
import AddButton from '../add-button/AddButton';
import DeleteButton from '../delete-button/DeleteButton';
import { FieldName } from '../innleggelsesperiodeoversikt/Innleggelsesperiodeoversikt';
import ModalFormWrapper from '../modal-form-wrapper/ModalFormWrapper';
import styles from './innleggelsesperiodeForm.css';
import { InnleggelsesperiodeFormState } from './InnleggelsesperiodeFormState';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyType = any;

interface InnleggelsesperiodeFormProps {
    setModalIsOpen?: (isOpen: boolean) => void;
    handleCloseModal?: () => void;
    setIsFormDirty?: (isFormDirty: boolean) => void;
    onInnleggelsesperioderUpdated?: () => void;
    defaultValues?: {
        [FieldName.INNLEGGELSESPERIODER]: Period[];
    };
}

const InnleggelsesperiodeForm = ({
    setModalIsOpen,
    handleCloseModal,
    setIsFormDirty,
    onInnleggelsesperioderUpdated,
    defaultValues,
}: InnleggelsesperiodeFormProps) => {
    const { endpoints, httpErrorHandler } = React.useContext(ContainerContext);
    const [lagreInnleggelsesperioderFeilet, setLagreInnleggelsesperioderFeilet] = React.useState(false);

    const [showWarningMessage, setShowWarningMessage] = React.useState(false);
    const controller = useMemo(() => new AbortController(), []);
    const hentInnleggelsesperioder = useQuery('innleggelsesperioder', () =>
        getInnleggelsesperioder(endpoints.innleggelsesperioder, httpErrorHandler, controller)
    );
    const innleggelsesperioderResponse = hentInnleggelsesperioder.data;

    const formMethods = useForm({
        defaultValues: {
            [FieldName.INNLEGGELSESPERIODER]:
                defaultValues &&
                defaultValues[FieldName.INNLEGGELSESPERIODER]?.map((innleggelsesPeriode) => ({
                    period: innleggelsesPeriode,
                })),
        },
    });

    const lagreInnleggelsesperioderMutation = useMutation(
        (formState: InnleggelsesperiodeFormState) => {
            const { href } = findLinkByRel(LinkRel.ENDRE_INNLEGGELSESPERIODER, innleggelsesperioderResponse.links);
            const { behandlingUuid, versjon } = innleggelsesperioderResponse;
            return lagreInnleggelsesperioder(formState, href, behandlingUuid, versjon, httpErrorHandler, controller);
        },
        {
            onSuccess: () => {
                onInnleggelsesperioderUpdated?.();
                setModalIsOpen?.(false);
                setShowWarningMessage(false);
            },
            onError: () => {
                setLagreInnleggelsesperioderFeilet(true);
            },
        }
    );

    useEffect(
        () => () => {
            controller.abort();
        },
        []
    );

    const {
        formState: { isDirty },
        getValues,
    } = formMethods;

    useEffect(() => {
        setIsFormDirty?.(isDirty);
    }, [isDirty, setIsFormDirty]);

    const handleSubmit = (formState) => {
        lagreInnleggelsesperioderMutation.mutate(formState);
    };

    const hentInnleggelsesperioderFeilet = lagreInnleggelsesperioderMutation.isError;
    const { isLoading } = lagreInnleggelsesperioderMutation;

    if (hentInnleggelsesperioderFeilet || lagreInnleggelsesperioderFeilet) {
        return <PageError message="Noe gikk galt, vennligst prøv igjen senere" />;
    }

    return (
        <FormProvider {...formMethods}>
            <Form onSubmit={formMethods.handleSubmit(handleSubmit)} shouldShowSubmitButton={false}>
                <ModalFormWrapper title="Innleggelsesperioder">
                    <div className={styles.innleggelsesperiodeForm}>
                        <Box marginTop={Margin.large}>
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
                                    const initialiserteInnleggelsesperioder = getValues().innleggelsesperioder.map(
                                        ({ period }: AnyType) => new Period(period.fom, period.tom)
                                    );
                                    const erAllePerioderGyldige = initialiserteInnleggelsesperioder.every((periode) =>
                                        periode.isValid()
                                    );
                                    if (erAllePerioderGyldige) {
                                        const { href, requestPayload } = findLinkByRel(
                                            LinkRel.ENDRE_INNLEGGELSESPERIODER,
                                            innleggelsesperioderResponse.links
                                        );
                                        endringerPåvirkerAndreBehandlinger(
                                            initialiserteInnleggelsesperioder,
                                            href,
                                            requestPayload,
                                            httpErrorHandler,
                                            controller
                                        ).then(({ førerTilRevurdering }) => setShowWarningMessage(førerTilRevurdering));
                                    }
                                }}
                                defaultValues={defaultValues && defaultValues[FieldName.INNLEGGELSESPERIODER]}
                                validators={{
                                    overlaps: (periodValue: Period) => {
                                        const innleggelsesperioderFormValue = getValues()
                                            .innleggelsesperioder.filter(
                                                (periodWrapper: AnyType) => periodWrapper.period !== periodValue
                                            )
                                            .map(({ period }: AnyType) => new Period(period.fom, period.tom));
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
                            {showWarningMessage && (
                                <Box marginTop={Margin.large}>
                                    <AlertStripeAdvarsel>
                                        Endringene du har gjort på innleggelsesperiodene vil føre til en ny revurdering
                                        av en annen behandling. Påvirker alle søkere.
                                    </AlertStripeAdvarsel>
                                </Box>
                            )}
                        </Box>
                        {!!handleCloseModal && (
                            <Box marginTop={Margin.xLarge}>
                                <div style={{ display: 'flex' }}>
                                    <Hovedknapp spinner={isLoading} disabled={isLoading} autoDisableVedSpinner mini>
                                        Bekreft
                                    </Hovedknapp>
                                    <Knapp
                                        mini
                                        style={{ marginLeft: '1rem' }}
                                        htmlType="button"
                                        onClick={handleCloseModal}
                                        disabled={isLoading}
                                    >
                                        Avbryt
                                    </Knapp>
                                </div>
                            </Box>
                        )}
                    </div>
                </ModalFormWrapper>
            </Form>
        </FormProvider>
    );
};

export default InnleggelsesperiodeForm;

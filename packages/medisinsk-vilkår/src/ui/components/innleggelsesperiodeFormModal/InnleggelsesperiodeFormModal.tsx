import { Alert, Button, Label, Modal } from '@navikt/ds-react';
import { Box, Form, Margin } from '@navikt/ft-plattform-komponenter';
import { PeriodpickerList } from '@navikt/k9-fe-form-utils';
import { Period } from '@navikt/k9-fe-period-utils';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { InnleggelsesperiodeDryRunResponse } from '../../../api/api';
import AddButton from '../add-button/AddButton';
import DeleteButton from '../delete-button/DeleteButton';
import { FieldName } from '../innleggelsesperiodeoversikt/Innleggelsesperiodeoversikt';
import ModalFormWrapper from '../modal-form-wrapper/ModalFormWrapper';
import styles from './innleggelsesperiodeFormModal.css';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyType = any;

interface InnleggelsesperiodeFormModal {
    defaultValues: {
        [FieldName.INNLEGGELSESPERIODER]: Period[];
    };
    setModalIsOpen: (isOpen: boolean) => void;
    onSubmit: (formState) => void;
    isLoading: boolean;
    endringerP√•virkerAndreBehandlinger: (innleggelsesperioder: Period[]) => Promise<InnleggelsesperiodeDryRunResponse>;
}

const InnleggelsesperiodeFormModal = ({
    defaultValues,
    setModalIsOpen,
    onSubmit,
    isLoading,
    endringerP√•virkerAndreBehandlinger,
}: InnleggelsesperiodeFormModal): JSX.Element => {
    const formMethods = useForm({
        defaultValues: {
            [FieldName.INNLEGGELSESPERIODER]: defaultValues[FieldName.INNLEGGELSESPERIODER].map(
                (innleggelsesPeriode) => ({
                    period: innleggelsesPeriode,
                })
            ),
        },
    });

    const {
        formState: { isDirty },
        getValues,
    } = formMethods;

    const [showWarningMessage, setShowWarningMessage] = React.useState(false);

    const handleSubmit = (formState) => {
        onSubmit(formState);
        setModalIsOpen(false);
        setShowWarningMessage(false);
    };

    const handleCloseModal = () => {
        // eslint-disable-next-line no-alert
        if ((isDirty && window.confirm('Du vil miste alle endringer du har gjort')) || !isDirty) {
            setModalIsOpen(false);
            setShowWarningMessage(false);
        }
    };

    return (
        <Modal open closeButton onClose={handleCloseModal} className={styles.innleggelsesperiodeFormModal}>
            <Modal.Content>
                {/* eslint-disable-next-line react/jsx-props-no-spreading */}
                <FormProvider {...formMethods}>
                    <Form onSubmit={formMethods.handleSubmit(handleSubmit)} shouldShowSubmitButton={false}>
                        <ModalFormWrapper title="Innleggelsesperioder">
                            <Box marginTop={Margin.large}>
                                <PeriodpickerList
                                    name="innleggelsesperioder"
                                    legend="Innleggelsesperioder"
                                    fromDatepickerProps={{
                                        hideLabel: true,
                                        label: 'Fra',
                                    }}
                                    toDatepickerProps={{
                                        hideLabel: true,
                                        label: 'Til',
                                    }}
                                    afterOnChange={() => {
                                        const initialiserteInnleggelsesperioder = getValues().innleggelsesperioder.map(
                                            ({ period }: AnyType) => new Period(period.fom, period.tom)
                                        );
                                        const erAllePerioderGyldige = initialiserteInnleggelsesperioder.every(
                                            (periode) => periode.isValid()
                                        );
                                        if (erAllePerioderGyldige) {
                                            endringerP√•virkerAndreBehandlinger(initialiserteInnleggelsesperioder).then(
                                                ({ f√łrerTilRevurdering }) => setShowWarningMessage(f√łrerTilRevurdering)
                                            );
                                        }
                                    }}
                                    defaultValues={defaultValues[FieldName.INNLEGGELSESPERIODER] || []}
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
                                                return 'Fra-dato er p√•krevd';
                                            }
                                            if (!tom) {
                                                return 'Til-dato er p√•krevd';
                                            }
                                            return null;
                                        },
                                        fomIsBeforeOrSameAsTom: (periodValue: Period) => {
                                            const { fom, tom } = periodValue;
                                            const period = new Period(fom, tom);

                                            if (period.fomIsBeforeOrSameAsTom() === false) {
                                                return 'Fra-dato m√• v√¶re tidligere eller samme som til-dato';
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
                                                <div className={styles.innleggelsesperiodeFormModal__pickerLabels}>
                                                    <Label
                                                        size="small"
                                                        className={styles.innleggelsesperiodeFormModal__firstLabel}
                                                        aria-hidden
                                                    >
                                                        Fra
                                                    </Label>
                                                    <Label size="small" aria-hidden>
                                                        Til
                                                    </Label>
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
                                        <Alert size="small" variant="warning">
                                            Endringene du har gjort p√• innleggelsesperiodene vil f√łre til en ny
                                            revurdering av en annen behandling. P√•virker alle s√łkere.
                                        </Alert>
                                    </Box>
                                )}
                            </Box>
                            <Box marginTop={Margin.xLarge}>
                                <div style={{ display: 'flex' }}>
                                    <Button loading={isLoading} disabled={isLoading} size="small">
                                        Bekreft
                                    </Button>
                                    <Button
                                        size="small"
                                        style={{ marginLeft: '1rem' }}
                                        variant="secondary"
                                        onClick={handleCloseModal}
                                        disabled={isLoading}
                                    >
                                        Avbryt
                                    </Button>
                                </div>
                            </Box>
                        </ModalFormWrapper>
                    </Form>
                </FormProvider>
            </Modal.Content>
        </Modal>
    );
};
export default InnleggelsesperiodeFormModal;

/* eslint-disable react/jsx-props-no-spreading */
import { Alert, Label } from '@navikt/ds-react';
import { Box, Margin } from '@navikt/ft-plattform-komponenter';
import { PeriodpickerList } from '@navikt/k9-form-utils';
import { HttpErrorHandler } from '@navikt/k9-http-utils';
import { Period } from '@navikt/k9-period-utils';
import React, { useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { endringerPåvirkerAndreBehandlinger } from '../../../api/api';
import LinkRel from '../../../constants/LinkRel';
import Link from '../../../types/Link';
import { findLinkByRel } from '../../../util/linkUtils';
import AddButton from '../add-button/AddButton';
import DeleteButton from '../delete-button/DeleteButton';
import { FieldName } from '../innleggelsesperiodeoversikt/Innleggelsesperiodeoversikt';
import styles from './innleggelsesperiodeForm.css';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyType = any;

interface InnleggelsesperiodeFormProps {
    defaultValues?: {
        [FieldName.INNLEGGELSESPERIODER]: Period[];
    };
    links: Link[];
    httpErrorHandler: HttpErrorHandler;
    controller: AbortController;
}

const InnleggelsesperiodeForm = ({
    defaultValues,
    links,
    httpErrorHandler,
    controller,
}: InnleggelsesperiodeFormProps) => {
    const [showWarningMessage, setShowWarningMessage] = React.useState(false);

    const { control, getValues } = useFormContext();
    const innleggelsesperioder = useWatch({
        control,
        name: 'innleggelsesperioder',
    });

    useEffect(() => {
        if (innleggelsesperioder.length === 0) {
            setShowWarningMessage(false);
        }
    }, [innleggelsesperioder]);

    return (
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
                            const { href, requestPayload } = findLinkByRel(LinkRel.ENDRE_INNLEGGELSESPERIODER, links);
                            endringerPåvirkerAndreBehandlinger(
                                initialiserteInnleggelsesperioder,
                                href,
                                requestPayload,
                                httpErrorHandler,
                                controller
                            ).then(({ førerTilRevurdering }) => setShowWarningMessage(førerTilRevurdering));
                        }
                    }}
                    defaultValues={defaultValues?.[FieldName.INNLEGGELSESPERIODER] ?? []}
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
                            Endringene du har gjort på innleggelsesperiodene vil føre til en ny revurdering av en annen
                            behandling. Påvirker alle søkere.
                        </Alert>
                    </Box>
                )}
            </Box>
        </div>
    );
};
export default InnleggelsesperiodeForm;

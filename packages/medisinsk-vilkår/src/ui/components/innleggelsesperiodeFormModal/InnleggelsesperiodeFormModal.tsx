/* eslint-disable react/jsx-props-no-spreading */
import { Button, Modal } from '@navikt/ds-react';
import { Box, Form, Margin, PageError } from '@navikt/ft-plattform-komponenter';
import { Period } from '@navikt/k9-period-utils';
import React, { useEffect, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useMutation, useQuery } from 'react-query';
import { getInnleggelsesperioder, lagreInnleggelsesperioder } from '../../../api/api';
import LinkRel from '../../../constants/LinkRel';
import { findLinkByRel } from '../../../util/linkUtils';
import ContainerContext from '../../context/ContainerContext';
import InnleggelsesperiodeForm from '../innleggelsesperiodeForm/InnleggelsesperiodeForm';
import { InnleggelsesperiodeFormState } from '../innleggelsesperiodeForm/InnleggelsesperiodeFormState';
import { FieldName } from '../innleggelsesperiodeoversikt/Innleggelsesperiodeoversikt';
import ModalFormWrapper from '../modal-form-wrapper/ModalFormWrapper';
import styles from './innleggelsesperiodeFormModal.css';

interface InnleggelsesperiodeFormModal {
    setModalIsOpen: (isOpen: boolean) => void;
    onInnleggelsesperioderUpdated: () => void;
    defaultValues: {
        [FieldName.INNLEGGELSESPERIODER]: Period[];
    };
}

const InnleggelsesperiodeFormModal = ({
    setModalIsOpen,
    onInnleggelsesperioderUpdated,
    defaultValues,
}: InnleggelsesperiodeFormModal): JSX.Element => {
    const [isFormDirty, setIsFormDirty] = React.useState(false);

    const { endpoints, httpErrorHandler } = React.useContext(ContainerContext);
    const [lagreInnleggelsesperioderFeilet, setLagreInnleggelsesperioderFeilet] = React.useState(false);

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

    const handleCloseModal = () => {
        // eslint-disable-next-line no-alert
        if ((isFormDirty && window.confirm('Du vil miste alle endringer du har gjort')) || !isFormDirty) {
            setModalIsOpen(false);
        }
    };

    return (
        <Modal open closeButton onClose={handleCloseModal} className={styles.innleggelsesperiodeFormModal}>
            <Modal.Content>
                <FormProvider {...formMethods}>
                    <Form onSubmit={formMethods.handleSubmit(handleSubmit)} shouldShowSubmitButton={false}>
                        <ModalFormWrapper title="Innleggelsesperioder">
                            <InnleggelsesperiodeForm
                                defaultValues={defaultValues}
                                links={innleggelsesperioderResponse.links}
                                httpErrorHandler={httpErrorHandler}
                                controller={controller}
                            />
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

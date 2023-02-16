import { Loader } from '@navikt/ds-react';
import { Box, LinkButton, Margin, TitleWithUnderline } from '@navikt/ft-plattform-komponenter';
import { Period } from '@navikt/k9-period-utils';
import Modal from 'nav-frontend-modal';
import React, { useEffect, useMemo } from 'react';
import { useQuery } from 'react-query';
import { getInnleggelsesperioder } from '../../../api/api';
import { InnleggelsesperiodeResponse } from '../../../types/InnleggelsesperiodeResponse';
import ContainerContext from '../../context/ContainerContext';
import AddButton from '../add-button/AddButton';
import InnleggelsesperiodeFormModal from '../innleggelsesperiodeFormModal/InnleggelsesperiodeFormModal';
import Innleggelsesperiodeliste from '../innleggelsesperiodeliste/Innleggelsesperiodeliste';
import WriteAccessBoundContent from '../write-access-bound-content/WriteAccessBoundContent';
import styles from './innleggelsesperiodeoversikt.css';

export enum FieldName {
    INNLEGGELSESPERIODER = 'innleggelsesperioder',
}

interface InnleggelsesperiodeoversiktProps {
    onInnleggelsesperioderUpdated: () => void;
}

const Innleggelsesperiodeoversikt = ({
    onInnleggelsesperioderUpdated,
}: InnleggelsesperiodeoversiktProps): JSX.Element => {
    const controller = useMemo(() => new AbortController(), []);
    useEffect(() => {
        Modal.setAppElement(document.body);
    }, []);
    const { endpoints, httpErrorHandler } = React.useContext(ContainerContext);
    const [modalIsOpen, setModalIsOpen] = React.useState(false);
    const [innleggelsesperioderResponse, setInnleggelsesperioderResponse] = React.useState<InnleggelsesperiodeResponse>(
        { perioder: [], links: [], versjon: null, behandlingUuid: '' }
    );
    const initializeInnleggelsesperiodeData = (response: InnleggelsesperiodeResponse) => ({
        ...response,
        perioder: response.perioder.map(({ fom, tom }) => new Period(fom, tom)),
    });
    const { isLoading, refetch } = useQuery(
        'innleggelsesperioder',
        () => getInnleggelsesperioder(endpoints.innleggelsesperioder, httpErrorHandler, controller),
        {
            onSuccess(response) {
                setInnleggelsesperioderResponse(initializeInnleggelsesperiodeData(response));
            },
        }
    );

    const innleggelsesperioder = innleggelsesperioderResponse.perioder;
    const innleggelsesperioderDefault = innleggelsesperioder?.length > 0 ? innleggelsesperioder : [new Period('', '')];

    const defaultValues = { [FieldName.INNLEGGELSESPERIODER]: innleggelsesperioderDefault };
    const oppdaterOversikt = () => {
        refetch();
        onInnleggelsesperioderUpdated();
    };

    return (
        <div className={styles.innleggelsesperiodeoversikt}>
            <TitleWithUnderline
                contentAfterTitleRenderer={() => (
                    <>
                        <WriteAccessBoundContent
                            otherRequirementsAreMet={innleggelsesperioder.length > 0}
                            contentRenderer={() => (
                                <LinkButton
                                    className={styles.innleggelsesperiodeoversikt__redigerListeKnapp}
                                    onClick={() => setModalIsOpen(true)}
                                >
                                    Rediger liste
                                </LinkButton>
                            )}
                        />
                        <WriteAccessBoundContent
                            otherRequirementsAreMet={innleggelsesperioder.length === 0}
                            contentRenderer={() => (
                                <AddButton
                                    label="Legg til periode"
                                    onClick={() => setModalIsOpen(true)}
                                    id="leggTilPeriodeKnapp"
                                />
                            )}
                        />
                    </>
                )}
            >
                Innleggelsesperioder
            </TitleWithUnderline>
            {isLoading ? (
                <Loader size="large" />
            ) : (
                <>
                    <Box marginTop={Margin.large}>
                        {innleggelsesperioder.length === 0 && <p>Ingen innleggelsesperioder registrert</p>}
                        {innleggelsesperioder.length > 0 && (
                            <>
                                <Box marginTop={Margin.small}>
                                    <Innleggelsesperiodeliste innleggelsesperioder={innleggelsesperioder} />
                                </Box>
                            </>
                        )}
                    </Box>
                </>
            )}
            {modalIsOpen && (
                <InnleggelsesperiodeFormModal
                    defaultValues={defaultValues}
                    setModalIsOpen={setModalIsOpen}
                    onInnleggelsesperioderUpdated={oppdaterOversikt}
                    // onSubmit={lagreInnleggelsesperioder}
                    // isLoading={isLoading}
                />
            )}
        </div>
    );
};

export default Innleggelsesperiodeoversikt;

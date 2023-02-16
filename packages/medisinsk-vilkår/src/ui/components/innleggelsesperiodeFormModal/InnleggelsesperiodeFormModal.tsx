import { Period } from '@navikt/k9-period-utils';
import Modal from 'nav-frontend-modal';
import React from 'react';
import InnleggelsesperiodeForm from '../innleggelsesperiodeForm/InnleggelsesperiodeForm';
import { FieldName } from '../innleggelsesperiodeoversikt/Innleggelsesperiodeoversikt';
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

    const handleCloseModal = () => {
        // eslint-disable-next-line no-alert
        if ((isFormDirty && window.confirm('Du vil miste alle endringer du har gjort')) || !isFormDirty) {
            setModalIsOpen(false);
        }
    };

    return (
        <Modal
            isOpen
            closeButton
            onRequestClose={handleCloseModal}
            contentLabel="Legg til innleggelsesperiode"
            className={styles.innleggelsesperiodeFormModal}
        >
            <InnleggelsesperiodeForm
                setModalIsOpen={setModalIsOpen}
                handleCloseModal={handleCloseModal}
                setIsFormDirty={setIsFormDirty}
                onInnleggelsesperioderUpdated={onInnleggelsesperioderUpdated}
                defaultValues={defaultValues}
            />
        </Modal>
    );
};
export default InnleggelsesperiodeFormModal;

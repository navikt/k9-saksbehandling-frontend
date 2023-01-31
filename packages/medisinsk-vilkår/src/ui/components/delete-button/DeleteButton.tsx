import * as React from 'react';
import { BucketIcon } from '@navikt/ft-plattform-komponenter';
import styles from './deleteButton.css';

interface DeleteButtonProps {
    onClick: () => void;
}

const DeleteButton = ({ onClick }: DeleteButtonProps): JSX.Element => (
    <div className={styles.deleteButton__container}>
        <button className={styles.deleteButton__button} onClick={onClick} aria-label="Fjern periode" type="button">
            <BucketIcon />
        </button>
    </div>
);

export default DeleteButton;

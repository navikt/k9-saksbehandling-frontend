import { Loader } from '@navikt/ds-react';
import React from 'react';
import styles from './spinner.css';

const Spinner = () => (
    <div className={styles.spinner}>
        <Loader size="large" />
    </div>
);

export default Spinner;

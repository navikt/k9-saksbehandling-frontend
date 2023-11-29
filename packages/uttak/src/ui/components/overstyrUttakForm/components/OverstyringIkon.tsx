import React from 'react';

import OverstyrAktivIkon from '../../icons/key-1-rotert.svg';
import OverstyrInAktivIkon from '../../icons/key-1-rotert-utgraet.svg';

import styles from './overstyringIkon.css';
import { KeyVerticalIcon } from '@navikt/aksel-icons';

interface OverstyringIkonProps {
    erOverstyrer: boolean;
    aktiv: boolean;
    toggleOverstyring: () => void;
}

const OverstyringIkon: React.FC<OverstyringIkonProps> = ({ erOverstyrer, toggleOverstyring }) => {
    if (erOverstyrer) {
        return (
            <a title="Overstyr" href="#" onClick={() => toggleOverstyring()} className={styles.overstyringNokkel}>
                {/* <img src={OverstyrAktivIkon} alt="Overstyr" /> */}
                <KeyVerticalIcon title="Overstyr uttak" />
            </a>
        );
    } else return <img src={OverstyrInAktivIkon} alt="Overstyr" className={styles.overstyringNokkel} />;
};

export default OverstyringIkon;

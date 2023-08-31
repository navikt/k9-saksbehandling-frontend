import { Alert, BodyShort, Label, ReadMore } from '@navikt/ds-react';
import React from 'react';
import VurderDatoAksjonspunkt from './VurderDatoAksjonspunkt';
import styles from './VurderDato.css';

const VurderDato = () => (
    <div className={styles.vurderDatoContainer}>
        <Alert variant="warning" size="small" className="mt-4">
            <Label size="small">Vurder hvilken dato endringer i uttak skal gjelde fra</Label>
            <BodyShort size="small">
                Det er lansert endringer for hvordan utbetalingsgrad settes for nye aktiviteter, ikke yrkesaktiv og kun
                ytelse. Vurder hvilken dato endringene skal gjelde fra i denne saken. Dager før denne datoen vil følge
                gammel praksis.
            </BodyShort>
        </Alert>
        <Alert variant="info" className={styles.info}>
            <ReadMore size="small" header="Hva innebærer endringene i uttak?">
                <BodyShort size="small">
                    Før endring:
                    <ol>
                        <li>Nye aktiviteter blir tatt med ved utregning av utbetalingsgrad og søkers uttaksgrad.</li>
                        <li>{`"Ikke-yrkesaktiv" og "Kun ytelse" har samme utbetalingsgrad som andre aktiviteter.`}</li>
                    </ol>
                    Etter endring:
                    <ol>
                        <li>
                            Nye aktiviteter blir ikke tatt med i utregning av utbetalingsgrad eller søkers uttaksgrad.
                            De vil alltid stå med 0% utbetalingsgrad.
                        </li>
                        <li>
                            {`"Ikke-yrkesaktiv" og "Kun ytelse" får alltid 100% som utbetalingsgrad, hvis det ikke er
                            reduksjon grunnet tilsyn.`}
                        </li>
                    </ol>
                </BodyShort>
            </ReadMore>
        </Alert>
        <VurderDatoAksjonspunkt />
    </div>
);

export default VurderDato;

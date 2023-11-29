import React from 'react';
import { Heading } from '@navikt/ds-react';
import ContainerContract from '../types/ContainerContract';
import lagUttaksperiodeliste from '../util/uttaksperioder';
import UttaksperiodeListe from './components/uttaksperiode-liste/UttaksperiodeListe';
import ContainerContext from './context/ContainerContext';
import Infostripe from './components/infostripe/Infostripe';
import UtsattePerioderStripe from './components/utsattePerioderStripe/UtsattePerioderStripe';
import VurderDato from './components/vurderDato/VurderDato';
import '@navikt/ds-css';
import '@navikt/ft-plattform-komponenter/dist/style.css';
import Overstyr from './components/overstyrUttakForm/Overstyr';

import OverstyringIkon from './components/overstyrUttakForm/components/OverstyringIkon';
import { KeyVerticalIcon } from '@navikt/aksel-icons';
import { OverstyrUttakContextProvider } from './context/OverstyrUttakContext';
import { aksjonspunktVurderDatoKode, aksjonspunktkodeVentAnnenPSBSakKode } from '../constants/Aksjonspunkter';

interface MainComponentProps {
    containerData: ContainerContract;
}

const MainComponent = ({ containerData }: MainComponentProps): JSX.Element => {
    
    const aksjonspunktkodeVentAnnenPSBSak = '9290';
    const { uttaksperioder, aksjonspunktkoder, aksjonspunkter, virkningsdatoUttakNyeRegler, featureToggles, endpoints } = containerData;
    const [redigerVirkningsdato, setRedigervirkningsdato] = React.useState<boolean>(false);
    const aksjonspunktVurderDato = aksjonspunkter?.find((ap) => ap.definisjon.kode === aksjonspunktVurderDatoKode);

    const harVentAnnenPSBSakAksjonspunkt = aksjonspunktkoder?.some(
        (aksjonspunktkode) => aksjonspunktkode === aksjonspunktkodeVentAnnenPSBSakKode
    );
    const harAksjonspunktVurderDatoMedStatusOpprettet = aksjonspunktkoder?.some(
        (aksjonspunktkode) => aksjonspunktkode === aksjonspunktVurderDatoKode
    );
    const [overstyringAktiv, setOverstyringAktiv] = React.useState<boolean>(aksjonspunktkoder.includes('6017'));
    const toggleOverstyring = () => setOverstyringAktiv(!overstyringAktiv);

    // Data som må utledes
    const erOverstyrer = true;

    return (
        <ContainerContext.Provider value={containerData}>
            <Heading size="small" level="1">
                Uttak
                {featureToggles?.OVERSTYRING_UTTAK && (
                    <OverstyringIkon
                        erOverstyrer={erOverstyrer}
                        aktiv={overstyringAktiv}
                        toggleOverstyring={toggleOverstyring}
                    />
                )}
            </Heading>

            <Infostripe harVentAnnenPSBSakAksjonspunkt={harVentAnnenPSBSakAksjonspunkt} />

            <OverstyrUttakContextProvider>
                {erOverstyrer && overstyringAktiv && <Overstyr />}
            </OverstyrUttakContextProvider>

            <UtsattePerioderStripe />
            {harAksjonspunktVurderDatoMedStatusOpprettet && <VurderDato />}
            {virkningsdatoUttakNyeRegler && redigerVirkningsdato && (
                <VurderDato
                    avbryt={() => setRedigervirkningsdato(false)}
                    initialValues={{
                        begrunnelse: aksjonspunktVurderDato?.begrunnelse,
                        virkningsdato: virkningsdatoUttakNyeRegler,
                    }}
                />
            )}
            {!harVentAnnenPSBSakAksjonspunkt && (
                <UttaksperiodeListe
                    uttaksperioder={lagUttaksperiodeliste(uttaksperioder)}
                    redigerVirkningsdatoFunc={() => setRedigervirkningsdato(true)}
                    redigerVirkningsdato={redigerVirkningsdato}
                />
            )}
        </ContainerContext.Provider>
    );
};

export default MainComponent;

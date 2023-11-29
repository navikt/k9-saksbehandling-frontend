import React from 'react';
import ContainerContract from '../types/ContainerContract';
import lagUttaksperiodeliste from '../util/uttaksperioder';
import UttaksperiodeListe from './components/uttaksperiode-liste/UttaksperiodeListe';
import ContainerContext from './context/ContainerContext';
import Infostripe from './components/infostripe/Infostripe';
import UtsattePerioderStripe from './components/utsattePerioderStripe/UtsattePerioderStripe';
import '@navikt/ds-css';
import '@navikt/ft-plattform-komponenter/dist/style.css';
import Overstyr from './components/overstyrUttakForm/Overstyr';

import { Heading } from '@navikt/ds-react';
import OverstyringIkon from './components/overstyrUttakForm/components/OverstyringIkon';
import { KeyVerticalIcon } from '@navikt/aksel-icons';
import { OverstyrUttakContextProvider } from './context/OverstyrUttakContext';

interface MainComponentProps {
    containerData: ContainerContract;
}

const MainComponent = ({ containerData }: MainComponentProps): JSX.Element => {
    const { uttaksperioder, aksjonspunktkoder, featureToggles, endpoints } = containerData;
    const aksjonspunktkodeVentAnnenPSBSak = '9290';
    const harVentAnnenPSBSakAksjonspunkt = aksjonspunktkoder?.some(
        (aksjonspunktkode) => aksjonspunktkode === aksjonspunktkodeVentAnnenPSBSak
    );
    const [overstyringAktiv, setOverstyringAktiv] = React.useState<boolean>(aksjonspunktkoder.includes('6017'));
    const toggleOverstyring = () => setOverstyringAktiv(!overstyringAktiv);

    // Data som må utledes
    const erOverstyrer = true;

    return (
        <ContainerContext.Provider value={containerData}>
            <Heading size="medium">
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
            {!harVentAnnenPSBSakAksjonspunkt && (
                <UttaksperiodeListe uttaksperioder={lagUttaksperiodeliste(uttaksperioder)} />
            )}
        </ContainerContext.Provider>
    );
};

export default MainComponent;

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

interface MainComponentProps {
    containerData: ContainerContract;
}

const MainComponent = ({ containerData }: MainComponentProps): JSX.Element => {
    const { uttaksperioder, aksjonspunktkoder } = containerData;
    const aksjonspunktkodeVentAnnenPSBSak = '9290';
    const aksjonspunktVurderDato = '9291';
    const harVentAnnenPSBSakAksjonspunkt = aksjonspunktkoder?.some(
        (aksjonspunktkode) => aksjonspunktkode === aksjonspunktkodeVentAnnenPSBSak
    );
    const harAksjonspunktVurderDato = aksjonspunktkoder?.some(
        (aksjonspunktkode) => aksjonspunktkode === aksjonspunktVurderDato
    );
    return (
        <ContainerContext.Provider value={containerData}>
            <Heading size="small" level="1">
                Uttak
            </Heading>
            <Infostripe harVentAnnenPSBSakAksjonspunkt={harVentAnnenPSBSakAksjonspunkt} />
            <UtsattePerioderStripe />
            {harAksjonspunktVurderDato && <VurderDato />}
            {!harVentAnnenPSBSakAksjonspunkt && (
                <UttaksperiodeListe uttaksperioder={lagUttaksperiodeliste(uttaksperioder)} />
            )}
        </ContainerContext.Provider>
    );
};

export default MainComponent;

import Uttaksperioder from './Uttaksperioder';
import ArbeidsgiverOpplysninger from './ArbeidsgiverOpplysninger';
import KodeverkMedNavn from './kodeverkMedNavnTsType';

interface ContainerContract {
    uttaksperioder: Uttaksperioder;
    utsattePerioder: string[];
    aktivBehandlingUuid: string;
    arbeidsforhold: Record<string, ArbeidsgiverOpplysninger>;
    aksjonspunktkoder: string[];
    erFagytelsetypeLivetsSluttfase: boolean;
    kodeverkUtenlandsoppholdÅrsak: KodeverkMedNavn[];
    handleOverstyringAksjonspunkt: (data: any) => Promise<any>;
    featureToggles: { [key: string]: boolean }
}

export default ContainerContract;

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
    løsAksjonspunktVurderDatoNyRegelUttak: ({
        begrunnelse,
        virkningsdato,
    }: {
        begrunnelse: string;
        virkningsdato: string;
    }) => void;
    virkningsdatoUttakNyeRegler: string;
}

export default ContainerContract;

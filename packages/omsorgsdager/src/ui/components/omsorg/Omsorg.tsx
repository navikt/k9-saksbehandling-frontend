import { Alert, Button } from '@navikt/ds-react';
import { RadioGroupPanel } from '@navikt/k9-fe-form-utils';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { OmsorgProps } from '../../../types/OmsorgProps';
import { booleanTilTekst, tekstTilBoolean } from '../../../util/stringUtils';
import useFormSessionStorage from '../../../util/useFormSessionStorageUtils';
import { required } from '../../../util/validators';
import AksjonspunktLesemodus from '../aksjonspunkt-lesemodus/AksjonspunktLesemodus';
import styleLesemodus from '../lesemodus/lesemodusboks.css';
import TextArea from '../react-hook-form-wrappers/TextArea';
import VilkarStatus from '../vilkar-status/VilkarStatus';
import styles from './omsorg.css';

type FormData = {
    harOmsorgen: string;
    begrunnelse: string;
    åpenForRedigering: boolean;
};

enum FagYtelseType {
    KRONISK_SYK = 'OMP_KS',
    MIDLERTIDIG_ALENE = 'OMP_MA',
    ALENE_OM_OMSORGEN = 'OMP_AO',
}

const Omsorg: React.FunctionComponent<OmsorgProps> = ({
    behandlingsID,
    fagytelseType,
    aksjonspunktLost,
    barn,
    harBarnSoktForRammevedtakOmKroniskSyk,
    vedtakFattetVilkarOppfylt,
    informasjonOmVilkar,
    losAksjonspunkt,
    informasjonTilLesemodus,
    lesemodus,
    formState,
}) => {
    const barnetEllerBarna = barn.length === 1 ? 'barnet' : 'barna';
    const tekstMidlertidigAlene = {
        instruksjon: 'Vurder om søkeren og den andre forelderen har minst ett felles barn.',
        sporsmalHarOmsorgen: 'Har søkeren og den andre forelderen minst ett felles barn?',
        begrunnelse: 'Vurder om søkeren og den andre forelderen har minst ett felles barn',
    };
    const tekstKroniskSyk = {
        instruksjon: `Vurder om søkeren har omsorgen for ${barnetEllerBarna}.`,
        sporsmalHarOmsorgen: `Har søker omsorgen for ${barnetEllerBarna}?`,
        begrunnelse: `Vurder om søker har omsorgen for ${barnetEllerBarna}`,
        harBarnSoktForRammevedtakOmKroniskSykTekst:
            'Det er allerede innvilget ekstra antall dager for dette barnet. Vurder om søknaden skal henlegge.',
    };
    const tekst = {
        opplysningerFraSoknaden: 'Opplysninger fra søknaden:',
        sokersBarn: 'Søkers barn:',
        beskrivelseTilVedtakVilkar: `Søker har omsorgen for ${barnetEllerBarna}`,
        feilIngenVurdering: 'Resultat må oppgis.',
        instruksjon:
            fagytelseType === FagYtelseType.KRONISK_SYK || fagytelseType === FagYtelseType.ALENE_OM_OMSORGEN
                ? tekstKroniskSyk.instruksjon
                : tekstMidlertidigAlene.instruksjon,
        sporsmalHarOmsorgen:
            fagytelseType === FagYtelseType.KRONISK_SYK || fagytelseType === FagYtelseType.ALENE_OM_OMSORGEN
                ? tekstKroniskSyk.sporsmalHarOmsorgen
                : tekstMidlertidigAlene.sporsmalHarOmsorgen,
        begrunnelse:
            fagytelseType === FagYtelseType.KRONISK_SYK || fagytelseType === FagYtelseType.ALENE_OM_OMSORGEN
                ? tekstKroniskSyk.begrunnelse
                : tekstMidlertidigAlene.begrunnelse,
        begrunnelseLesemodus: 'Vurdering',
    };

    const harAksjonspunktOgVilkarLostTidligere = informasjonTilLesemodus?.begrunnelse.length > 0;

    const methods = useForm<FormData>({
        defaultValues: {
            begrunnelse: harAksjonspunktOgVilkarLostTidligere ? informasjonTilLesemodus.begrunnelse : '',
            harOmsorgen: harAksjonspunktOgVilkarLostTidligere
                ? booleanTilTekst(informasjonTilLesemodus.vilkarOppfylt)
                : '',
            åpenForRedigering: false,
        },
    });

    const {
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
        getValues,
    } = methods;
    const åpenForRedigering = watch('åpenForRedigering');
    const formStateKey = `${behandlingsID}-omsorgenfor`;

    const mellomlagringFormState = useFormSessionStorage(
        formStateKey,
        formState,
        methods.watch,
        methods.setValue,
        lesemodus,
        åpenForRedigering,
        getValues
    );

    const bekreftAksjonspunkt = (data) => {
        if (!errors.begrunnelse && !errors.harOmsorgen && losAksjonspunkt) {
            losAksjonspunkt(data.harOmsorgen, data.begrunnelse);
            setValue('åpenForRedigering', false);

            if (!tekstTilBoolean(data.harOmsorgen))
                mellomlagringFormState.fjerneDataTilknyttetBehandling(behandlingsID);
            else mellomlagringFormState.fjerneState();
        }
    };

    const opplysningerFraSoknaden = (
        <>
            <p>{tekst.opplysningerFraSoknaden}</p>
            <p className={styleLesemodus.label}>{tekst.sokersBarn}</p>
            {barn.map((fnr) => (
                <p className={styles.barnTekst} key={fnr}>
                    {fnr}
                </p>
            ))}
        </>
    );

    if (lesemodus && !vedtakFattetVilkarOppfylt && !åpenForRedigering) {
        return (
            <div className={`${styleLesemodus.lesemodusboks} ${styles.omsorg}`}>
                <AksjonspunktLesemodus
                    aksjonspunktTekst={tekst.instruksjon}
                    harAksjonspunktBlivitLostTidligare={aksjonspunktLost}
                    åpneForRedigereInformasjon={() => setValue('åpenForRedigering', true)}
                />

                {opplysningerFraSoknaden}
                <hr />
                <p className={styleLesemodus.label}>{tekst.begrunnelseLesemodus}</p>
                <p className={styleLesemodus.fritekst}>{informasjonTilLesemodus.begrunnelse}</p>
                <p className={styleLesemodus.label}>{tekst.sporsmalHarOmsorgen}</p>
                <p className={styleLesemodus.text}>{informasjonTilLesemodus.vilkarOppfylt ? 'Ja' : 'Nei'}</p>
            </div>
        );
    }

    return (
        <div className={styles.omsorg}>
            {vedtakFattetVilkarOppfylt && (
                <VilkarStatus
                    vilkarOppfylt={informasjonOmVilkar.vilkarOppfylt}
                    aksjonspunktNavn={informasjonOmVilkar.navnPåAksjonspunkt}
                    vilkarReferanse={informasjonOmVilkar.vilkar}
                    begrunnelse={informasjonOmVilkar.begrunnelse}
                    erVilkaretForOmsorgenFor
                    beskrivelseForOmsorgenFor={tekst.beskrivelseTilVedtakVilkar}
                />
            )}

            {(åpenForRedigering || (!lesemodus && !vedtakFattetVilkarOppfylt)) && (
                <>
                    <Alert variant="warning" size="small">
                        {harBarnSoktForRammevedtakOmKroniskSyk
                            ? tekstKroniskSyk.harBarnSoktForRammevedtakOmKroniskSykTekst
                            : tekst.instruksjon}
                    </Alert>
                    {opplysningerFraSoknaden}

                    <hr />

                    <FormProvider {...methods}>
                        <form className={styles.form} onSubmit={handleSubmit(bekreftAksjonspunkt)}>
                            <TextArea label={tekst.begrunnelse} name="begrunnelse" />

                            <div>
                                <RadioGroupPanel
                                    name="harOmsorgen"
                                    question={tekst.sporsmalHarOmsorgen}
                                    radios={[
                                        {
                                            label: 'Ja',
                                            value: 'true',
                                        },
                                        {
                                            label: 'Nei',
                                            value: 'false',
                                        },
                                    ]}
                                    validators={{ required }}
                                />

                                {errors.harOmsorgen && <p className="typo-feilmelding">{tekst.feilIngenVurdering}</p>}
                            </div>

                            <Button size="small" variant="primary" type="submit">
                                Bekreft og fortsett
                            </Button>
                        </form>
                    </FormProvider>
                </>
            )}
        </div>
    );
};

export default Omsorg;

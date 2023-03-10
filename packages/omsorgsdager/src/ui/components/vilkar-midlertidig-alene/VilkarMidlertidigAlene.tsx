import classNames from 'classnames';
import { Hovedknapp } from 'nav-frontend-knapper';
import { RadioGruppe, SkjemaGruppe } from 'nav-frontend-skjema';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { hanteringAvDatoForDatoVelger } from '../../../util/dateUtils';
import { booleanTilTekst, tekstTilBoolean } from '../../../util/stringUtils';
import useFormSessionStorage from '../../../util/useFormSessionStorageUtils';
import { valideringsFunksjoner } from '../../../util/validationReactHookFormUtils';
import AlertStripeTrekantVarsel from '../alertstripe-trekant-varsel/AlertStripeTrekantVarsel';
import OpplysningerFraSoknad from '../opplysninger-fra-soknad/OpplysningerFraSoknad';
import DatePicker from '../react-hook-form-wrappers/DatePicker';
import RadioButtonWithBooleanValue from '../react-hook-form-wrappers/RadioButton';
import TextArea from '../react-hook-form-wrappers/TextArea';
import styles from './vilkarMidlertidigAlene.css';
import styleLesemodus from '../lesemodus/lesemodusboks.css';
import tekst from './vilkar-midlertidig-alene-tekst';
import { VilkarMidlertidigAleneProps } from '../../../types/VilkarMidlertidigAleneProps';
import VilkarMidlertidigAleneLesemodus from '../vilkar-midlertidig-alene-lesemodus/VilkarMidlertidigAleneLesemodus';
import VilkarStatus from '../vilkar-status/VilkarStatus';
import styleRadioknapper from '../styles/radioknapper/radioknapper.css';

type FormData = {
    begrunnelse: string;
    fraDato: string;
    tilDato: string;
    erSokerenMidlertidigAleneOmOmsorgen: string;
    avslagsArsakErPeriodeErIkkeOverSeksM√•n: string;
    √•penForRedigering: boolean;
};

const VilkarMidlertidigAlene: React.FunctionComponent<VilkarMidlertidigAleneProps> = ({
    behandlingsID,
    aksjonspunktLost,
    lesemodus,
    soknadsopplysninger,
    informasjonTilLesemodus,
    vedtakFattetVilkarOppfylt,
    informasjonOmVilkar,
    losAksjonspunkt,
    formState,
}) => {
    const [harAksjonspunktBlivitLostTidligare] = useState<boolean>(aksjonspunktLost);
    const formStateKey = `${behandlingsID}-utvidetrett-ma`;
    const harAksjonspunktOgVilkarLostTidligere =
        informasjonTilLesemodus.begrunnelse.length > 0 &&
        informasjonTilLesemodus.dato.til.length > 0 &&
        informasjonTilLesemodus.dato.fra.length > 0;

    const methods = useForm<FormData>({
        reValidateMode: 'onSubmit',
        defaultValues: {
            begrunnelse: harAksjonspunktOgVilkarLostTidligere ? informasjonTilLesemodus.begrunnelse : '',
            fraDato: harAksjonspunktOgVilkarLostTidligere
                ? informasjonTilLesemodus.dato.fra
                : soknadsopplysninger.soknadsdato,
            tilDato: harAksjonspunktOgVilkarLostTidligere ? informasjonTilLesemodus.dato.til : 'dd.mm.√•√•√•√•',
            erSokerenMidlertidigAleneOmOmsorgen: harAksjonspunktOgVilkarLostTidligere
                ? booleanTilTekst(informasjonTilLesemodus.vilkarOppfylt)
                : '',
            avslagsArsakErPeriodeErIkkeOverSeksM√•n: harAksjonspunktOgVilkarLostTidligere
                ? booleanTilTekst(informasjonTilLesemodus.avslagsArsakErPeriodeErIkkeOverSeksM√•n)
                : '',
            √•penForRedigering: false,
        },
    });

    const {
        formState: { errors },
        getValues,
        handleSubmit,
        watch,
        setValue,
    } = methods;
    const sokerenMidlertidigAleneOmOmsorgen = watch('erSokerenMidlertidigAleneOmOmsorgen');
    const √•penForRedigering = watch('√•penForRedigering');

    const { erDatoFyltUt, erDatoGyldig, erAvslagsArsakErPeriodeErIkkeOverSeksM√•nGyldig, erDatoSisteDagenI√Öret } =
        valideringsFunksjoner(getValues, 'erSokerenMidlertidigAleneOmOmsorgen');

    const mellomlagringFormState = useFormSessionStorage(
        formStateKey,
        formState,
        methods.watch,
        methods.setValue,
        lesemodus,
        √•penForRedigering,
        getValues
    );

    const bekreftAksjonspunkt = ({
        begrunnelse,
        erSokerenMidlertidigAleneOmOmsorgen,
        avslagsArsakErPeriodeErIkkeOverSeksM√•n,
        fraDato,
        tilDato,
    }) => {
        if (
            !errors.begrunnelse &&
            !errors.fraDato &&
            !errors.tilDato &&
            !errors.erSokerenMidlertidigAleneOmOmsorgen &&
            !errors.avslagsArsakErPeriodeErIkkeOverSeksM√•n
        ) {
            losAksjonspunkt({
                begrunnelse,
                erSokerenMidlertidigAleneOmOmsorgen: tekstTilBoolean(erSokerenMidlertidigAleneOmOmsorgen),
                fra: tekstTilBoolean(erSokerenMidlertidigAleneOmOmsorgen) ? fraDato.replaceAll('.', '-') : '',
                til: tekstTilBoolean(erSokerenMidlertidigAleneOmOmsorgen) ? tilDato.replaceAll('.', '-') : '',
                avslagsArsakErPeriodeErIkkeOverSeksM√•n: tekstTilBoolean(avslagsArsakErPeriodeErIkkeOverSeksM√•n),
            });
            setValue('√•penForRedigering', false);
            mellomlagringFormState.fjerneState();
        }
    };

    return (
        <div
            className={classNames(
                styles.vilkarMidlerTidigAlene,
                lesemodus && !√•penForRedigering && !vedtakFattetVilkarOppfylt && styleLesemodus.lesemodusboks
            )}
        >
            {vedtakFattetVilkarOppfylt && (
                <VilkarStatus
                    vilkarOppfylt={informasjonOmVilkar.vilkarOppfylt}
                    aksjonspunktNavn={informasjonOmVilkar.navnP√•Aksjonspunkt}
                    vilkarReferanse={informasjonOmVilkar.vilkar}
                    begrunnelse={informasjonOmVilkar.begrunnelse}
                    erVilkaretForOmsorgenFor={false}
                />
            )}

            {lesemodus && !√•penForRedigering && !vedtakFattetVilkarOppfylt && (
                <VilkarMidlertidigAleneLesemodus
                    soknadsopplysninger={soknadsopplysninger}
                    informasjonTilLesemodus={informasjonTilLesemodus}
                    harAksjonspunktBlivitLostTidligare={harAksjonspunktBlivitLostTidligare}
                    √•pneForRedigereInformasjon={() => setValue('√•penForRedigering', true)}
                />
            )}

            {(√•penForRedigering || (!lesemodus && !vedtakFattetVilkarOppfylt)) && (
                <>
                    <AlertStripeTrekantVarsel text={tekst.aksjonspunkt} />

                    <OpplysningerFraSoknad periodeTekst="Oppgitt periode" {...soknadsopplysninger} />

                    <FormProvider {...methods}>
                        <form className={styles.form} onSubmit={handleSubmit(bekreftAksjonspunkt)}>
                            <TextArea label={tekst.begrunnelse} name="begrunnelse" />

                            <div>
                                <RadioGruppe
                                    className={styleRadioknapper.horisontalPlassering}
                                    legend={tekst.sporsm√•lVilkarOppfylt}
                                >
                                    <RadioButtonWithBooleanValue
                                        label="Ja"
                                        value="true"
                                        name="erSokerenMidlertidigAleneOmOmsorgen"
                                    />
                                    <RadioButtonWithBooleanValue
                                        label="Nei"
                                        value="false"
                                        name="erSokerenMidlertidigAleneOmOmsorgen"
                                    />
                                </RadioGruppe>
                                {errors.erSokerenMidlertidigAleneOmOmsorgen && (
                                    <p className="typo-feilmelding">{tekst.feilIngenVurdering}</p>
                                )}
                            </div>

                            {sokerenMidlertidigAleneOmOmsorgen !== null &&
                                sokerenMidlertidigAleneOmOmsorgen.length > 0 &&
                                !tekstTilBoolean(sokerenMidlertidigAleneOmOmsorgen) && (
                                    <div>
                                        <RadioGruppe
                                            className={classNames(
                                                styleRadioknapper.horisontalPlassering,
                                                styles.avslagsArsakErPeriodeErIkkeOverSeksM√•n
                                            )}
                                            legend={tekst.velgArsak}
                                        >
                                            <RadioButtonWithBooleanValue
                                                label={tekst.arsakIkkeAleneOmsorg}
                                                value="false"
                                                name="avslagsArsakErPeriodeErIkkeOverSeksM√•n"
                                                valideringsFunksjoner={erAvslagsArsakErPeriodeErIkkeOverSeksM√•nGyldig}
                                            />
                                            <RadioButtonWithBooleanValue
                                                label={tekst.arsakPeriodeIkkeOverSeksM√•n}
                                                value="true"
                                                name="avslagsArsakErPeriodeErIkkeOverSeksM√•n"
                                                valideringsFunksjoner={erAvslagsArsakErPeriodeErIkkeOverSeksM√•nGyldig}
                                            />
                                        </RadioGruppe>
                                        {errors.avslagsArsakErPeriodeErIkkeOverSeksM√•n && (
                                            <p className="typo-feilmelding">{tekst.feilIngen√Örsak}</p>
                                        )}
                                    </div>
                                )}

                            {tekstTilBoolean(sokerenMidlertidigAleneOmOmsorgen) && (
                                <SkjemaGruppe
                                    className={styles.gyldigVedtaksPeriode}
                                    legend={tekst.sporsmalPeriodeVedtakGyldig}
                                    feil={
                                        (errors.fraDato &&
                                            errors.fraDato.type === 'erDatoFyltUt' &&
                                            tekst.feilmedlingManglerFraDato) ||
                                        (errors.fraDato &&
                                            errors.fraDato.type === 'erDatoGyldig' &&
                                            tekst.feilmedlingUgyldigDato) ||
                                        (errors.tilDato &&
                                            errors.tilDato.type === 'erDatoFyltUt' &&
                                            tekst.feilmeldingManglerTilDato) ||
                                        (errors.tilDato &&
                                            errors.tilDato.type === 'erDatoSisteDagenI√Öret' &&
                                            tekst.feilmedlingFeilDato) ||
                                        (errors.tilDato &&
                                            errors.tilDato.type === 'erDatoGyldig' &&
                                            tekst.feilmedlingUgyldigDato)
                                    }
                                >
                                    <DatePicker
                                        titel="Fra"
                                        navn="fraDato"
                                        valideringsFunksjoner={{ erDatoFyltUt, erDatoGyldig }}
                                    />

                                    <DatePicker
                                        titel="Til"
                                        navn="tilDato"
                                        valideringsFunksjoner={{ erDatoFyltUt, erDatoGyldig, erDatoSisteDagenI√Öret }}
                                        begrensningerIKalender={hanteringAvDatoForDatoVelger(
                                            soknadsopplysninger.soknadsdato
                                        )}
                                    />
                                </SkjemaGruppe>
                            )}

                            <Hovedknapp className={styles.bekreftKnapp} htmlType="submit">
                                {' '}
                                {tekst.bekreftFortsettKnapp}
                            </Hovedknapp>
                        </form>
                    </FormProvider>
                </>
            )}
        </div>
    );
};
export default VilkarMidlertidigAlene;

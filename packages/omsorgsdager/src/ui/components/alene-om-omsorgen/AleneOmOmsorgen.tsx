import classNames from 'classnames';
import { Hovedknapp } from 'nav-frontend-knapper';
import { RadioGruppe, SkjemaGruppe } from 'nav-frontend-skjema';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { AleneOmOmsorgenProps } from '../../../types/AleneOmOmsorgenProps';
import { booleanTilTekst, formatereDato, formatereDatoTilLesemodus, tekstTilBoolean } from '../../../util/stringUtils';
import useFormSessionStorage from '../../../util/useFormSessionStorageUtils';
import { valideringsFunksjoner } from '../../../util/validationReactHookFormUtils';
import AleneOmOmsorgenLesemodus from '../alene-om-omsorgen-lesemodus/AleneOmOmsorgenLesemodus';
import AlertStripeTrekantVarsel from '../alertstripe-trekant-varsel/AlertStripeTrekantVarsel';
import styleLesemodus from '../lesemodus/lesemodusboks.css';
import OpplysningerFraSoknad from '../opplysninger-fra-soknad/OpplysningerFraSoknad';
import DatePicker from '../react-hook-form-wrappers/DatePicker';
import RadioButtonWithBooleanValue from '../react-hook-form-wrappers/RadioButton';
import TextArea from '../react-hook-form-wrappers/TextArea';
import styleRadioknapper from '../styles/radioknapper/radioknapper.css';
import styles from '../vilkar-midlertidig-alene/vilkarMidlertidigAlene.css';
import VilkarStatus from '../vilkar-status/VilkarStatus';
import tekst from './alene-om-omsorgen-tekst';

type FormData = {
    begrunnelse: string;
    fraDato: string;
    tilDato: string;
    erSokerenAleneOmOmsorgen: string;
    ├ąpenForRedigering: boolean;
};

const AleneOmOmsorgen: React.FunctionComponent<AleneOmOmsorgenProps> = ({
    behandlingsID,
    aksjonspunktLost,
    lesemodus,
    fraDatoFraSoknad,
    informasjonTilLesemodus,
    vedtakFattetVilkarOppfylt,
    erBehandlingstypeRevurdering,
    informasjonOmVilkar,
    losAksjonspunkt,
    formState,
}) => {
    const formStateKey = `${behandlingsID}-utvidetrett-alene-om-omsorgen`;
    const harAksjonspunktOgVilkarLostTidligere =
        informasjonTilLesemodus?.fraDato.length > 0 && informasjonTilLesemodus?.begrunnelse.length > 0;

    const methods = useForm<FormData>({
        reValidateMode: 'onSubmit',
        defaultValues: {
            begrunnelse: harAksjonspunktOgVilkarLostTidligere ? informasjonTilLesemodus.begrunnelse : '',
            fraDato: harAksjonspunktOgVilkarLostTidligere
                ? formatereDato(informasjonTilLesemodus.fraDato)
                : 'dd.mm.├ą├ą├ą├ą',
            tilDato: harAksjonspunktOgVilkarLostTidligere
                ? formatereDato(informasjonTilLesemodus.tilDato)
                : 'dd.mm.├ą├ą├ą├ą',
            erSokerenAleneOmOmsorgen: harAksjonspunktOgVilkarLostTidligere
                ? booleanTilTekst(informasjonTilLesemodus.vilkarOppfylt)
                : '',
            ├ąpenForRedigering: false,
        },
    });

    const {
        formState: { errors },
        getValues,
        handleSubmit,
        watch,
        setValue,
    } = methods;
    const erSokerAleneOmOmsorgen = watch('erSokerenAleneOmOmsorgen');
    const ├ąpenForRedigering = watch('├ąpenForRedigering');
    const { erDatoFyltUt, erDatoGyldig } = valideringsFunksjoner(getValues, 'erSokerenAleneOmOmsorgen');

    const mellomlagringFormState = useFormSessionStorage(
        formStateKey,
        formState,
        methods.watch,
        methods.setValue,
        lesemodus,
        ├ąpenForRedigering,
        getValues
    );

    const bekreftAksjonspunkt = ({ begrunnelse, erSokerenAleneOmOmsorgen, fraDato, tilDato }) => {
        if (
            (!errors.begrunnelse &&
                !errors.fraDato &&
                !errors.erSokerenAleneOmOmsorgen &&
                !erBehandlingstypeRevurdering) ||
            (!errors.begrunnelse &&
                !errors.fraDato &&
                !errors.tilDato &&
                !errors.erSokerenAleneOmOmsorgen &&
                erBehandlingstypeRevurdering)
        ) {
            losAksjonspunkt({
                begrunnelse,
                vilkarOppfylt: tekstTilBoolean(erSokerenAleneOmOmsorgen),
                fraDato: tekstTilBoolean(erSokerenAleneOmOmsorgen) ? fraDato.replaceAll('.', '-') : '',
                tilDato: tekstTilBoolean(erSokerenAleneOmOmsorgen) ? tilDato.replaceAll('.', '-') : '',
            });
            setValue('├ąpenForRedigering', false);
            mellomlagringFormState.fjerneState();
        }
    };

    return (
        <div
            className={classNames(
                styles.vilkarMidlerTidigAlene,
                lesemodus && !├ąpenForRedigering && !vedtakFattetVilkarOppfylt && styleLesemodus.lesemodusboks
            )}
        >
            {vedtakFattetVilkarOppfylt && (
                <VilkarStatus
                    vilkarOppfylt={informasjonOmVilkar.vilkarOppfylt}
                    aksjonspunktNavn={informasjonOmVilkar.navnP├ąAksjonspunkt}
                    vilkarReferanse={informasjonOmVilkar.vilkar}
                    begrunnelse={informasjonOmVilkar.begrunnelse}
                    erVilkaretForOmsorgenFor={false}
                    periode={informasjonOmVilkar.periode}
                />
            )}

            {lesemodus && !├ąpenForRedigering && !vedtakFattetVilkarOppfylt && (
                <AleneOmOmsorgenLesemodus
                    fraDatoFraSoknad={fraDatoFraSoknad}
                    informasjonTilLesemodus={informasjonTilLesemodus}
                    harAksjonspunktBlivitLostTidligare={aksjonspunktLost}
                    ├ąpneForRedigereInformasjon={() => setValue('├ąpenForRedigering', true)}
                    erBehandlingstypeRevurdering={erBehandlingstypeRevurdering}
                />
            )}

            {(├ąpenForRedigering || (!lesemodus && !vedtakFattetVilkarOppfylt)) && (
                <>
                    <AlertStripeTrekantVarsel text={tekst.aksjonspunkt} />

                    <OpplysningerFraSoknad
                        periodeTekst="Fra dato oppgitt"
                        periode={formatereDatoTilLesemodus(fraDatoFraSoknad)}
                    />

                    <FormProvider {...methods}>
                        <form className={styles.form} onSubmit={handleSubmit(bekreftAksjonspunkt)}>
                            <TextArea label={tekst.begrunnelse} name="begrunnelse" />

                            <div>
                                <RadioGruppe
                                    className={styleRadioknapper.horisontalPlassering}
                                    legend={tekst.sporsm├ąlVilkarOppfylt}
                                >
                                    <RadioButtonWithBooleanValue
                                        label="Ja"
                                        value="true"
                                        name="erSokerenAleneOmOmsorgen"
                                    />
                                    <RadioButtonWithBooleanValue
                                        label="Nei"
                                        value="false"
                                        name="erSokerenAleneOmOmsorgen"
                                    />
                                </RadioGruppe>
                                {errors.erSokerenAleneOmOmsorgen && (
                                    <p className="typo-feilmelding">{tekst.feilIngenVurdering}</p>
                                )}
                            </div>

                            {tekstTilBoolean(erSokerAleneOmOmsorgen) && (
                                <SkjemaGruppe
                                    className={
                                        erBehandlingstypeRevurdering
                                            ? styles.gyldigVedtaksPeriode
                                            : styles.gyldigVedtaksPeriode_forstegangsbehandling_aleneOmOmsorgen
                                    }
                                    legend={tekst.sporsmalPeriodeVedtakGyldig}
                                    feil={
                                        (errors.fraDato &&
                                            errors.fraDato.type === 'erDatoFyltUt' &&
                                            tekst.feilmedlingManglerFraDato) ||
                                        (errors.fraDato &&
                                            errors.fraDato.type === 'erDatoGyldig' &&
                                            tekst.feilmedlingUgyldigDato) ||
                                        (erBehandlingstypeRevurdering &&
                                            errors.tilDato &&
                                            errors.tilDato.type === 'erDatoFyltUt' &&
                                            tekst.feilmeldingManglerTilDato) ||
                                        (erBehandlingstypeRevurdering &&
                                            errors.tilDato &&
                                            errors.tilDato.type === 'erDatoGyldig' &&
                                            tekst.feilmedlingUgyldigDato)
                                    }
                                >
                                    <DatePicker
                                        titel="Fra"
                                        navn="fraDato"
                                        valideringsFunksjoner={{ erDatoFyltUt, erDatoGyldig }}
                                    />

                                    {erBehandlingstypeRevurdering && (
                                        <DatePicker
                                            titel="Til"
                                            navn="tilDato"
                                            valideringsFunksjoner={{ erDatoFyltUt, erDatoGyldig }}
                                        />
                                    )}
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
export default AleneOmOmsorgen;

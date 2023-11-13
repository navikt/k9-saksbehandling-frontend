import { Alert, Button, Fieldset } from '@navikt/ds-react';
import { Datepicker, RadioGroupPanel } from '@navikt/k9-fe-form-utils';
import classNames from 'classnames';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { VilkarMidlertidigAleneProps } from '../../../types/VilkarMidlertidigAleneProps';
import { dateFromString, hanteringAvDatoForDatoVelger } from '../../../util/dateUtils';
import { booleanTilTekst, tekstTilBoolean } from '../../../util/stringUtils';
import useFormSessionStorage from '../../../util/useFormSessionStorageUtils';
import { valideringsFunksjoner } from '../../../util/validationReactHookFormUtils';
import { required } from '../../../util/validators';
import styleLesemodus from '../lesemodus/lesemodusboks.css';
import OpplysningerFraSoknad from '../opplysninger-fra-soknad/OpplysningerFraSoknad';
import TextArea from '../react-hook-form-wrappers/TextArea';
import VilkarMidlertidigAleneLesemodus from '../vilkar-midlertidig-alene-lesemodus/VilkarMidlertidigAleneLesemodus';
import VilkarStatus from '../vilkar-status/VilkarStatus';
import tekst from './vilkar-midlertidig-alene-tekst';
import styles from './vilkarMidlertidigAlene.css';

type FormData = {
    begrunnelse: string;
    fraDato: string;
    tilDato: string;
    erSokerenMidlertidigAleneOmOmsorgen: string;
    avslagsArsakErPeriodeErIkkeOverSeksMån: string;
    åpenForRedigering: boolean;
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
                ? dateFromString(informasjonTilLesemodus.dato.fra).toString()
                : dateFromString(soknadsopplysninger.soknadsdato).toString(),
            tilDato: harAksjonspunktOgVilkarLostTidligere
                ? dateFromString(informasjonTilLesemodus.dato.til).toString()
                : 'dd.mm.åååå',
            erSokerenMidlertidigAleneOmOmsorgen: harAksjonspunktOgVilkarLostTidligere
                ? booleanTilTekst(informasjonTilLesemodus.vilkarOppfylt)
                : '',
            avslagsArsakErPeriodeErIkkeOverSeksMån: harAksjonspunktOgVilkarLostTidligere
                ? booleanTilTekst(informasjonTilLesemodus.avslagsArsakErPeriodeErIkkeOverSeksMån)
                : '',
            åpenForRedigering: false,
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
    const åpenForRedigering = watch('åpenForRedigering');

    const { erDatoFyltUt, erDatoGyldig, erAvslagsArsakErPeriodeErIkkeOverSeksMånGyldig, erDatoSisteDagenIÅret } =
        valideringsFunksjoner(getValues, 'erSokerenMidlertidigAleneOmOmsorgen');

    const mellomlagringFormState = useFormSessionStorage(
        formStateKey,
        formState,
        methods.watch,
        methods.setValue,
        lesemodus,
        åpenForRedigering,
        getValues
    );

    const bekreftAksjonspunkt = ({
        begrunnelse,
        erSokerenMidlertidigAleneOmOmsorgen,
        avslagsArsakErPeriodeErIkkeOverSeksMån,
        fraDato,
        tilDato,
    }) => {
        if (
            !errors.begrunnelse &&
            !errors.fraDato &&
            !errors.tilDato &&
            !errors.erSokerenMidlertidigAleneOmOmsorgen &&
            !errors.avslagsArsakErPeriodeErIkkeOverSeksMån
        ) {
            losAksjonspunkt({
                begrunnelse,
                erSokerenMidlertidigAleneOmOmsorgen: tekstTilBoolean(erSokerenMidlertidigAleneOmOmsorgen),
                fra: tekstTilBoolean(erSokerenMidlertidigAleneOmOmsorgen) ? fraDato.replaceAll('.', '-') : '',
                til: tekstTilBoolean(erSokerenMidlertidigAleneOmOmsorgen) ? tilDato.replaceAll('.', '-') : '',
                avslagsArsakErPeriodeErIkkeOverSeksMån: tekstTilBoolean(avslagsArsakErPeriodeErIkkeOverSeksMån),
            });
            setValue('åpenForRedigering', false);
            mellomlagringFormState.fjerneState();
        }
    };

    return (
        <div
            className={classNames(
                styles.vilkarMidlerTidigAlene,
                lesemodus && !åpenForRedigering && !vedtakFattetVilkarOppfylt && styleLesemodus.lesemodusboks
            )}
        >
            {vedtakFattetVilkarOppfylt && (
                <VilkarStatus
                    vilkarOppfylt={informasjonOmVilkar.vilkarOppfylt}
                    aksjonspunktNavn={informasjonOmVilkar.navnPåAksjonspunkt}
                    vilkarReferanse={informasjonOmVilkar.vilkar}
                    begrunnelse={informasjonOmVilkar.begrunnelse}
                    erVilkaretForOmsorgenFor={false}
                />
            )}

            {lesemodus && !åpenForRedigering && !vedtakFattetVilkarOppfylt && (
                <VilkarMidlertidigAleneLesemodus
                    soknadsopplysninger={soknadsopplysninger}
                    informasjonTilLesemodus={informasjonTilLesemodus}
                    harAksjonspunktBlivitLostTidligare={harAksjonspunktBlivitLostTidligare}
                    åpneForRedigereInformasjon={() => setValue('åpenForRedigering', true)}
                />
            )}

            {(åpenForRedigering || (!lesemodus && !vedtakFattetVilkarOppfylt)) && (
                <>
                    <Alert variant="warning" size="small">
                        {tekst.aksjonspunkt}
                    </Alert>

                    <OpplysningerFraSoknad periodeTekst="Oppgitt periode" {...soknadsopplysninger} />

                    <FormProvider {...methods}>
                        <form className={styles.form} onSubmit={handleSubmit(bekreftAksjonspunkt)}>
                            <TextArea label={tekst.begrunnelse} name="begrunnelse" />

                            <div>
                                <RadioGroupPanel
                                    name="erSokerenMidlertidigAleneOmOmsorgen"
                                    question={tekst.sporsmålVilkarOppfylt}
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
                                {errors.erSokerenMidlertidigAleneOmOmsorgen && (
                                    <p className="typo-feilmelding">{tekst.feilIngenVurdering}</p>
                                )}
                            </div>

                            {sokerenMidlertidigAleneOmOmsorgen !== null &&
                                sokerenMidlertidigAleneOmOmsorgen.length > 0 &&
                                !tekstTilBoolean(sokerenMidlertidigAleneOmOmsorgen) && (
                                    <div>
                                        <RadioGroupPanel
                                            name="avslagsArsakErPeriodeErIkkeOverSeksMån"
                                            question={tekst.velgArsak}
                                            radios={[
                                                {
                                                    label: tekst.arsakIkkeAleneOmsorg,
                                                    value: 'false',
                                                },
                                                {
                                                    label: tekst.arsakPeriodeIkkeOverSeksMån,
                                                    value: 'true',
                                                },
                                            ]}
                                            validators={{ erAvslagsArsakErPeriodeErIkkeOverSeksMånGyldig }}
                                        />
                                        {errors.avslagsArsakErPeriodeErIkkeOverSeksMån && (
                                            <p className="typo-feilmelding">{tekst.feilIngenÅrsak}</p>
                                        )}
                                    </div>
                                )}

                            {tekstTilBoolean(sokerenMidlertidigAleneOmOmsorgen) && (
                                <Fieldset
                                    className={styles.gyldigVedtaksPeriode}
                                    legend={tekst.sporsmalPeriodeVedtakGyldig}
                                    error={
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
                                            errors.tilDato.type === 'erDatoSisteDagenIÅret' &&
                                            tekst.feilmedlingFeilDato) ||
                                        (errors.tilDato &&
                                            errors.tilDato.type === 'erDatoGyldig' &&
                                            tekst.feilmedlingUgyldigDato)
                                    }
                                >
                                    <Datepicker
                                        label="Fra"
                                        name="fraDato"
                                        validators={{ erDatoFyltUt, erDatoGyldig }}
                                    />

                                    <Datepicker
                                        label="Til"
                                        name="tilDato"
                                        validators={{ erDatoFyltUt, erDatoGyldig, erDatoSisteDagenIÅret }}
                                        disabledDays={
                                            hanteringAvDatoForDatoVelger(soknadsopplysninger.soknadsdato)
                                                ?.invalidDateRanges
                                        }
                                        fromDate={
                                            hanteringAvDatoForDatoVelger(soknadsopplysninger.soknadsdato)?.minDate
                                        }
                                        toDate={hanteringAvDatoForDatoVelger(soknadsopplysninger.soknadsdato)?.maxDate}
                                    />
                                </Fieldset>
                            )}

                            <Button size="small" variant="primary" className={styles.bekreftKnapp} type="submit">
                                {' '}
                                {tekst.bekreftFortsettKnapp}
                            </Button>
                        </form>
                    </FormProvider>
                </>
            )}
        </div>
    );
};
export default VilkarMidlertidigAlene;

import { Alert, Button, Fieldset } from '@navikt/ds-react';
import { Datepicker, RadioGroupPanel } from '@navikt/k9-fe-form-utils';
import classNames from 'classnames';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { AleneOmOmsorgenProps } from '../../../types/AleneOmOmsorgenProps';
import { dateFromString } from '../../../util/dateUtils';
import { booleanTilTekst, formatereDatoTilLesemodus, tekstTilBoolean } from '../../../util/stringUtils';
import useFormSessionStorage from '../../../util/useFormSessionStorageUtils';
import { valideringsFunksjoner } from '../../../util/validationReactHookFormUtils';
import { required } from '../../../util/validators';
import AleneOmOmsorgenLesemodus from '../alene-om-omsorgen-lesemodus/AleneOmOmsorgenLesemodus';
import styleLesemodus from '../lesemodus/lesemodusboks.css';
import OpplysningerFraSoknad from '../opplysninger-fra-soknad/OpplysningerFraSoknad';
import TextArea from '../react-hook-form-wrappers/TextArea';
import styles from '../vilkar-midlertidig-alene/vilkarMidlertidigAlene.css';
import VilkarStatus from '../vilkar-status/VilkarStatus';
import tekst from './alene-om-omsorgen-tekst';

type FormData = {
    begrunnelse: string;
    fraDato: string;
    tilDato: string;
    erSokerenAleneOmOmsorgen: string;
    åpenForRedigering: boolean;
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
                ? dateFromString(informasjonTilLesemodus.fraDato).toString()
                : 'dd.mm.åååå',
            tilDato: harAksjonspunktOgVilkarLostTidligere
                ? dateFromString(informasjonTilLesemodus.tilDato).toString()
                : 'dd.mm.åååå',
            erSokerenAleneOmOmsorgen: harAksjonspunktOgVilkarLostTidligere
                ? booleanTilTekst(informasjonTilLesemodus.vilkarOppfylt)
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
    const erSokerAleneOmOmsorgen = watch('erSokerenAleneOmOmsorgen');
    const åpenForRedigering = watch('åpenForRedigering');
    const { erDatoFyltUt, erDatoGyldig } = valideringsFunksjoner(getValues, 'erSokerenAleneOmOmsorgen');

    const mellomlagringFormState = useFormSessionStorage(
        formStateKey,
        formState,
        methods.watch,
        methods.setValue,
        lesemodus,
        åpenForRedigering,
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
                    periode={informasjonOmVilkar.periode}
                />
            )}

            {lesemodus && !åpenForRedigering && !vedtakFattetVilkarOppfylt && (
                <AleneOmOmsorgenLesemodus
                    fraDatoFraSoknad={fraDatoFraSoknad}
                    informasjonTilLesemodus={informasjonTilLesemodus}
                    harAksjonspunktBlivitLostTidligare={aksjonspunktLost}
                    åpneForRedigereInformasjon={() => setValue('åpenForRedigering', true)}
                    erBehandlingstypeRevurdering={erBehandlingstypeRevurdering}
                />
            )}

            {(åpenForRedigering || (!lesemodus && !vedtakFattetVilkarOppfylt)) && (
                <>
                    <Alert variant="warning" size="small">
                        {tekst.aksjonspunkt}
                    </Alert>

                    <OpplysningerFraSoknad
                        periodeTekst="Fra dato oppgitt"
                        periode={formatereDatoTilLesemodus(fraDatoFraSoknad)}
                    />

                    <FormProvider {...methods}>
                        <form className={styles.form} onSubmit={handleSubmit(bekreftAksjonspunkt)}>
                            <TextArea label={tekst.begrunnelse} name="begrunnelse" />

                            <div>
                                <RadioGroupPanel
                                    name="erSokerenAleneOmOmsorgen"
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
                                {errors.erSokerenAleneOmOmsorgen && (
                                    <p className="typo-feilmelding">{tekst.feilIngenVurdering}</p>
                                )}
                            </div>

                            {tekstTilBoolean(erSokerAleneOmOmsorgen) && (
                                <Fieldset
                                    className={
                                        erBehandlingstypeRevurdering
                                            ? styles.gyldigVedtaksPeriode
                                            : styles.gyldigVedtaksPeriode_forstegangsbehandling_aleneOmOmsorgen
                                    }
                                    legend={tekst.sporsmalPeriodeVedtakGyldig}
                                    error={
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
                                    <Datepicker
                                        label="Fra"
                                        name="fraDato"
                                        validators={{ erDatoFyltUt, erDatoGyldig }}
                                    />

                                    {erBehandlingstypeRevurdering && (
                                        <Datepicker
                                            label="Til"
                                            name="tilDato"
                                            validators={{ erDatoFyltUt, erDatoGyldig }}
                                        />
                                    )}
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
export default AleneOmOmsorgen;

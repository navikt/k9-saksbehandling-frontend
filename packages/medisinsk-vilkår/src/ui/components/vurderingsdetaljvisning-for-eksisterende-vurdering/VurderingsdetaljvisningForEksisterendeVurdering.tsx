import { addYearsToDate } from '@k9-saksbehandling-frontend/date-utils';
import React from 'react';
import LinkRel from '../../../constants/LinkRel';
import InnleggelsesperiodeVurdering from '../../../types/InnleggelsesperiodeVurdering';
import ManuellVurdering from '../../../types/ManuellVurdering';
import Vurderingselement from '../../../types/Vurderingselement';
import Vurderingsoversikt from '../../../types/Vurderingsoversikt';
import Vurderingstype from '../../../types/Vurderingstype';
import { findHrefByRel, findLinkByRel } from '../../../util/linkUtils';
import ContainerContext from '../../context/ContainerContext';
import VurderingContext from '../../context/VurderingContext';
import EndreVurderingController from '../endre-vurdering-controller/EndreVurderingController';
import buildInitialFormStateForEdit from '../vilkårsvurdering-av-tilsyn-og-pleie/initialFormStateUtil';
import VurderingAvLivetsSluttfaseForm from '../vurdering-av-livets-sluttfase-form/VurderingAvLivetsSluttfaseForm';
import VurderingAvTilsynsbehovForm from '../vurdering-av-tilsynsbehov-form/VurderingAvTilsynsbehovForm';
import VurderingAvToOmsorgspersonerForm from '../vurdering-av-to-omsorgspersoner-form/VurderingAvToOmsorgspersonerForm';
import VurderingsdetaljerFetcher from '../vurderingsdetaljer-fetcher/VurderingsdetaljerFetcher';
import VurderingsoppsummeringForInnleggelsesperiode from '../vurderingsoppsummering-for-innleggelsesperiode/VurderingsoppsummeringForInnleggelsesperiode';
import VurderingsoppsummeringForKontinuerligTilsynOgPleie from '../vurderingsoppsummering-for-kontinuerlig-tilsyn-og-pleie/VurderingsoppsummeringForKontinuerligTilsynOgPleie';
import VurderingsoppsummeringForSluttfase from '../vurderingsoppsummering-for-livets-sluttfase/VurderingsoppsummeringForSluttfase';
import VurderingsoppsummeringForToOmsorgspersoner from '../vurderingsoppsummering-for-to-omsorgspersoner/VurderingsoppsummeringForToOmsorgspersoner';

interface VurderingsdetaljvisningForEksisterendeProps {
    vurderingsoversikt: Vurderingsoversikt;
    vurderingselement: Vurderingselement;
    editMode: boolean;
    onEditClick: () => void;
    onAvbrytClick: () => void;
    onVurderingLagret: () => void;
}

const getFormComponent = (vurderingstype: Vurderingstype) => {
    if (vurderingstype === Vurderingstype.KONTINUERLIG_TILSYN_OG_PLEIE) {
        return VurderingAvTilsynsbehovForm;
    }
    if (vurderingstype === Vurderingstype.TO_OMSORGSPERSONER) {
        return VurderingAvToOmsorgspersonerForm;
    }
    if (vurderingstype === Vurderingstype.LIVETS_SLUTTFASE) {
        return VurderingAvLivetsSluttfaseForm;
    }
    return null;
};

const getSummaryComponent = (vurderingstype: Vurderingstype) => {
    if (vurderingstype === Vurderingstype.KONTINUERLIG_TILSYN_OG_PLEIE) {
        return VurderingsoppsummeringForKontinuerligTilsynOgPleie;
    }
    if (vurderingstype === Vurderingstype.TO_OMSORGSPERSONER) {
        return VurderingsoppsummeringForToOmsorgspersoner;
    }
    if (vurderingstype === Vurderingstype.LIVETS_SLUTTFASE) {
        return VurderingsoppsummeringForSluttfase;
    }
    return null;
};

const erAutomatiskVurdertInnleggelsesperiode = (vurderingselement: Vurderingselement) =>
    !(vurderingselement as ManuellVurdering).resultat;

const VurderingsdetaljvisningForEksisterendeVurdering = ({
    vurderingsoversikt,
    vurderingselement,
    editMode,
    onEditClick,
    onAvbrytClick,
    onVurderingLagret,
}: VurderingsdetaljvisningForEksisterendeProps): JSX.Element => {
    const { endpoints } = React.useContext(ContainerContext);
    const { vurderingstype } = React.useContext(VurderingContext);

    if (erAutomatiskVurdertInnleggelsesperiode(vurderingselement)) {
        return (
            <VurderingsoppsummeringForInnleggelsesperiode
                vurdering={vurderingselement as InnleggelsesperiodeVurdering}
                vurderingstype={vurderingstype}
            />
        );
    }

    const manuellVurdering = vurderingselement as ManuellVurdering;
    const url = findHrefByRel(LinkRel.HENT_VURDERING, manuellVurdering.links);

    return (
        <VurderingsdetaljerFetcher
            url={url}
            contentRenderer={(vurdering) => {
                if (editMode) {
                    const endreLink = findLinkByRel(LinkRel.ENDRE_VURDERING, manuellVurdering.links);
                    const vurderingsversjon = vurdering.versjoner[0];

                    const FormComponent = getFormComponent(vurderingstype);
                    return (
                        <EndreVurderingController
                            endreVurderingLink={endreLink}
                            dataTilVurderingUrl={endpoints.dataTilVurdering}
                            formRenderer={(dokumenter, onSubmit, isSubmitting) => {
                                if (Vurderingstype.LIVETS_SLUTTFASE === vurderingstype) {
                                    return (
                                        <VurderingAvLivetsSluttfaseForm
                                            defaultValues={buildInitialFormStateForEdit(
                                                vurderingsversjon,
                                                vurderingstype
                                            )}
                                            dokumenter={dokumenter}
                                            onSubmit={onSubmit}
                                            onAvbryt={onAvbrytClick}
                                            isSubmitting={isSubmitting}
                                            resterendeVurderingsperioder={
                                                vurderingsoversikt.resterendeVurderingsperioder
                                            }
                                            perioderSomKanVurderes={vurderingsoversikt.perioderSomKanVurderes}
                                        />
                                    );
                                }
                                return (
                                    <FormComponent
                                        defaultValues={buildInitialFormStateForEdit(vurderingsversjon, vurderingstype)}
                                        resterendeVurderingsperioder={vurderingsoversikt.resterendeVurderingsperioder}
                                        perioderSomKanVurderes={vurderingsoversikt.perioderSomKanVurderes}
                                        dokumenter={dokumenter}
                                        onSubmit={onSubmit}
                                        onAvbryt={onAvbrytClick}
                                        isSubmitting={isSubmitting}
                                        harPerioderDerPleietrengendeErOver18år={
                                            vurderingsoversikt.harPerioderDerPleietrengendeErOver18år
                                        }
                                        barnetsAttenårsdag={
                                            vurderingsoversikt.harPerioderDerPleietrengendeErOver18år
                                                ? addYearsToDate(vurderingsoversikt.pleietrengendesFødselsdato, 18)
                                                : undefined
                                        }
                                    />
                                );
                            }}
                            vurderingsid={vurderingselement.id}
                            vurderingsversjonId={vurderingsversjon.versjon}
                            onVurderingLagret={onVurderingLagret}
                        />
                    );
                }

                const SummaryComponent = getSummaryComponent(vurderingstype);
                return (
                    <SummaryComponent
                        vurdering={vurdering}
                        redigerVurdering={onEditClick}
                        erInnleggelsesperiode={vurderingselement.erInnleggelsesperiode}
                    />
                );
            }}
        />
    );
};

export default VurderingsdetaljvisningForEksisterendeVurdering;

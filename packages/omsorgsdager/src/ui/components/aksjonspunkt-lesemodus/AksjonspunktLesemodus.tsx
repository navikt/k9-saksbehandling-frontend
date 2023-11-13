import { Button } from '@navikt/ds-react';
import React from 'react';
import styleLesemodus from '../lesemodus/lesemodusboks.css';

interface OwnProps {
    harAksjonspunktBlivitLostTidligare: boolean;
    åpneForRedigereInformasjon: () => void;
    aksjonspunktTekst: string;
}

const AksjonspunktLesemodus = ({
    harAksjonspunktBlivitLostTidligare,
    åpneForRedigereInformasjon,
    aksjonspunktTekst,
}: OwnProps) => {
    const håndtereKlikk = (e) => {
        e.preventDefault();
        e.stopPropagation();
        åpneForRedigereInformasjon();
    };

    return (
        <div className={styleLesemodus.aksjonspunktOgRedigerVurderingContainer}>
            <p>
                <b>Behandlet aksjonspunkt:</b> {aksjonspunktTekst}
            </p>
            {harAksjonspunktBlivitLostTidligare && (
                <div className={styleLesemodus.redigerVurderingTekst}>
                    <Button
                        size="medium"
                        variant="tertiary"
                        onClick={(e) => {
                            håndtereKlikk(e);
                        }}
                    >
                        Rediger vurdering
                    </Button>
                </div>
            )}
        </div>
    );
};
export default AksjonspunktLesemodus;

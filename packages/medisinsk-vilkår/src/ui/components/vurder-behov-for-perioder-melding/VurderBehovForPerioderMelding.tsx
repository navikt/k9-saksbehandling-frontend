import React from 'react';
import { Period, getHumanReadablePeriodString } from '@k9-saksbehandling-frontend/period-utils';
import Alertstripe from 'nav-frontend-alertstriper';

interface VurderBehovForPerioderMeldingProps {
    vurderingsnavn: string;
    perioder: Period[];
}

const VurderBehovForPerioderMelding = ({
    vurderingsnavn,
    perioder,
}: VurderBehovForPerioderMeldingProps): JSX.Element => (
    <Alertstripe type="advarsel">
        Vurder behov for
        {vurderingsnavn}
        for ${getHumanReadablePeriodString(perioder)}
    </Alertstripe>
);

export default VurderBehovForPerioderMelding;

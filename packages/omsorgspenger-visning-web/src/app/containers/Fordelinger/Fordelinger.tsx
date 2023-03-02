import Fordelingskomponent from 'app/components/Fordeling/Fordelingskomponent';
import Fordeling from 'app/types/Fordeling';
import React from 'react';
import navColors from 'styles/designSystemColors';
import { erPeriodeGjeldende } from 'utils/timeUtils';

interface Props {
  fordelinger: Fordeling[];
}

const Fordelinger: React.FunctionComponent<Props> = ({fordelinger = []}) => {
  const gjeldendeFordelinger = React.useMemo(
    () => fordelinger.filter(
      ({gjelderFraOgMed, gjelderTilOgMed}) =>
        erPeriodeGjeldende(gjelderFraOgMed, gjelderTilOgMed)
    ),
    [fordelinger]
  );
  return <>{gjeldendeFordelinger.map((fordeling, key) => (
    <Fordelingskomponent
      {...{fordeling, key}}
      defaultOpen={true}
      farge={fordeling.til ? navColors.navLysBla : navColors.navDypBla}
   />
  ))}</>;
};

export default Fordelinger;
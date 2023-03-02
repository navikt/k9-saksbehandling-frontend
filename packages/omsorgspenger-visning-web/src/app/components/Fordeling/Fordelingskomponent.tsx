import DeleDagerPanel from 'app/components/ExpandablePanel/DeleDagerPanel';
import { FlexContainer } from 'app/components/Flex';
import LabelValue from 'app/components/LabelValue/LabelValue';
import Fordeling from 'app/types/Fordeling';
import React, { useState } from 'react';
import navColors from 'styles/designSystemColors';
import { isoDateToLocale } from 'utils/timeUtils';

interface Props {
  fordeling: Fordeling;
  defaultOpen: boolean;
  farge: navColors;
}

const Fordelingskomponent: React.FunctionComponent<Props> = ({
  fordeling,
  defaultOpen,
  farge
}) => {
  const {antallDager, til, fra, gjelderFraOgMed, gjelderTilOgMed} = fordeling;
  const [visDagerGittInnhold, setVisDagerGittInnhold] = useState<boolean>(defaultOpen);
  return <DeleDagerPanel
    visInnhold={visDagerGittInnhold}
    setVisInnhold={() => setVisDagerGittInnhold(current => current)}
    farge={farge}
    overskrift={{
      antallDager,
      overskrifttekstId: til ? 'fordeling.dagerGir' : 'fordling.dagerFår'
    }}
  >
    <FlexContainer childSpacing="2em">
      <LabelValue
        labelTextId={(til ? 'fordeling.til' : 'fordeling.fra')}
        value={til || fra}
        retning="vertikal"
      />
      <LabelValue
        labelTextId="fordeling.gyldighetsperiode"
        value={`${isoDateToLocale(gjelderFraOgMed)} - ${isoDateToLocale(gjelderTilOgMed,)}`}
        retning="vertikal"
      />
      <LabelValue
        labelTextId="fordeling.antallDager"
        value={antallDager}
        retning="vertikal"
      />
    </FlexContainer>
  </DeleDagerPanel>;
};

export default Fordelingskomponent;
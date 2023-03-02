import React from 'react';
import styled from 'styled-components/macro';
import navColors from '../../../styles/designSystemColors';
import { Overføring as OverføringType, overføringKey } from '../../types';
import ExpandablePanel from '../ExpandablePanel/ExpandablePanel';
import Overføring from './Overforing';

interface Props {
  vis: boolean;
  heading: (skalViseInnhold: boolean) => React.ReactNode;
  overføringer: OverføringType[];
  innholdPadding?: string;
}

const OverføringerExpandable: React.FunctionComponent<Props> = ({
  vis,
  heading,
  overføringer,
  innholdPadding,
}) => (
  <MarginWrapper>
    <ExpandablePanel
      heading={heading}
      isOpenAsDefault={vis}
      innholdPadding={innholdPadding}
    >
      {overføringer.map(overføring => (
        <PadLeft key={overføringKey(overføring)}>
          <Overføring
            overføring={overføring}
            defaultOpen={false}
            farge={navColors.navGra40}
          />
        </PadLeft>
      ))}
    </ExpandablePanel>
  </MarginWrapper>
);

const PadLeft = styled.div`
  padding-left: 2em;
`;

const MarginWrapper = styled.div`
  & + * {
    margin-top: 1em;
  }
`;

export default OverføringerExpandable;

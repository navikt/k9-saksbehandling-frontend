import { ExpandablePanelBase } from 'app/components/ExpandablePanel/ExpandablePanel';
import Topplinje from 'app/components/ExpandablePanel/Topplinje';
import PanelWrapper from 'app/components/PanelWrapper/PanelWrapper';
import React from 'react';
import Dokument from '../../types/Dokument';

interface Props {
  dokumenter: Dokument[];
}

const Dokumenter: React.FunctionComponent<Props> = ({dokumenter = []}) => {
  return <>{dokumenter.map((b, i) => <Dokumentkomponent {...b} key={`dokument_${i}`}/>)}</>;
};

const Dokumentkomponent: React.FunctionComponent<Dokument> = dokument => {
  return <PanelWrapper>
    <ExpandablePanelBase
      headerButton={(skalViseDetaljer, visEllerSkjulDetaljer) => (
        <Topplinje {...{skalViseDetaljer, visEllerSkjulDetaljer}}>
          <span>{dokument.filnavn}</span>
        </Topplinje>
      )}
      isOpenAsDefault={false}
    >
      Detaljer
    </ExpandablePanelBase>
  </PanelWrapper>;
};

export default Dokumenter;

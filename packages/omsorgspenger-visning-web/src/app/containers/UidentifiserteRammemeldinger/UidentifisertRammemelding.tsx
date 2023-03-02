import { ExpandablePanelBase } from 'app/components/ExpandablePanel/ExpandablePanel';
import Topplinje from 'app/components/ExpandablePanel/Topplinje';
import PanelWrapper from 'app/components/PanelWrapper/PanelWrapper';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import navColors from '../../../styles/designSystemColors';
import UidentifisertRammemelding from '../../types/UidentifisertRammemelding';

interface Props {
  rammemelding: UidentifisertRammemelding[];
}

const UidentifiserteRammemeldinger: React.FunctionComponent<Props> = ({rammemelding = []}) => {
  return <>{rammemelding.map((b, i) => <UidentifisertRammemeldingKomponent {...b} key={`UidentifisertRammemelding_${i}`}/>)}</>;
};

const UidentifisertRammemeldingKomponent: React.FunctionComponent<UidentifisertRammemelding> = rammemelding => {
  const {t} = useTranslation();
  return <PanelWrapper>
    <PanelKnappStyle farge={navColors.navOransje}>
      <ExpandablePanelBase
        headerButton={(skalViseDetaljer, visEllerSkjulDetaljer) => (
          <Topplinje {...{skalViseDetaljer, visEllerSkjulDetaljer}}>
            <span>{t(`uidentifiserteRammemeldinger.${rammemelding.type}`)}</span>
          </Topplinje>
        )}
        isOpenAsDefault={false}
      >
        <p>Det finnes 1 rammevedtak om utvidet rett fra infotrygd som ikke er automatisk kan kobles til ett barn. Vennligst korriger i infotrygd.</p>
        <p><b>Utolkbar tekst: "@9-6 2 L UTV.OMSD*10/</b></p>
      </ExpandablePanelBase>
    </PanelKnappStyle>
  </PanelWrapper>;
};

const PanelKnappStyle = styled.div<{farge: string}>`
  > button {
    border-left: ${({ farge }) => `5px solid ${farge}`}
  }
`;

export default UidentifiserteRammemeldinger;

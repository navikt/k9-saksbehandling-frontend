import PanelWrapper from 'app/components/PanelWrapper/PanelWrapper';
import NavFrontendChevron from 'nav-frontend-chevron';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';
import navColors from '../../../styles/designSystemColors';
import { ExpandablePanelBase } from './ExpandablePanel';
import KnappStyle from './KnappStyle';

interface Props {
  visInnhold: boolean;
  setVisInnhold: () => void;
  farge: navColors;
  overskrift: {
    antallDager: number;
    overskrifttekstId: string;
  };
  children?: React.ReactNode;
}

const DeleDagerPanel: React.FunctionComponent<Props> = ({
  farge,
  overskrift,
  children,
}) => {
  const { t } = useTranslation();

  return (
    <PanelWrapper>
      <ExpandablePanelBase
        headerButton={(skalViseInnhold, visEllerSkjulInnhold) => (
          <Overskrift farge={farge} onClick={visEllerSkjulInnhold}>
            <Dager>{overskrift.antallDager}</Dager>
            <Banner>
              <OverskriftTekst>
                {t(overskrift.overskrifttekstId, {count: overskrift.antallDager})}
              </OverskriftTekst>
              <KnappStyle>
                {skalViseInnhold
                  ? t('deleDagerPanel.skjulInnhold')
                  : t('deleDagerPanel.visInnhold')}
                <NavFrontendChevron type={skalViseInnhold ? 'opp' : 'ned'} />
              </KnappStyle>
            </Banner>
          </Overskrift>
        )}
        isOpenAsDefault={false}
      >
        {children}
      </ExpandablePanelBase>
    </PanelWrapper>
  );
};

export const Dager = styled.span`
  align-items: center;
  display: flex;
  flex: 0 0 80px;
  font-size: 1.3em;
  font-weight: bold;
  margin-left: 0.5em;

  > * {
    display: inline;
  }
`;

export const OverskriftTekst = styled.b`
  font-size: 0.8em;
`;

export const Banner = styled.span`
  align-items: center;
  background-color: #f3f4f4;
  display: flex;
  flex-grow: 1;
  height: 2.5rem;
  justify-content: space-between;
  
  > * {
    margin: 0 0.5em;
    &:last-child {margin-right: 1rem}
  }

  ${OverskriftTekst} {
    font-size: 1em;
  }
`;

export const Overskrift = styled.button<{ farge: string }>`
  align-items: stretch;
  background-color: inherit;
  border-bottom: none;
  border-left: ${({ farge }) => `5px solid ${farge}`};
  border-right: none;
  border-top: none;
  display: flex;
  flex-wrap: nowrap;
  font-size: 1em;
  padding: 0;
  width: 100%;

  &:hover {
    cursor: pointer;
  }

  &:focus {
    outline: none;
    
    ${KnappStyle} {
      border-radius: 5px;
      outline: 2px solid ${navColors.navBla};
    }
  }
`;

export default DeleDagerPanel;

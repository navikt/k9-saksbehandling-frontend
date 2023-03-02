import NavFrontendChevron from 'nav-frontend-chevron';
import { Flatknapp } from 'nav-frontend-knapper';
import React, { useState } from 'react';
import styled from 'styled-components/macro';
import { v4 as uuid } from 'uuid';
import navColors from "../../../styles/designSystemColors";

interface BaseProps {
  headerButton: (
    skalViseInnhold: boolean,
    visEllerSkjulInnhold: () => void
  ) => React.ReactElement;
  isOpenAsDefault: boolean;
  innholdPadding?: string;
  children?: React.ReactNode;
}

export const ExpandablePanelBase: React.FunctionComponent<BaseProps> = ({
  headerButton,
  isOpenAsDefault,
  children,
  innholdPadding = '1em',
}) => {
  const [visInnhold, setVisInnhold] = useState<boolean>(isOpenAsDefault);
  const buttonId = React.useMemo(() => uuid(), []);
  const contentId = React.useMemo(() => uuid(), []);

  const visEllerSkjulInnhold = () => setVisInnhold(!visInnhold);

  const generatedHeaderButton = headerButton(visInnhold, visEllerSkjulInnhold);

  const buttonWithId = React.cloneElement(generatedHeaderButton, {
    // @ts-ignore
    ...generatedHeaderButton.props,
    id: buttonId,
    'aria-controls': contentId,
  });

  return (
    <>
      {buttonWithId}
      <div role="region" id={contentId} aria-labelledby={buttonId} data-testid="ExpandablePanelBase">
        {visInnhold && <Innhold innholdPadding={innholdPadding}>{children}</Innhold>}
      </div>
    </>
  );
};

interface Props {
  heading: (skalViseInnhold: boolean) => React.ReactNode;
  isOpenAsDefault: boolean;
  innholdPadding?: string;
  children?: React.ReactNode;
}

const ExpandablePanel: React.FunctionComponent<Props> = ({
  heading,
  isOpenAsDefault,
  children,
  innholdPadding = '1em',
}) => {
  return (
    <ExpandablePanelBase
      isOpenAsDefault={isOpenAsDefault}
      innholdPadding={innholdPadding}
      headerButton={(skalViseInnhold, visEllerSkjulInnhold) => (
        <KnappIkkeHover>
        <Flatknapp
          onClick={visEllerSkjulInnhold}
          mini={true}
          kompakt={true}
          htmlType="button"
        >
          {heading(skalViseInnhold)}
          <NavFrontendChevron type={skalViseInnhold ? 'opp' : 'ned'} />
        </Flatknapp>
        </KnappIkkeHover>
      )}
    >
      {children}
    </ExpandablePanelBase>
  );
};


const KnappIkkeHover = styled.div`
  .knapp:hover, .knapp--flat:hover{
    border-color: white;
  }
   
  .knapp:active, .knapp--flat:active{
    background-color: white;
    border-color: white;
  }
`;

const Innhold = styled.div<Pick<BaseProps, 'innholdPadding'>>`
  padding: ${({ innholdPadding }) => innholdPadding};
`;

export default ExpandablePanel;

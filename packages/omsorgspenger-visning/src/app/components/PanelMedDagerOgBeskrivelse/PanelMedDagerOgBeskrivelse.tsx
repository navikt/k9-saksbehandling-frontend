import React from 'react';
import styled from 'styled-components/macro';
import navColors from '../../../styles/designSystemColors';

interface Props {
  farge: navColors;
  antallDager: number;
  beskrivelseAvDager: string;
}

const PanelMedDagerOgBeskrivelse: React.FunctionComponent<Props> = ({farge, antallDager, beskrivelseAvDager}) => {
  return (
    <Wrapper farge={farge}>
      <Dager>{antallDager}</Dager>
      <Beskrivelse>{beskrivelseAvDager}</Beskrivelse>
    </Wrapper>
  );
};

const Wrapper = styled.div<{ farge: string }>`
  align-items: center;
  background-color: inherit;
  border-bottom: none;
  border-left: ${({farge}) => `5px solid ${farge}`};
  border-right: none;
  border-top: none;
  display: flex;
  flex-wrap: nowrap; 
  margin-bottom: 1rem;
  min-height: 2.5rem;
  text-align: left;
  width: 100%;
`;

const Dager = styled.span`
  align-items: center;
  display: flex;
  flex: 0 0 40px;
  font-size: 1.3rem;
  font-weight: bold;
  margin-left: 0.5em;
`;

const Beskrivelse = styled.span`
  padding-right: 2rem;
`;

export default PanelMedDagerOgBeskrivelse;

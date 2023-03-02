import styled from 'styled-components/macro';

const RammemeldingOverskrift = styled.h2`
  align-items: center;
  border-bottom: 1px solid;
  color: black;
  display: flex;
  font-size: 1.3em;
  font-weight: bold;
  justify-content: flex-start;
  margin: 0 0 2ex 0;
  padding-bottom: 0.7ex;

  svg {
    height: 24px;
    margin-bottom: 0.1ex;
    margin-right: 0.5em;
    width: 24px;
  }
`;

export default RammemeldingOverskrift;

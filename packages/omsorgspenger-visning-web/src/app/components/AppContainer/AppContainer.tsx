import styled from 'styled-components/macro';

const AppContainer = styled.main`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  & > * {
    flex: 1 1 auto;
    margin: 1em;
  }
`;

export default AppContainer;

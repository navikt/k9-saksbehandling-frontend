import styled from 'styled-components';
import navColors from 'styles/designSystemColors';

const PanelWrapper = styled.div`
  border: 1px solid ${navColors.navGra20};
  box-shadow: 0 3px 3px -1px ${navColors.navGra20};
  margin-bottom: 1rem;
`;

export default PanelWrapper;
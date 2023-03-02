import styled from 'styled-components';
import navColors from 'styles/designSystemColors';

const KnappStyle = styled.span`
  background-color: inherit;
  border: none;
  color: ${navColors.navBla};
  font-size: 1rem;
  text-decoration: underline;

  &:hover {
    cursor: pointer;
  }
`;

export default KnappStyle;
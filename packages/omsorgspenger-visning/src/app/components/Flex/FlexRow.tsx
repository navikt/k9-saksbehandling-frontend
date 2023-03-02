import styled from 'styled-components/macro';
import FlexProps from './FlexProps';

const FlexRow = styled.div<FlexProps>`
  align-items: ${({ alignItems }) => alignItems || 'inherit'};
  display: flex;
  flex: 1 1 auto;
  flex-wrap: nowrap;
  & > *:not(:last-child) {
    margin-right: 1em;
  }
`;

export default FlexRow;

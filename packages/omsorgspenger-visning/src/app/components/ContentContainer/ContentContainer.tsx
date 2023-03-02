import styled from 'styled-components/macro';

const ContentContainer = styled.section<{skalViseBeggeKolonner?: boolean}>`
/* stylelint-disable */
  display: ${({skalViseBeggeKolonner}) => skalViseBeggeKolonner ? 'flex' : 'block'};
  margin-top: 0;
  min-width: 350px;
  padding: 1em;
  
  ${({skalViseBeggeKolonner}) => skalViseBeggeKolonner && `
    > div {
      width: 50%;
      
      &:first-child {margin-right: 1rem}
      &:last-child {margin-left: 1rem}
    }
  `}
`;

export default ContentContainer;

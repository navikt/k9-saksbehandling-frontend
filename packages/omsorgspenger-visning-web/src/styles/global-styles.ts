import { createGlobalStyle } from 'styled-components';
import navColors from './designSystemColors';

export const GlobalStyle = createGlobalStyle`
  html,
  body {
    height: 100%;
    width: 100%;
    margin: 0;
  }

  body {
    font-family: 'Source Sans Pro', Arial, sans-serif;
    line-height: 1.428571429;
    color: ${navColors.navMorkGra};
  }

  #root {
    min-height: 100%;
    min-width: 100%;
  }

  button {
    font-family: inherit;
  }
  
  input, select {
    font-family: inherit;
    font-size: inherit;
  }
  
  /* Chrome, Safari, Edge, Opera */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  
  /* Firefox */
  input[type=number] {
    -moz-appearance: textfield;
  }
  
  code {
    border: 1px solid ${navColors.navGra20};
    background: #f7f7f7;
    border-radius: 5px;
    color: ${navColors.redError};
    padding: 2px 4px;
    font-size: 1.1em;
  }
`;

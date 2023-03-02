import React from 'react';
import navColors from '../../../styles/designSystemColors';

const GroupIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill={navColors.navMorkGra}>
    <path d="M0,13.5c0,1.083,0.336,1.73,1,1.932V19.5h4v-4.068c0.664-0.202,0.999-0.849,1-1.932V10H0V13.5z"/>
    <path d="M18,10v3.5c0,1.083,0.336,1.73,1,1.932V19.5h4v-4.068c0.664-0.202,0.999-0.849,1-1.932V10H18z"/>
    <path d="M8,15.5c0,1.208,0.861,2.218,2,2.45V24h4v-6.05c1.14-0.232,2-1.242,2-2.45V10H8V15.5z"/>
    <path d="M21,9c1.104,0,2-0.897,2-2s-0.896-2-2-2c-1.102,0-2,0.897-2,2S19.898,9,21,9z"/>
    <path d="M3,9c1.104,0,2-0.897,2-2S4.104,5,3,5C1.898,5,1,5.897,1,7S1.898,9,3,9z"/>
    <circle cx="12" cy="6" r="3"/>
  </svg>
);

export default GroupIcon;

import React from 'react';
import navColors from '../../../styles/designSystemColors';

const CalendarIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <g>
          <rect fill={navColors.navMorkGra} x="12" y="16" width="4" height="3"/>
          <rect  fill={navColors.navMorkGra} x="7" y="16" width="4" height="3"/>
          <rect fill={navColors.navMorkGra} x="12" y="12" width="4" height="3"/>
          <rect fill={navColors.navMorkGra} x="7" y="12" width="4" height="3"/>
          <path
            fill={navColors.navMorkGra}
            d="M0,23.5C0,23.776,0.224,24,0.5,24h23c0.276,0,0.5-0.224,0.5-0.5V8H0V23.5z M2.5,16C2.224,16,2,15.776,2,15.5
               S2.224,15,2.5,15H6v-3H2.5C2.224,12,2,11.776,2,11.5S2.224,11,2.5,11H6V9.5C6,9.224,6.224,9,6.5,9C6.776,9,7,9.224,7,9.5V11h4V9.5
               C11,9.224,11.224,9,11.5,9C11.776,9,12,9.224,12,9.5V11h4V9.5C16,9.224,16.224,9,16.5,9C16.776,9,17,9.224,17,9.5V11h4.5
               c0.276,0,0.5,0.224,0.5,0.5S21.776,12,21.5,12H17v3h4.5c0.276,0,0.5,0.224,0.5,0.5S21.776,16,21.5,16H17v3h4.5
               c0.276,0,0.5,0.224,0.5,0.5S21.776,20,21.5,20H17v1.5c0,0.276-0.224,0.5-0.5,0.5c-0.276,0-0.5-0.224-0.5-0.5V20h-4v1.5
               c0,0.276-0.224,0.5-0.5,0.5c-0.276,0-0.5-0.224-0.5-0.5V20H7v1.5C7,21.776,6.776,22,6.5,22C6.224,22,6,21.776,6,21.5V20H2.5
               C2.224,20,2,19.776,2,19.5S2.224,19,2.5,19H6v-3H2.5z"
          />
          <path
            fill={navColors.navMorkGra}
            d="M23.5,2H20V0.5C20,0.224,19.776,0,19.5,0h-3C16.224,0,16,0.224,16,0.5V2H8V0.5C8,0.224,7.776,0,7.5,0h-3
		           C4.224,0,4,0.224,4,0.5V2H0.5C0.224,2,0,2.224,0,2.5V7h24V2.5C24,2.224,23.776,2,23.5,2z M7,4H5V1h2V4z M19,4h-2V1h2V4z"
          />
      </g>
  </svg>
);

export default CalendarIcon;

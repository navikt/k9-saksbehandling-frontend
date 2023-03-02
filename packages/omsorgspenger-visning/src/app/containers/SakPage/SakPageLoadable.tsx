/**
 * Asynchronously loads the component for SakPage
 */

import React from 'react';
import styled from 'styled-components/macro';
import { lazyLoad } from 'utils/loadable';
import { LoadingIndicator } from '../../components/LoadingIndicator';

const LoadingWrapper = styled.div`
  align-items: center;
  display: flex;
  height: 100vh;
  justify-content: center;
  width: 100%;
`;

export const SakPageLoadable = lazyLoad(
  () => import('./SakPage'),
  module => module.default,
  {
    fallback: (
      <LoadingWrapper>
        <LoadingIndicator />
      </LoadingWrapper>
    ),
  },
);

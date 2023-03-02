import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';
import { P } from './P';

const NotFoundPage = () => {
  const { t } = useTranslation();
  return (
    <>
      <Helmet>
        <title>{t('404Page')}</title>
        <meta name="description" content="Page not found" />
      </Helmet>
      <Wrapper>
        <Title>404</Title>
        <P>{t('404Page')}</P>
      </Wrapper>
    </>
  );
};

const Wrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 100vh;
  justify-content: center;
  min-height: 320px;
`;

const Title = styled.div`
  color: black;
  font-size: 3.375rem;
  font-weight: bold;
  margin-top: -8vh;

  span {
    font-size: 3.125rem;
  }
`;

export default NotFoundPage;

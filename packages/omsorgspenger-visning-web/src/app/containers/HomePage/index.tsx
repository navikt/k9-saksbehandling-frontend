import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import AppContainer from '../../components/AppContainer/AppContainer';
import ContentContainer from '../../components/ContentContainer/ContentContainer';
import PersonSøk from '../PersonSok/PersonSok';

const HomePage = () => {
  const { t } = useTranslation();
  return (
    <>
      <Helmet>
        <title>{t('homeTitle')}</title>
        <meta name="description" content={t('homepage.descr')} />
      </Helmet>
      <AppContainer>
        <ContentContainer>
          <PersonSøk />
        </ContentContainer>
      </AppContainer>
    </>
  );
};

export default HomePage;

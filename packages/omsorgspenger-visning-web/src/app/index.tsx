import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { GlobalStyle } from 'styles/global-styles';
import ErrorBoundary from './components/errors/ErrorBoundary';
import AuthChecker from './containers/AuthChecker';
import { HomePageLoadable } from './containers/HomePage/HomePageLoadable';
import { NotFoundPage } from './containers/NotFoundPage/Loadable';
import OmsorgspengerHeader from './containers/OmsorgspengerHeader/OmsorgspengerHeader';
import { SakPageLoadable } from './containers/SakPage/SakPageLoadable';
import { AuthProvider } from './state/auth/AuthProvider';

export function App() {
  // @ts-ignore
  return (
    <BrowserRouter>
      <Helmet
        titleTemplate="%s - Omsorgspenger visning"
        defaultTitle="Omsorgspenger visning"
      >
        <meta name="description" content="Omsorgspenger visning" />
      </Helmet>
      <AuthProvider>
        <OmsorgspengerHeader />
        <ErrorBoundary>
          <AuthChecker>
            <Routes>
              <Route path="/" element={<HomePageLoadable />} />
              <Route path="/sak/:saksnummer" element={<SakPageLoadable />} />
              <Route element={<NotFoundPage />} />
            </Routes>
          </AuthChecker>
        </ErrorBoundary>
        < // @ts-ignore
          GlobalStyle />
      </AuthProvider>
    </BrowserRouter>
  );
}

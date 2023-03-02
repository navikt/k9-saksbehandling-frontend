import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { LoginStatus } from '../state/auth/authActions';
import { useAuthContext } from '../state/auth/AuthProvider';

const AuthChecker = ({ children }) => {
  const { getUserInfo, state } = useAuthContext();
  const { t } = useTranslation();

  useEffect(() => {
    if (state.loginStatus === LoginStatus.NotloggedIn) {
      getUserInfo();
    }
  });

  if (state.loginStatus === LoginStatus.LoggedIn) {
    return <div>{children}</div>;
  }

  if (state.loginStatus === LoginStatus.Unauthorised) {
    return <p>{t('ingenTilgang')}</p>;
  }

  if (state.loginStatus === LoginStatus.UnknownError) {
    return <p>{t('innloggingsfeil')}</p>;
  }

  return <LoadingIndicator />;
};

export default AuthChecker;

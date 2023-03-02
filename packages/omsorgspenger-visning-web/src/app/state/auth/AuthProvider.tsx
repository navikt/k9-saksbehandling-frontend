import React from 'react';
import { apiRoutes } from '../../../utils/http/apiConfig';
import { get } from '../../../utils/http/request';
import ResponseError from '../../../utils/http/ResponseError';
import actionLogger from '../../middleware/actionLogger';
import { AuthActions, loadUser, unknownAuthError, userLoaded, userUnauthorised } from './authActions';
import { AuthState, authReducer, initialAuthState } from './AuthState';

// @ts-ignore
const AuthContext = React.createContext<AuthContextRaw>();

interface AuthContextRaw {
  state: AuthState;
  dispatch: React.Dispatch<AuthActions>;
}

export interface AuthContextProps extends AuthContextRaw {
  getUserInfo: () => void;
}

export const useAuthContext = (): AuthContextProps => {
  const context = React.useContext<AuthContextRaw>(AuthContext);
  if (!context) {
    throw new Error('useAuthContext kan kun brukes i en AuthProvider');
  }

  const { dispatch } = context;

  const getUserInfo = async () => {
    dispatch(loadUser());

    try {
      const { data } = await get(apiRoutes().Me);

      dispatch(userLoaded(data.name));
    } catch (e) {
      const { response } = e as ResponseError;
      if (response) {
        console.log(e);
        if (response.status === 403) {
          return dispatch(userUnauthorised());
        }
      }

      return dispatch(unknownAuthError());
    }
  };

  return {
    ...context,
    getUserInfo,
  };
};

interface OwnProps{
  children?: React.ReactNode;
}

export const AuthProvider: React.FunctionComponent<OwnProps> = props => {
  const [state, dispatch] = React.useReducer(
    actionLogger(authReducer, 'Auth'),
    initialAuthState,
  );

  const value: AuthContextRaw = React.useMemo(() => ({ state, dispatch }), [
    state,
  ]);

  return <AuthContext.Provider value={value} {...props} />;
};

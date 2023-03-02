import { AuthAction, AuthActions, LoginStatus } from './authActions';

export interface AuthState {
  loginStatus: LoginStatus;
  userName?: string;
}

export const initialAuthState: AuthState = {
  loginStatus: LoginStatus.NotloggedIn,
};

export const authReducer = (
  state: AuthState = initialAuthState,
  action: AuthActions,
): AuthState => {
  switch (action.type) {
    case AuthAction.LoadUser:
      return {
        ...state,
        loginStatus: LoginStatus.LoggingIn,
      };
    case AuthAction.UserLoaded:
      return {
        ...state,
        loginStatus: LoginStatus.LoggedIn,
        userName: action.userName,
      };
    case AuthAction.UserUnauthorised:
      return {
        ...state,
        loginStatus: LoginStatus.Unauthorised,
        userName: undefined,
      };
    case AuthAction.UnknownError:
      return {
        ...state,
        loginStatus: LoginStatus.UnknownError,
        userName: undefined,
      };
    default:
      return state;
  }
};

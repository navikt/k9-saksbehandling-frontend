export enum LoginStatus {
  LoggedIn = 'LoggedIn',
  LoggingIn = 'LoggingIn',
  NotloggedIn = 'NotloggedIn',
  Unauthorised = 'Unauthorised',
  UnknownError = 'UnknownError',
}

export enum AuthAction {
  LoadUser = 'Auth_LoadUser',
  UserLoaded = 'Auth_UserLoaded',
  UserUnauthorised = 'Auth_UserUnauthorised',
  UnknownError = 'Auth_UnknownError',
}

type LoadUserAction = {
  type: AuthAction.LoadUser;
};

type UserUnauthorisedAction = {
  type: AuthAction.UserUnauthorised;
};

type UserLoadedAction = {
  type: AuthAction.UserLoaded;
  userName: string;
};

type UnknownErrorAction = {
  type: AuthAction.UnknownError;
};

export const loadUser = (): LoadUserAction => ({ type: AuthAction.LoadUser });

export const userLoaded = (userName: string): UserLoadedAction => ({
  type: AuthAction.UserLoaded,
  userName,
});

export const unknownAuthError = (): UnknownErrorAction => ({
  type: AuthAction.UnknownError,
});

export const userUnauthorised = (): UserUnauthorisedAction => ({
  type: AuthAction.UserUnauthorised,
});

export type AuthActions =
  | LoadUserAction
  | UserLoadedAction
  | UserUnauthorisedAction
  | UnknownErrorAction;

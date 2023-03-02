import { getEnvironmentVariable, getLocation } from './browserUtils';

export const AUTH_PROXY_URL = () =>
  getEnvironmentVariable('OIDC_AUTH_PROXY_URL') || '';

const API_URL = () => `${AUTH_PROXY_URL()}/api`;
const SAK_URL = () => `${API_URL()}/sak`;

export const apiRoutes = () => ({
  Env: '/localapi/env',
  Me: `${AUTH_PROXY_URL()}/me`,
  Login: `${AUTH_PROXY_URL()}/login`,
  HentSaksnummer: `${SAK_URL()}/saksnummer`,
  Overføringer: `${API_URL()}/rammemeldinger/overforinger`,
  Koronaoverføringer: `${API_URL()}/rammemeldinger/korona-overforinger`,
  Fordelinger: `${API_URL()}/fordelinger`,
  Barn: `${API_URL()}/barn`,
  Kvote: `${API_URL()}/kvote`,
  Dokumenter: `${API_URL()}/dokumenter`,
  UidentifiserteRammemeldinger: `${API_URL()}/uidentifiserteRammemeldinger`
});

export const loginWithRedirect = () =>
  `${apiRoutes().Login}?redirect_uri=${encodeURIComponent(getLocation())}`;

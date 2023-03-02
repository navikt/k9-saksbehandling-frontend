import { Integrations, init } from '@sentry/browser';

const isDevelopment = process.env.NODE_ENV === 'development';
const environment = window.location.hostname;

const initSentry = () =>
  init({
    environment,
    dsn: isDevelopment
      ? 'http://dev@localhost:3000/1'
      : 'https://696e68dd296b4841b2426b9b0cdaaa8e@sentry.gc.nav.no/42',
    release: '1', // TODO endre denne til å bli satt av github actions
    integrations: [new Integrations.Breadcrumbs({ console: false })],
    beforeSend: (event, hint) => {
      // @ts-ignore
      const exception = hint.originalException;
      // @ts-ignore
      if (exception.isAxiosError) {
        // @ts-ignore
        const requestUrl = new URL(exception.request.responseURL);
        event.fingerprint = [
          '{{ default }}',
          // @ts-ignore
          String(exception.name),
          // @ts-ignore
          String(exception.message),
          String(requestUrl.pathname),
        ];
        event.extra = event.extra ? event.extra : {};
        // @ts-ignore
        event.extra.callId = exception.response.config.headers['Nav-Callid'];
      }
      return event;
    },
  });

export default initSentry;

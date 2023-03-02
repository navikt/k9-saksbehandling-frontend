import { App } from './app';
import * as React from 'react';
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import * as ReactDOM from 'react-dom';
import { HelmetProvider } from 'react-helmet-async';
import './locales/i18n'; // Initialize languages
import { apiRoutes } from './utils/http/apiConfig';
import { get } from './utils/http/request';
import initSentry from './utils/initSentry';
import {createRoot} from "react-dom/client";

initSentry();

get(apiRoutes().Env).then(({ data = {} }) => {
  // @ts-ignore
  window.appSettings = data;

  const container = document.getElementById('root');
  const root = createRoot(container!);

  interface Props {
    Component: typeof App;
  }
  const ConnectedApp = ({ Component }: Props) => (
    <HelmetProvider>
      <React.StrictMode>
        <Component />
      </React.StrictMode>
    </HelmetProvider>
  );

  const render = (Component: typeof App) => {
    root.render(<ConnectedApp Component={Component} />);
  };

  if (module.hot) {
    // Hot reloadable translation json files and app
    // modules.hot.accept does not accept dynamic dependencies,
    // have to be constants at compile-time
    module.hot.accept(['./app', './locales/i18n'], () => {
      root.unmount();
      const app = require('./app').App;
      render(app);
    });
  }

  render(App);
});

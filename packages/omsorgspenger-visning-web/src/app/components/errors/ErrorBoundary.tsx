import { captureException, withScope } from '@sentry/browser';
import React, { Component } from 'react';
import ErrorPage from './ErrorPage';

interface OwnProps {
  children?: React.ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<OwnProps, State> {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    withScope(scope => {
      Object.keys(info).forEach(key => {
        scope.setExtra(key, info[key]);
        captureException(error);
      });
    });

    console.error(error);
  }

  render() {
    const { children } = this.props;
    const { hasError } = this.state;

    return hasError ? <ErrorPage /> : children;
  }
}

export default ErrorBoundary;

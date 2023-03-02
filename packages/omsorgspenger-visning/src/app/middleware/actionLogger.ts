import React, { Reducer } from 'react';

const actionLogger = (reducer: Reducer<any, any>, stateName: string) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return React.useCallback(
    (state, action) => {
      const next = reducer(state, action);
      if (process.env.NODE_ENV !== 'development') {
        return next;
      }
      console.group(`${stateName} Action: ${action.type}`);
      console.log(
        `%c prev ${stateName} state`,
        'color: #a2a2a2; font-weight: bold;',
        state,
      );
      console.log('%c action', 'color: #00aaf7; font-weight: bold;', action);
      console.log(
        `%c next ${stateName} state`,
        'color: #4bb24f; font-weight: bolder;',
        next,
      );
      console.groupEnd();
      return next;
    },
    [reducer, stateName],
  );
};

export default actionLogger;

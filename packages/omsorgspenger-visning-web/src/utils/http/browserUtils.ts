export const getLocation = () => window.location.href;
export const redirect = (url: string) => (window.location.href = url);
export const getEnvironmentVariable = (variableName: string) => {
  // @ts-ignore
  const appSettings = window.appSettings;
  if (appSettings) {
    return appSettings[variableName];
  }

  return undefined;
};

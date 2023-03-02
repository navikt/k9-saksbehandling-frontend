import React, { useEffect } from 'react';
import { get } from './request';

type ReturnType = {
  data?: any;
  error?: any;
  loading: boolean;
};

const useGet = (url: string, options?: RequestInit): ReturnType => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  const [data, setData] = React.useState(null);

  const getData = async () => {
    try {
      setLoading(true);
      const response = await get(url, options);
      setData(response.data);
    } catch (e) {
      return setError(e as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line
  }, [url, options]);

  return { data, error, loading };
};

export default useGet;

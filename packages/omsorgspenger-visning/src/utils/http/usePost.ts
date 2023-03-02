import React, { useEffect } from 'react';
import { post } from './request';

type ReturnType = {
  data?: any;
  error?: any;
  loading: boolean;
};

const usePost = (url: string, body: any): ReturnType => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  const [data, setData] = React.useState(null);

  const postData = async () => {
    try {
      setLoading(true);
      const response = await post(url, body);
      setData(response.data);
    } catch (e) {
      return setError(e as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    postData();
    // eslint-disable-next-line
  }, [url, body]);

  return { data, error, loading };
};

export default usePost;

import { RequestInit } from 'next/dist/server/web/spec-extension/request';
import { useEffect, useState } from 'react';

const useFetch = (url: string, options?: RequestInit) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const handleFetch = async () => {
    try {
      const response = await fetch(url, { credentials: 'include', ...options });
      if (response.status === 401) {
        const refreshResponse = await fetch(
          'http://localhost:4000/api/auth/refresh',
          {
            method: 'POST',
            credentials: 'include',
          }
        );
        if (refreshResponse.ok) {
          handleFetch();
        } else {
          window.location.href = '/auth/login';
        }
      } else {
        const fetchData = await response.json();
        setData(fetchData);
        setLoading(false);
      }
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };
  useEffect(() => {
    handleFetch();
  }, [url]);

  return { data, loading, error };
};

export default useFetch;

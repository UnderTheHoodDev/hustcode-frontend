'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

function VerifyPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const verifyToken = async () => {
    const response = await fetch(
      `http://localhost:4000/api/auth/verify?token=${token}`,
      { credentials: 'include' }
    );
    const data = await response.json();
    console.log(data);
  };

  useEffect(() => {
    verifyToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <h1>Verify Page</h1>
    </div>
  );
}

export default VerifyPage;

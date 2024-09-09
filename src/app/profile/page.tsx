'use client';

import { useEffect, useState } from 'react';

import useFetch from '../../hooks/useFetch';

function ProfilePage() {
  const [user, setUser] = useState({});
  const { data, loading } = useFetch('http://localhost:4000/api/user');

  useEffect(() => {
    if (!loading) setUser(data);
  }, [data, loading]);
  return (
    <div>
      <h1>Profile Page</h1>
      <p>Your mail: {user.email}</p>
    </div>
  );
}

export default ProfilePage;

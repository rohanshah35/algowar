'use client';

import { useParams } from 'next/navigation';
import React from 'react';

const UserProfile: React.FC = () => {
  const params = useParams();
  const { username } = params;

  return (
    <div>
      <h1>Profile page for: {username}</h1>
    </div>
  );
};

export default UserProfile;

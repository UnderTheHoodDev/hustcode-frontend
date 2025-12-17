import { Metadata } from 'next';

import NavBar from '@/components/layouts/NavBar';
import ProfileContent from '@/components/profile/ProfileContent';

export const metadata: Metadata = {
  title: 'My Profile',
};

export default function ProfilePage() {
  return (
    <>
      <div className="layout-padding">
        <NavBar />
        <div className="py-8">
          <ProfileContent />
        </div>
      </div>
    </>
  );
}


import { Metadata } from 'next';

import { SignUpForm } from '@/components/auth/SignUpForm';

export const metadata: Metadata = {
  title: 'Sign Up | HUSTCODE',
  description: 'Welcome to HUSTCODE, your best coding platform',
};

export default function SignUp() {
  return (
    <div className="layout-padding flex flex-1 items-center justify-center">
      <SignUpForm />
    </div>
  );
}

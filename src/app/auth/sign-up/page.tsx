import { Metadata } from 'next';

import { SignUpForm } from '@/components/auth/SignUpForm';

export const metadata: Metadata = {
  title: 'Sign Up | HUSTCODE',
  description: 'Welcome to HUSTCODE, your best coding platform',
};

export default function SignUp() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <SignUpForm />
    </div>
  );
}

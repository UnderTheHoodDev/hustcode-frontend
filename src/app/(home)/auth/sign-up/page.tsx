import { Metadata } from 'next';

import { SignUpForm } from '@/components/auth/SignUpForm';

export const metadata: Metadata = {
  title: 'Sign Up',
};

export default function SignUp() {
  return (
    <div className="layout-padding flex flex-1 items-center justify-center">
      <SignUpForm />
    </div>
  );
}

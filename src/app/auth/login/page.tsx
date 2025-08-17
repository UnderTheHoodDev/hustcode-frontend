import { Metadata } from 'next';

import { LoginForm } from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Login | HUSTCODE',
  description: 'Welcome to HUSTCODE, your best coding platform',
};

export default function Login() {
  return (
    <div className="layout-padding flex flex-1 items-center justify-center">
      <LoginForm />
    </div>
  );
}

import { Metadata } from 'next';

import { LoginForm } from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Login | HUSTCODE',
  description: 'Welcome to HUSTCODE, your best coding platform',
};

export default function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <LoginForm />
    </div>
  );
}

import { Metadata } from 'next';

import { LoginForm } from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Login',
};

export default function Login() {
  return (
    <div className="layout-padding flex flex-1 items-center justify-center">
      <LoginForm />
    </div>
  );
}

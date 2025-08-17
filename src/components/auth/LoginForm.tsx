'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';

import { LoginDto } from '@/api/client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import PasswordInput from '@/components/ui/password-input';
import useLoginMutation from '@/lib/api/auth/mutations/use-login';
import { loginSchema, type LoginFormData } from '@/lib/schemas/auth';

export function LoginForm() {
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onSubmit',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { mutate: handleLogin, isPending: isLoggingIn } = useLoginMutation();

  const handleSubmit = (data: LoginDto) => {
    handleLogin(data);
  };

  const formFields = [
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'Enter your email',
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      placeholder: 'Enter your password',
    },
  ];

  return (
    <div className="flex w-full max-w-md translate-y-10 items-center justify-center sm:translate-y-8">
      <Card className="flex-1">
        <CardHeader className="space-y-1 px-4 sm:px-6">
          <CardTitle className="flex flex-col items-center justify-center gap-3 bg-gradient-to-r from-sky-500 to-pink-400 bg-clip-text text-2xl font-bold text-transparent">
            Start Coding
          </CardTitle>
          <CardDescription className="text-center">
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 px-4 sm:px-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              {formFields.map((fieldConfig) => (
                <FormField
                  key={fieldConfig.name}
                  control={form.control}
                  name={fieldConfig.name as keyof LoginFormData}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{fieldConfig.label}</FormLabel>
                      <FormControl>
                        {fieldConfig.type === 'password' ? (
                          <PasswordInput
                            type={fieldConfig.type}
                            placeholder={fieldConfig.placeholder}
                            className="text-xs"
                            {...field}
                          />
                        ) : (
                          <Input
                            type={fieldConfig.type}
                            placeholder={fieldConfig.placeholder}
                            className="text-xs"
                            {...field}
                          />
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}

              <Button
                type="submit"
                className="bg-background w-full cursor-pointer"
              >
                {isLoggingIn ? 'Logging in...' : 'Login'}
              </Button>
            </form>
          </Form>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">
              Don&apos;t have an account?{' '}
            </span>
            <Link
              href="/auth/sign-up"
              className="text-primary text-background font-medium hover:underline"
            >
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

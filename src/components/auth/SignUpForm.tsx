'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';

import { SignupDto } from '@/api/client';
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
import useSignUpMutation from '@/lib/api/auth/mutations/use-sign-up';
import { signUpSchema, type SignUpFormData } from '@/lib/schemas/auth';

export function SignUpForm() {
  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const { mutate: signUp, isPending: isSigningUp } = useSignUpMutation();

  const handleSubmit = (data: SignUpFormData) => {
    signUp({
      email: data.email,
      password: data.password,
    } as SignupDto);
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
      placeholder: 'Create a password',
    },
    {
      name: 'confirmPassword',
      label: 'Confirm Password',
      type: 'password',
      placeholder: 'Confirm your password',
    },
  ];

  return (
    <div className="flex w-full max-w-md translate-y-10 items-center justify-center sm:translate-y-8">
      <Card className="flex-1">
        <CardHeader className="space-y-1 px-4 sm:px-6">
          <CardTitle className="bg-gradient-to-r from-sky-500 to-pink-400 bg-clip-text text-center text-2xl font-bold text-transparent">
            Create Account
          </CardTitle>
          <CardDescription className="text-center">
            Sign up to get started with your account
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
                  name={fieldConfig.name as keyof SignUpFormData}
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

              <Button type="submit" className="w-full cursor-pointer">
                {isSigningUp ? 'Signing up...' : 'Sign up'}
              </Button>
            </form>
          </Form>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">
              Already have an account?{' '}
            </span>
            <Link
              href="/auth/login"
              className="text-primary font-medium hover:underline"
            >
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

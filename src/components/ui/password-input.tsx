'use client';

import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { forwardRef, useState } from 'react';

import { Input } from '@/components/ui/input';

export type PasswordInputProps = React.InputHTMLAttributes<HTMLInputElement>;

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword((prev) => !prev);
    };

    return (
      <Input
        className={className}
        suffix={
          showPassword ? (
            <EyeIcon
              onClick={togglePasswordVisibility}
              className="absolute top-[-2px] right-3 h-5 w-5 translate-y-1/2 cursor-pointer text-gray-500"
            />
          ) : (
            <EyeOffIcon
              onClick={togglePasswordVisibility}
              className="absolute top-[-2px] right-3 h-5 w-5 translate-y-1/2 cursor-pointer text-gray-500"
            />
          )
        }
        type={showPassword ? 'text' : 'password'}
        {...props}
        ref={ref}
      />
    );
  }
);

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;

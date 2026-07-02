import { Eye, EyeOff } from 'lucide-react';
import { useCallback, useState } from 'react';

type PasswordVisibilityResult = Readonly<{
  showPassword: boolean;
  InputIcon: typeof Eye;
  togglePassword: () => void;
}>;

export const usePasswordVisibility = (): PasswordVisibilityResult => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const togglePassword = useCallback(() => setShowPassword((previous) => !previous), []);

  return {
    showPassword,
    togglePassword,
    InputIcon: showPassword ? EyeOff : Eye,
  };
};

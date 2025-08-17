import { LoginDto, SignupDto } from '@/api/client';
import { authConnect } from '@/api/guest';

const login = async (payload: LoginDto) => {
  return await authConnect.authControllerLogin(payload);
};

const signUp = async (payload: SignupDto) => {
  return await authConnect.authControllerSignup(payload);
};

const logout = async () => {
  return await authConnect.authControllerLogout();
};

const refreshToken = async () => {
  return await authConnect.authControllerRefresh();
};

export { login, logout, refreshToken, signUp };

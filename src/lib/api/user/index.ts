import { userConnect } from '@/api/user';

const getUserMe = async () => {
  return await userConnect.userControllerGetUser();
};

export { getUserMe };

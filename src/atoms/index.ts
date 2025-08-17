import { atom } from 'jotai';

import { UserInfo } from '@/types/user';

export const userInfoAtom = atom<UserInfo>({
  id: '',
  name: '',
  email: '',
  avatar: '',
  role: '',
});

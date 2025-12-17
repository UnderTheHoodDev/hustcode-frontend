import { atomWithStorage } from 'jotai/utils';

import { UserInfo } from '@/types/user';

export const userInfoAtom = atomWithStorage<UserInfo>('userInfo', {
  id: '',
  name: '',
  email: '',
  avatar: '',
  role: '',
});

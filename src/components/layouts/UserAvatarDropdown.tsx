'use client';

import { useAtomValue } from 'jotai';
import { useRouter } from 'next/navigation';
import { FiLogOut, FiSettings, FiUser } from 'react-icons/fi';

import { userInfoAtom } from '@/atoms';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import useLogoutMutation from '@/lib/api/auth/mutations/use-logout';
import { getUserInitials } from '@/utils/user';

const UserAvatarDropdown = () => {
  const router = useRouter();
  const userInfo = useAtomValue(userInfoAtom);

  const { mutate: logout } = useLogoutMutation();

  const handleLogout = () => {
    logout();
  };

  const handleProfile = () => {
    router.push('/profile');
  };

  const handleSettings = () => {};

  return (
    <div className="flex items-center justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="relative h-9 w-9 cursor-pointer rounded-full border-1 border-gray-700">
            <Avatar className="h-9 w-9">
              <AvatarImage src={userInfo.avatar} alt={userInfo.name} />
              <AvatarFallback className="bg-background-primary border-1 border-gray-700">
                {getUserInitials(userInfo.name)}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          forceMount
          className="bg-background-primary w-60 rounded-sm border border-gray-700 shadow-lg"
        >
          <DropdownMenuLabel>
            <div className="space-y-1">
              <p className="line-clamp-1 text-sm font-medium break-words text-gray-400">
                {userInfo.name ?? 'Anonymous'}
              </p>
              <p className="line-clamp-2 text-xs font-normal break-words text-gray-500">
                {userInfo.email}
              </p>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator className="border-t border-gray-700" />

          <DropdownMenuItem
            onClick={handleProfile}
            className="group cursor-pointer text-sm text-gray-400 hover:bg-gray-300 hover:text-gray-800"
          >
            <FiUser className="mr-2 h-4 w-4 text-gray-400 group-hover:text-gray-800" />
            <span>My Profile</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={handleSettings}
            className="group cursor-pointer text-sm text-gray-400 hover:bg-gray-300 hover:text-gray-800"
          >
            <FiSettings className="mr-2 h-4 w-4 text-gray-400 group-hover:text-gray-800" />
            <span>Settings</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="border-t border-gray-700" />

          <DropdownMenuItem
            onClick={handleLogout}
            className="text-error focus:text-error focus:bg-background-error cursor-pointer"
          >
            <FiLogOut className="text-error mr-2 h-4 w-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserAvatarDropdown;

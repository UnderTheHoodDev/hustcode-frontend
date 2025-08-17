'use client';

import { useAtomValue } from 'jotai';
import { FiLogOut, FiSettings, FiUser } from 'react-icons/fi';

import { userInfoAtom } from '@/atoms';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import useLogoutMutation from '@/lib/api/auth/mutations/use-logout';
import { getUserInitials } from '@/utils/user';

const UserAvatarAccordion = () => {
  const userInfo = useAtomValue(userInfoAtom);

  const { mutate: logout } = useLogoutMutation();

  const handleLogout = () => {
    logout();
  };

  const handleProfile = () => {};

  const handleSettings = () => {};

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="user-menu" className="w-full">
        <AccordionTrigger className="w-full gap-0! p-0 pb-4">
          <div className="flex w-3/4 items-center gap-2">
            <div className="relative h-10 w-10 cursor-pointer rounded-full p-0">
              <Avatar className="h-10 w-10">
                <AvatarImage src={userInfo.avatar} alt={userInfo.name} />
                <AvatarFallback className="bg-background-primary border-2 border-gray-700">
                  {getUserInitials(userInfo.name)}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="w-5/6 space-y-1 text-left">
              <p className="line-clamp-1 text-sm font-medium break-words">
                {userInfo.name ?? 'Anonymous'}
              </p>
              <p className="line-clamp-1 text-xs font-normal break-words text-gray-500">
                {userInfo.email}
              </p>
            </div>
          </div>
        </AccordionTrigger>

        <AccordionContent className="border-t border-gray-700 p-0 pt-2 font-normal">
          <div
            onClick={handleProfile}
            className="py-3text-sm flex w-full items-center py-3 text-gray-400 hover:bg-gray-300 hover:text-gray-800"
          >
            <FiUser className="mr-3 h-4 w-4" />
            <span>My Profile</span>
          </div>

          <div
            onClick={handleSettings}
            className="flex w-full items-center py-3 text-sm text-gray-400 hover:bg-gray-300 hover:text-gray-800"
          >
            <FiSettings className="mr-3 h-4 w-4" />
            <span>Settings</span>
          </div>

          <div
            onClick={handleLogout}
            className="text-error focus:text-error focus:bg-background-error flex w-full items-center py-3 text-sm"
          >
            <FiLogOut className="mr-3 h-4 w-4" />
            <span>Logout</span>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default UserAvatarAccordion;

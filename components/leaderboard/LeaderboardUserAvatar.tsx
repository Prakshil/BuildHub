import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface LeaderboardUserAvatarProps {
  name: string;
  avatarUrl?: string;
}

export const LeaderboardUserAvatar: React.FC<LeaderboardUserAvatarProps> = ({ 
  name, 
  avatarUrl 
}) => {
  return (
    <Avatar>
      {avatarUrl && <AvatarImage src={avatarUrl} />}
      <AvatarFallback>{name.charAt(0)}</AvatarFallback>
    </Avatar>
  );
};
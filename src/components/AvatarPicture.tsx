import React, { useState } from 'react'
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from '@prisma/client';
import avatar1 from '../rsrc/Profile_Pictures/avatar1.jpg'
import avatar2 from '../rsrc/Profile_Pictures/avatar2.jpg'
import avatar3 from '../rsrc/Profile_Pictures/avatar3.png'
import avatar4 from '../rsrc/Profile_Pictures/avatar4.png'
import avatar5 from '../rsrc/Profile_Pictures/avatar5.png'
import avatar6 from '../rsrc/Profile_Pictures/avatar6.png'
import avatar7 from '../rsrc/Profile_Pictures/avatar7.png'

// Mapping of avatar numbers to their respective image imports
const avatarMapping : any = {
  1: avatar1,
  2: avatar2,
  3: avatar3,
  4: avatar4,
  5: avatar5,
  6: avatar6,
  7: avatar7
} as const;

function AvatarPicture({ user }: { user: User }) {

  const avatarNumber = user.avatar ?? 1;
  const selectedAvatar = avatarMapping[avatarNumber] || avatar1;

  return (
    <Avatar>
      <AvatarImage asChild src={selectedAvatar.src}>
        <Image 
          src={selectedAvatar} 
          alt={`avatar-${avatarNumber}`} 
          width={60} 
          height={60} 
          priority={true} 
        />
      </AvatarImage>
      <AvatarFallback>BF</AvatarFallback>
    </Avatar>
  );
}

export default AvatarPicture;
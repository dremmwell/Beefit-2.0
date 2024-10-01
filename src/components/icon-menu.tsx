import { ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface MenuIconProps {
  icon: ReactNode;
  text: string;
  className?: string;
}

export default function IconMenu({ className, icon, text }: MenuIconProps) {
  return (
    <div
      className={cn(
        'flex flex-row text-center items-center justify-center',
        className,
      )}
    >
      {icon}
      {text != "" ?
        <span className="text-sm mx-2">{text}</span>
       : 
      <></>    
      }
    </div>
  );
}
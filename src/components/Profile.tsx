import React from 'react'
import {
Avatar,
AvatarFallback,
AvatarImage,
} from "@/components/ui/avatar"
import {
Dialog,
DialogContent,
DialogHeader,
DialogTitle,
DialogTrigger,
DialogDescription,
DialogFooter
} from "@/components/ui/dialog"
import {
Tooltip,
TooltipContent,
TooltipProvider,
TooltipTrigger,
} from "@/components/ui/tooltip"
import { User } from '@prisma/client'
import { ModeToggle } from './ModeToggle'
import ImagePicker from './ImagePicker'
import AvatarPicture from './AvatarPicture'
import { Button } from './ui/button'
import { Input } from "@/components/ui/input"
import { Label } from './ui/label'
import { LogOut } from './auth/LogOut'
import { DeleteAccount } from './DeleteAccount'
import { Separator } from './ui/separator'
import { useState } from 'react'
import { signOut } from "@/app/actions/auth.actions"

function Profile({user} : {user : User}) {

    const userDate = new Date(user.createdAt);

  return (
    <Dialog >
        <DialogTrigger >
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <AvatarPicture user={user} />
                    </TooltipTrigger>
                    <TooltipContent>
                    <p>Manage Profile</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
            <DialogTitle>Profile</DialogTitle>
            <DialogDescription>
                Manage your profile preferences
            </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4">
                <div className='flex items-center gap-4'>
                    <Label >Username</Label>
                    <Input type="text" placeholder={user.username} />
                    <div className='ml-auto'>
                        <Button variant="outline">Edit</Button>
                    </div>
                </div>
                <div className='flex items-center gap-4'>
                    <Label >Email</Label>
                    <Input type="email" placeholder="Email"/>
                    <div className='ml-auto'>
                        <Button variant="outline">Edit</Button>
                    </div>
                </div>
                <div className='flex items-center gap-4'>
                    <Label >Avatar</Label>
                        <AvatarPicture user={user}/>
                    <div className='ml-auto'>
                        <ImagePicker user={user}/>
                    </div>
                </div>
                <div className='flex items-center gap-4'>
                    <Label >Appearance mode</Label>
                    <ModeToggle />
                </div>
                <Label className='italic text-muted-foreground ml-auto'>Account created on {userDate.toLocaleString("en-GB", {month : 'long', day : 'numeric', year : 'numeric'})}</Label>
                <Separator />
            </div>
            <DialogFooter>
                <div className='mr-auto'>
                 <DeleteAccount />
                </div>
{/*                 <LogOut/> Why does logging out here bugs? Dialogs to close?*/}
            </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}

export default Profile

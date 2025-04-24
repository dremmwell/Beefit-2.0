import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {changeProfilePicture} from "../app/actions/db.actions/user.action"
import { User } from '@prisma/client'
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react'

import avatar1 from '../rsrc/Profile_Pictures/avatar1.jpg'
import avatar2 from '../rsrc/Profile_Pictures/avatar2.jpg'
import avatar3 from '../rsrc/Profile_Pictures/avatar3.png'
import avatar4 from '../rsrc/Profile_Pictures/avatar4.png'
import avatar5 from '../rsrc/Profile_Pictures/avatar5.png'
import avatar6 from '../rsrc/Profile_Pictures/avatar6.png'
import avatar7 from '../rsrc/Profile_Pictures/avatar7.png'


const avatars = [
  {
    id: 1,
    name: "Rick",
    image: avatar1,
    fallback: "RS",
  },
  {
    id: 2,
    name: "Morty",
    image: avatar2,
    fallback: "MS",
  },
  {
    id: 3,
    name: "Zane",
    image: avatar3,
    fallback: "FZ",
  },
  {
    id: 4,
    name: "Success",
    image: avatar4,
    fallback: "SK",
  },
  {
    id: 5,
    name: "Dicaprio",
    image: avatar5,
    fallback: "LD",
  },
  {
    id: 6,
    name: "Think",
    image: avatar6,
    fallback: "TM",
  },
  {
    id: 7,
    name: "Oprah",
    image: avatar7,
    fallback: "OW",
  },
]

function ImagePicker( {user} : { user : User}) {
  const [selectedAvatar, setSelectedAvatar] = useState(user.avatar.toString())

  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast();
   const [loading, setLoading] = useState(false);

  async function onPictureSave() {
    setLoading(true)
    if(selectedAvatar == user.avatar.toString()){
      setIsOpen(false)
    }
    else{
      try{
        await changeProfilePicture(user.id, parseInt(selectedAvatar));
        toast({
          title: `New Avatar set!`,
        });
        setIsOpen(false)
      }
      catch(error){
        console.log(error)
      }
      finally {
        setLoading(false)
      }
    }
  }

  return (
     <Dialog open={isOpen} onOpenChange={setIsOpen}>
     <DialogTrigger asChild>
       <Button variant="outline">Change Avatar</Button>
     </DialogTrigger>
     <DialogContent className="sm:max-w-[425px]">
       <DialogHeader>
         <DialogTitle>Edit your Avatar</DialogTitle>
         <DialogDescription>
           Select a new Avatar
         </DialogDescription>
       </DialogHeader>
       <RadioGroup
        value={selectedAvatar}
        onValueChange={setSelectedAvatar}
        className="flex flex-wrap gap-4"
      >
        {avatars.map((avatar) => (
          <div key={avatar.id} className="relative">
            <RadioGroupItem value={avatar.id.toString()} id={avatar.id.toString()} className="sr-only" />
            <Label
              htmlFor={avatar.id.toString()}
              className={`flex flex-col items-center gap-2 rounded-lg border-2 p-3 cursor-pointer transition-all ${
                selectedAvatar === avatar.id.toString()
                  ? "border-primary bg-primary/5"
                  : "border-transparent hover:border-muted-foreground/25 hover:bg-muted/50"
              }`}
            >
              <Avatar className={`h-20 w-20`}>
                <AvatarImage src={avatar.image.src} alt={avatar.name} />
                <AvatarFallback>{avatar.fallback}</AvatarFallback>
              </Avatar>
              {selectedAvatar === avatar.id.toString() && (
                <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              )}
            </Label>
          </div>
        ))}
      </RadioGroup>
       <DialogFooter className='flex items-center'>
            <Button disabled={loading} onClick={onPictureSave} variant="default" className="flex-grow">
              {loading && (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
              )}
              Save change
            </Button>
       </DialogFooter>
     </DialogContent>
   </Dialog>
  )
}

export default ImagePicker

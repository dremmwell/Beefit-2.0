"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { SignUpSchema } from "@/app/types/auth.schema"
import { signUp } from "@/app/actions/auth.actions"
import { toast } from "../ui/use-toast"
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react"

export function SignupForm() {

  const router = useRouter() 
  
  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  })
  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(values: z.infer<typeof SignUpSchema>) {
    const res = await signUp(values);
    if(res.error){
      toast({
        variant: 'destructive',
        description: res.error
      })
    } else if(res.success) {
      toast({
        variant: 'default',
        description: "Account created sucessfully"
      })
      router.push("/app")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
                <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="******" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
                <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input placeholder="******" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isSubmitting} type="submit">
          {isSubmitting && (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          )}
          Sign up
          </Button>
      </form>
    </Form>
  )
}
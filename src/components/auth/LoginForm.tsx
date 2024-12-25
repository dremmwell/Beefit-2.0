"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { LogInSchema } from "@/app/types/auth.schema"
import { toast } from "../ui/use-toast"
import { useRouter } from "next/navigation"
import { logIn } from "@/app/actions/auth.actions"
import { Loader2 } from "lucide-react"

export function LoginForm() {

  const router = useRouter() 

      // 1. Define your form.
  const form = useForm<z.infer<typeof LogInSchema>>({
    resolver: zodResolver(LogInSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  const isSubmitting = form.formState.isSubmitting;
 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof LogInSchema>) {
    const res = await logIn(values);
    if(res?.error){
      toast({
        variant: 'destructive',
        description: res.error
      })
    } else if(res?.success) {
      toast({
        variant: 'default',
        description: "Logged in"
      })
      router.push("/app/today")
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
        <Button disabled={isSubmitting} type="submit">
        {isSubmitting && (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          )}
          Log in</Button>
      </form>
    </Form>
  )
}
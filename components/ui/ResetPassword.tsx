"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SparklesHeading } from "./sparkle-heading";
import { toast } from "react-hot-toast";
import { checkVerificationToken } from "@/app/lib/actions/verify";
import { checkResetToken } from "@/app/lib/actions/reset";

const FormSchema = z
  .object({
    email: z.string().email(),
    otp: z.string().min(6).max(6),
    password: z.string().min(6, {
      message: "Password must be at least 6 characters long",
    }),
    confirmpassword: z.string(),
  })
  .refine((data) => data.password === data.confirmpassword, {
    message: "Passwords don't match",
    path: ["confirmpassword"],
  });

export default function Reset() {
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      otp: "",
      password: "",
      confirmpassword: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const res = await checkResetToken(data.email, data.otp, data.password);
      if (res && res.status === 200) {
        toast.success("Your password has been reset");
        router.push("/signin");
      } else {
        toast.error("Invalid OTP");
      }
    } catch (e) {
      toast.error("Invalid OTP");
    }
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen min-w-screen">
      <SparklesHeading text="Reset" />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6 items-center"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="self-center ml-5 md:ml-0">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Re-enter your email"
                      {...field}
                      className="w-64 md:w-72 lg:w-80 xl:w-96"
                    />
                  </FormControl>
                  <FormDescription>
                    Double enforcing your security.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem className="self-center">
                  <FormLabel>OTP</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="******"
                      {...field}
                      className="w-64 md:w-72 lg:w-80 xl:w-96"
                    />
                  </FormControl>
                  <FormDescription>Check your email</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="self-center ml-5 md:ml-0">
                  <FormLabel>New password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="********"
                      {...field}
                      className="w-64 md:w-72 lg:w-80 xl:w-96"
                    />
                  </FormControl>
                  <FormDescription>Pick a new one.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmpassword"
              render={({ field }) => (
                <FormItem className="self-center">
                  <FormLabel>OTP</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="********"
                      {...field}
                      className="w-64 md:w-72 lg:w-80 xl:w-96"
                    />
                  </FormControl>
                  <FormDescription>Re-enter your new password.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col justify-center">
            <Button
              type="submit"
              className="w-48 h-10 lg:h-12 lg:w-64 lg:text-lg xl:h-14 xl:w-80 xl:text-xl flex-row justify-center items-center"
            >
              <span className="ml-2">Reset password</span>
            </Button>
          </div>
        </form>
      </Form>
      <span className="flex flex-row mt-5 gap-1">
        <p className="text-xs">Having problems?</p>
      </span>
      <span className="flex flex-row mt-2 gap-1">
        <p className="text-xs">Write to us at uwallettest@gmail.com</p>
      </span>
    </div>
  );
}

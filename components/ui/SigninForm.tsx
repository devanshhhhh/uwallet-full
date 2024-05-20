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
import { checkVerified } from "@/app/lib/actions/checkVerified";
import { sendVerificationToken } from "@/app/lib/actions/verify";

const FormSchema = z.object({
  phone: z.string(),
  password: z.string(),
});

export default function SigninForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      phone: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const res = await signIn("credentials", {
        redirect: false,
        phone: data.phone,
        password: data.password,
      });
      if (res && res.ok === true) {
        console.log(JSON.stringify(res));
        const vef = await checkVerified(data.phone);
        if (vef && vef.status === 200) {
          toast.success("You're now logged in");
          router.push("/dashboard");
        } else {
          const mail = await sendVerificationToken(vef.email);
          if (mail && mail.status === 200) {
            router.push("/verify");
          } else {
            toast.error("Couldn't send the verification OTP, try again later");
          }
        }
      } else {
        toast.error("Invalid credentials");
      }
    } catch (e) {
      toast.error("Invalid credentials");
    }
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen min-w-screen">
      <SparklesHeading text="Welcome" />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6 items-center"
        >
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="self-center ml-5 md:ml-0">
                <FormLabel>Phone / Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="+91 XXXX-XXX-XXX / example@email.com"
                    {...field}
                    className="w-64 md:w-72 lg:w-80 xl:w-96"
                  />
                </FormControl>
                <FormDescription>
                  We&apos;ll never share your phone with anyone else.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="self-center">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="********"
                    {...field}
                    className="w-64 md:w-72 lg:w-80 xl:w-96"
                  />
                </FormControl>
                <FormDescription>Choose a strong password.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col justify-center">
            <Button
              type="submit"
              className="w-48 h-10 lg:h-12 lg:w-64 lg:text-lg xl:h-14 xl:w-80 xl:text-xl flex-row justify-center items-center"
            >
              <span className="ml-2">Log in</span>
            </Button>
          </div>
        </form>
      </Form>
      <span className="flex flex-row mt-5 gap-1">
        <a href="/reset" className="underline text-xs">
          Forgot password?
        </a>
      </span>
      <span className="flex flex-row mt-2 gap-1">
        <p className="text-xs">Don&apos;t have an account?</p>
        <a href="/signup" className="underline text-xs">
          Sign up
        </a>
      </span>
    </div>
  );
}

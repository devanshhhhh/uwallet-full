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
import { signUp } from "@/app/lib/actions/signupUser";
import { sendVerificationToken } from "@/app/lib/actions/verify";

const FormSchema = z
  .object({
    firstname: z.string(),
    lastname: z.string(),
    email: z.string().email(),
    phone: z.string().min(10, {
      message: "Invalid phone number.",
    }),
    password: z.string().min(6, {
      message: "Password must be at least 6 characters long",
    }),
    confirmpassword: z.string(),
  })
  .refine((data) => data.password === data.confirmpassword, {
    message: "Passwords don't match",
    path: ["confirmpassword"],
  });

export default function SignupForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
      password: "",
      confirmpassword: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const res = await signUp({
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        number: data.phone,
        password: data.password,
      });
      if (res && !res.status) {
        toast.success("Account created, please verify");
        const res = await sendVerificationToken(data.email);
        if (res && res.status === 200) {
          router.push("/verify");
        } else {
          toast.error("Couldn't send the verification OTP, try again later");
        }
      } else if (res && res.status) {
        toast.error("Account already exists");
        router.push("/signin");
      } else {
        toast.error("Bad request, please try again later");
      }
    } catch (e) {
      toast.error("Bad request, please try again later");
    }
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen min-w-screen">
      <SparklesHeading text="Hi there" />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6 items-center"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <FormField
              control={form.control}
              name="firstname"
              render={({ field }) => (
                <FormItem className="self-center ml-5 md:ml-0">
                  <FormLabel>First name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John"
                      {...field}
                      className="w-64 md:w-72 lg:w-80 xl:w-96"
                    />
                  </FormControl>
                  <FormDescription>What should we call you?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastname"
              render={({ field }) => (
                <FormItem className="self-center ml-5 md:ml-0">
                  <FormLabel>Last name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Doe"
                      {...field}
                      className="w-64 md:w-72 lg:w-80 xl:w-96"
                    />
                  </FormControl>
                  <FormDescription>And your family name?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="self-center ml-5 md:ml-0">
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="+91 XXXX-XXX-XXX"
                      {...field}
                      className="w-64 md:w-72 lg:w-80 xl:w-96"
                    />
                  </FormControl>
                  <FormDescription>
                    We'll never share your phone with anyone else.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="self-center">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="example@mail.com"
                      {...field}
                      className="w-64 md:w-72 lg:w-80 xl:w-96"
                    />
                  </FormControl>
                  <FormDescription>We have a no spam policy.</FormDescription>
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
            <FormField
              control={form.control}
              name="confirmpassword"
              render={({ field }) => (
                <FormItem className="self-center">
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="********"
                      {...field}
                      className="w-64 md:w-72 lg:w-80 xl:w-96"
                    />
                  </FormControl>
                  <FormDescription>Re-type your password.</FormDescription>
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
              <span className="ml-2">Get started</span>
            </Button>
          </div>
        </form>
      </Form>
      <span className="flex flex-row mt-5 gap-1">
        <p className="text-xs">Already have an account?</p>
        <a href="/signin" className="underline text-xs">
          Sign in
        </a>
      </span>
    </div>
  );
}

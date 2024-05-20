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
import { useRouter } from "next/navigation";
import { SparklesHeading } from "./sparkle-heading";
import { toast } from "react-hot-toast";
import { sendResetToken } from "@/app/lib/actions/reset";

const FormSchema = z.object({
  email: z.string().email(),
});

export default function StartReset() {
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const res = await sendResetToken(data.email);
      if (res && res.status === 200) {
        toast.success("Reset OTP has been sent to your email");
        router.push("/newpassword");
      } else {
        toast.error("Invalid credentials");
      }
    } catch (e) {
      toast.error("Invalid credentials");
    }
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen min-w-screen">
      <SparklesHeading text="No worries" />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6 items-center"
        >
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
                <FormDescription>Let us find your account</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col justify-center">
            <Button
              type="submit"
              className="w-48 h-10 lg:h-12 lg:w-64 lg:text-lg xl:h-14 xl:w-80 xl:text-xl flex-row justify-center items-center"
            >
              <span className="ml-2">Verify</span>
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

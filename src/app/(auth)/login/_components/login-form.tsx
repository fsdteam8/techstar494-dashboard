"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." }),
  rememberMe: z.boolean(),
});

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);

      const res = await signIn("credentials", {
        email: values?.email,
        password: values?.password,
        redirect: false,
      });

      if (res?.error) {
        throw new Error(res.error);
      }

      toast.success("Login successful!");
      router.push("/");
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div>
      <div className="w-full md:w-[570px]">
        <h3 className="text-2xl md:text-[32px] lg:text-[40px] font-bold text-black text-left leading-[120%] ">
          Login to Account
        </h3>
        <p className="text-base md:text-lg lg:text-xl font-medium text-[#B0B0B0] leading-[120%] pt-[5px]">
          Please enter your email and password to continue
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 pt-5 md:pt- lg:pt-8"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium leading-[120%] text-black">
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="w-full h-[51px] text-base font-medium leading-[120%] text-black rounded-[8px] p-4 border border-[#272727] placeholder:text-[#272727]"
                      placeholder="Enter your email address"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium leading-[120%] text-black">
                    Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        className="w-full h-[51px] text-base font-medium leading-[120%] text-black rounded-[8px] p-4 border border-[#272727] placeholder:text-[#272727]"
                        placeholder="Enter your password"
                        {...field}
                      />
                      <button
                        type="button"
                        className="absolute top-3.5 right-4"
                      >
                        {showPassword ? (
                          <Eye onClick={() => setShowPassword(!showPassword)} />
                        ) : (
                          <EyeOff
                            onClick={() => setShowPassword(!showPassword)}
                          />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <div className="w-full flex items-center justify-between">
                  <FormItem className="flex items-center gap-[10px]">
                    <FormControl className="mt-2">
                      <Checkbox
                        id="rememberMe"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-primary data-[state=checked]:text-white border-primary"
                      />
                    </FormControl>
                    <Label
                      className="text-sm font-normal text-black leading-[120%]"
                      htmlFor="rememberMe"
                    >
                      Remember Me
                    </Label>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                  <Link
                    className="text-sm font-normal text-black cursor-pointer leading-[120%] hover:underline"
                    href="/forgot-password"
                  >
                    Forgot Password?
                  </Link>
                </div>
              )}
            />
            <div className="pt-4">
              <Button
                disabled={isLoading}
                className="text-base font-medium text-white cursor-pointer leading-[120%] rounded-[8px] py-4 w-full h-[51px] bg-primary"
                type="submit"
              >
                {isLoading ? "Sign In ..." : "Sign In"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default LoginForm;

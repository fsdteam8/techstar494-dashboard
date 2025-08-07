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
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";

const formSchema = z
  .object({
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long." }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const ResetPasswordForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const accessToken = searchParams.get("accessToken") || "";
  


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["reset-password"],
    mutationFn: (values: { newPassword: string }) =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/reset-password`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(values),
      }).then((res) => res.json()),
    onSuccess: (data) => {
      if (!data?.success) {
        toast.error(data?.message || "Something went wrong");
        return;
      } else {
        toast.success(data?.message || "Password Change successfully!");
        router.push(`/login`);
      }
    },
  });

  if(!accessToken){
  router.push("/login");
  return;
}

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // console.log(values);
    mutate({ newPassword: values.password });
  }
  return (
    <div>
      <div className="w-full md:w-[570px]">
        <h3 className="text-2xl md:text-[32px] lg:text-[40px] font-bold text-black text-left leading-[120%] ">
          Reset Password
        </h3>
        <p className="text-base md:text-lg lg:text-xl font-medium text-[#B0B0B0] leading-[120%] pt-[5px]">
          Create your new password
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 pt-5 md:pt-6"
          >
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
                        className="w-full h-[48px] text-base font-medium leading-[120%] text-[#293440] rounded-[8px] p-4 border border-[#6C6C6C] placeholder:text-[#787878]"
                        placeholder="Enter Password ...."
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
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium leading-[120%] text-black">
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        className="w-full h-[51px] text-base font-medium leading-[120%] text-black rounded-[8px] p-4 border border-[#272727] placeholder:text-[#272727]"
                        placeholder="Enter Password ...."
                        {...field}
                      />
                      <button
                        type="button"
                        className="absolute top-3.5 right-4"
                      >
                        {showConfirmPassword ? (
                          <Eye
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                          />
                        ) : (
                          <EyeOff
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                          />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <Button
              disabled={isPending}
              className="text-base font-medium text-white cursor-pointer leading-[120%] rounded-[8px] py-4 w-full h-[51px] bg-primary"
              type="submit"
            >
              {isPending ? "Continuing..." : "Continue"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ResetPasswordForm;

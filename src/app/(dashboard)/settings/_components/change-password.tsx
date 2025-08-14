"use client";

import { z } from "zod";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

// ✅ Zod schema with validation rules
const formSchema = z
  .object({
    currentPassword: z
      .string()
      .min(6, "Current password must be at least 6 characters."),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters."),
    confirmPassword: z.string().min(6, "Please confirm your new password."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type FormValues = z.infer<typeof formSchema>;

export default function ChangePasswordForm() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const session = useSession();
  const token = (session?.data?.user as { accessToken: string })?.accessToken;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["changePassword"],
    mutationFn: (values: { currentPassword: string; newPassword: string }) =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      }).then((res) => res.json()),
    onSuccess: (data) => {
      if (!data?.success) {
        toast.error(data?.message || "Something went wrong");
        return;
      }
      toast.success(data?.message || "Password Change successfully!");
      form.reset();
    },
  });

  const onSubmit = (values: FormValues) => {
    // console.log("Submitted Data:", values);
    const payload = {
      currentPassword: values?.currentPassword,
      newPassword: values?.newPassword,
    };
    mutate(payload);
  };

  return (
    <div className="mt-10">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="border border-[#B0B0B0] rounded-[16px] p-6"
        >
          <h3 className="text-xl font-semibold leading-[120%] text-black mb-5">
            Change Password
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[30px]">
            {/* Current Password */}
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium text-black leading-[120%]">
                    Current Password
                  </FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        {...field}
                        type={showCurrent ? "text" : "password"}
                        placeholder="••••••••••••••••••"
                        className="h-[51px] border border-[#6B46C1] rounded-[8px] p-4 bg-transparent placeholder:text-[#6B46C1] text-[#6B46C1] text-base font-medium leading-[120%] placeholder:font-medium placeholder:leading-[120%] "
                      />
                    </FormControl>
                    <span
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 cursor-pointer"
                      onClick={() => setShowCurrent((prev) => !prev)}
                    >
                      {showCurrent ? (
                        <EyeOff size={20} className="text-[#6B46C1]" />
                      ) : (
                        <Eye size={20} className="text-[#6B46C1]" />
                      )}
                    </span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* New Password */}
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium text-black leading-[120%]">
                    New Password
                  </FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        {...field}
                        type={showNew ? "text" : "password"}
                        placeholder="••••••••••••••••••"
                        className="h-[51px] border border-[#6B46C1] rounded-[8px] p-4 bg-transparent placeholder:text-[#6B46C1] text-[#6B46C1] text-base font-medium leading-[120%] placeholder:font-medium placeholder:leading-[120%] "
                      />
                    </FormControl>
                    <span
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 cursor-pointer"
                      onClick={() => setShowNew((prev) => !prev)}
                    >
                      {showNew ? (
                        <EyeOff size={20} className="text-[#6B46C1]" />
                      ) : (
                        <Eye size={20} className="text-[#6B46C1]" />
                      )}
                    </span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm Password */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium text-black leading-[120%]">
                    Confirm New Password
                  </FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        {...field}
                        type={showConfirm ? "text" : "password"}
                        placeholder="••••••••••••••••••"
                        className="h-[51px] border border-[#6B46C1] rounded-[8px] p-4 bg-transparent placeholder:text-[#6B46C1] text-[#6B46C1] text-base font-medium leading-[120%] placeholder:font-medium placeholder:leading-[120%] "
                      />
                    </FormControl>
                    <span
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 cursor-pointer"
                      onClick={() => setShowConfirm((prev) => !prev)}
                    >
                      {showConfirm ? (
                        <EyeOff size={20} className="text-[#6B46C1]" />
                      ) : (
                        <Eye size={20} className="text-[#6B46C1]" />
                      )}
                    </span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-5">
            <Button
              disabled={isPending}
              type="submit"
              size="lg"
              className="h-[51px] bg-[#6B46C1] py-4 px-8 rounded-[8px] text-base font-medium text-white leading-[120%]"
            >
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

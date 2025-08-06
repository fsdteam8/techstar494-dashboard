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
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

const ForgotPasswordForm = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["forgot-password"],
    mutationFn: (email: string) =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/forget-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }).then((res) => res.json()),

    onSuccess: (data, email) => {
      if (!data?.status) {
        toast.error(data?.message || "Something went wrong");
        return;
      }

      toast.success(data?.message || "Email sent successfully!");
      router.push(`/otp?email=${encodeURIComponent(email)}`);
    },

    onError: (error) => {
      toast.error("Something went wrong. Please try again.");
      console.error("Forgot password error:", error);
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // console.log(values);
    mutate(values.email);
  }
  return (
    <div>
      <div className="w-full md:w-[570px]">
        <h3 className="text-2xl md:text-[32px] lg:text-[40px] font-bold text-black text-left leading-[120%] ">
          Forgot Password
        </h3>
        <p className="text-base md:text-lg lg:text-xl font-medium text-[#B0B0B0] leading-[120%] pt-[5px]">
          Enter your registered email address. we’ll send you a code to reset
          your password.
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="pt-5 md:pt- lg:pt-8"
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
                      placeholder="Enter your email ...."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <div className="pt-5 md:pt-7 lg:pt-8"> 
              <Button
                disabled={isPending}
                className="text-base font-medium text-white cursor-pointer leading-[120%] rounded-[8px] py-4 w-full h-[51px] bg-primary"
                type="submit"
              >
                {isPending ? "Sending..." : "Send OTP"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import QuillEditor from "@/components/ui/quill-editor";
// import { useSession } from "next-auth/react";

const FormSchema = z.object({
  // email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  html: z.string().min(1, "Heading is required"),
});

const SendMailForm = () => {
  //   const session = useSession();
  //   const token = (session?.data?.user as { token: string })?.token || "";
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODNlZDVlYTY0ODUxNzk2MWZlYmQ2OGQiLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NTAxNDQ0ODEsImV4cCI6MTc1MDc0OTI4MX0.53v3kiN47F5nLKQgdJjMmIz_gfSfULxf6NIR94RZft8";
  console.log(token);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      subject: "",
      html: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["newsletter-subscribe"],
    mutationFn: (data: z.infer<typeof FormSchema>) =>
      fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/newsletter/broadcast`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      ).then((res) => res.json()),
    onSuccess: (data) => {
      if (!data?.status) {
        toast.error(data?.message || "Something went wrong");
        return;
      }
      toast.success(data?.message || "Subscribed successfully");
      form.reset();
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
    mutate(data);
  }

  return (
    <div className="">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full bg-white rounded-[8px] shadow-md p-6 flex flex-col gap-6"
        >
            <h3 className="text-2xl font-bold text-[#111827] leading-normal ">Compose Your Email</h3>
          <div className=" ">
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-medium font-poppins text-black leading-[120%] tracking-[0%] ">
                    Subject
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="w-full h-[40px] border border-black rounded-[8px] font-manrope bg-white text-base text-black font-medium leading-normal placeholder:text-[#929292]"
                      placeholder="Enter Your Subject..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* heading */}
          <div className="">
            <FormField
              control={form.control}
              name="html"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-medium font-poppins text-black leading-[120%] tracking-[0%] ">
                    Body
                  </FormLabel>
                  <FormControl className="">
                    <QuillEditor
                      id="html"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="">
            <button
              disabled={isPending}
              className="w-[154px] h-[54px] py-4 px-8 bg-primary text-white rounded-[8px] text-base font-bold leading-normal "
              type="submit"
            >
              {isPending ? "Sending..." : "Send Email"}
            </button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default SendMailForm;


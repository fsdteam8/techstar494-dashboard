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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  question: z.string().min(2, {
    message: "Question must be at least 2 characters.",
  }),
  answer: z.string().min(2, {
    message: "Answer must be at least 2 characters.",
  }),
});

const AddFaqForm = () => {
  const session = useSession();
  const token = (session?.data?.user as { accessToken: string })?.accessToken;
  const router = useRouter();
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: "",
      answer: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["add-faq"],
    mutationFn: (values: z.infer<typeof formSchema>) =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/faq/create`, {
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
      toast.success(data?.message || "FAQ added successfully!");
      form.reset();
      router.push("/documents/faq");
      queryClient.invalidateQueries({ queryKey: ["all-faq"] });
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    mutate(values);
  }
  return (
    <div>
      <div className="mt-8">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-[30px] border border-[#B0B0B0] rounded-[16px] p-6"
          >
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium text-black leading-[120%]">
                    Input Question
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="border border-primary h-[51px] rounded-[8px] placeholder:text-[#737373] p-4 text-black text-lg font-semibold leading-[120%]"
                      placeholder="Input Question"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="answer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium text-black leading-[120%]">
                    Input Answer
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="border border-primary h-[51px] rounded-[8px] placeholder:text-[#737373] p-4 text-black text-lg font-semibold leading-[120%]"
                      placeholder="Input Answer"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <div className="w-full flex items-center justify-end -mt-[10px]">
              <Button
                disabled={isPending}
                className="text-base text-white font-medium leading-[120%] bg-primary h-[51px] rounded-[8px] py-4 px-8"
                type="submit"
              >
                {isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AddFaqForm;

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
import QuillEditor from "@/components/ui/quill-editor";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { LegalityResponse } from "../../_components/legality-container";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

const FormSchema = z.object({
  content: z.string().min(1, "Heading is required"),
});

const AddLegalityForm = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
    const session = useSession();
  const token = (session?.data?.user as { accessToken: string })?.accessToken;
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      content: "",
    },
  });

    const { data } = useQuery<LegalityResponse>({
    queryKey: ["legality"],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/legal-documents/legality`).then(
        (res) => res.json()
      ),
  });

  useEffect(() => {
    if (data && data?.data) {
      form.setValue("content", data?.data?.content);
    }
  }, [data, form]);

  const { mutate, isPending } = useMutation({
    mutationKey: ["add-legality"],
    mutationFn: (values: z.infer<typeof FormSchema>) =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/legal-documents/update/6898e3ee5c4ef76084064cf7`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      }).then((res) => res.json()),
    onSuccess: (data) => {
      if (!data?.success) {
        toast.error(data?.message ?? "Something went wrong");
        return;
      }

      toast.success(data?.message ?? "Legality added successfully");
      form.reset();
      router.push("/documents/legality");
      queryClient.invalidateQueries({ queryKey: ["legality"] });
    },
  });

  function onSubmit(values: z.infer<typeof FormSchema>) {
    // console.log(values);
     const payload = {
      content: values.content,
      documentType: "legality",
    };
    mutate(payload);
  }
  return (
    <div className="pt-[64px]">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full bg-white rounded-[8px] shadow-md p-4"
        >
          <div className="">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-medium font-poppins text-black leading-[120%] tracking-[0%] ">
                    Body
                  </FormLabel>
                  <FormControl className="h-[347px]">
                    <QuillEditor
                      id="content"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-full flex items-center justify-end mt-[25px]">
            <button
              disabled={isPending}
              className="w-[178px] h-[51px] px-8 bg-primary text-white rounded-[8px] text-base font-bold leading-normal "
              type="submit"
            >
              {isPending ? "Sending..." : "Save Changes"}
            </button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddLegalityForm;

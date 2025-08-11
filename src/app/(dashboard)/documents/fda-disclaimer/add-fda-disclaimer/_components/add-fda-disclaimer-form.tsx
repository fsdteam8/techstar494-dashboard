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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const FormSchema = z.object({
  description: z.string().min(1, "Heading is required"),
});

const AddFdaDisclaimerForm = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      description: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["add-privacy-policy"],
    mutationFn: (values: z.infer<typeof FormSchema>) =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/fadDisclaimer/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      }).then((res) => res.json()),
    onSuccess: (data) => {
      if (!data?.success) {
        toast.error(data?.message ?? "Something went wrong");
        return;
      }

      toast.success(data?.message ?? "Privacy Policy added successfully");
      form.reset();
      router.push("/documents/privacy-policy");
      queryClient.invalidateQueries({ queryKey: ["privacy-policy"] });
    },
  });

  function onSubmit(values: z.infer<typeof FormSchema>) {
    console.log(values);
    mutate(values);
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-medium font-poppins text-black leading-[120%] tracking-[0%] ">
                    Body
                  </FormLabel>
                  <FormControl className="h-[347px]">
                    <QuillEditor
                      id="description"
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
              className={`w-[178px] h-[51px] px-8 rounded-[8px] text-base font-bold leading-normal 
          ${
            isPending
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-primary text-white"
          }`}
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

export default AddFdaDisclaimerForm;

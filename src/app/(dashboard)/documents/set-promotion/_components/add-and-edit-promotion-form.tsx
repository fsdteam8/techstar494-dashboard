
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
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useEffect } from "react";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Promotion Title must be at least 2 characters.",
  }),
});

export interface Promotion {
  _id: string;
  title: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface SinglePromotionResponse {
  success: boolean;
  message: string;
  data: Promotion;
}

const AddAndEditPromotionForm = ({
  open,
  onOpenChange,
  promotionId,
}: {
  open: boolean;
  onOpenChange: () => void;
  promotionId?: string | null;
}) => {
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  // ✅ Fetch promotion data only if editing
  const { data } = useQuery<SinglePromotionResponse>({
    queryKey: ["single-promotion", promotionId],
    queryFn: () =>
      fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/promotions/${promotionId}`
      ).then((res) => res.json()),
    enabled: !!promotionId, // only fetch if promotionId exists
  });

  // ✅ Reset form when editing
  useEffect(() => {
    if (data?.data) {
      form.reset({
        title: data.data.title || "",
      });
    }
  }, [data, form]);

  // ✅ Add Promotion API
  const { mutate: addMutate, isPending: isAdding } = useMutation({
    mutationKey: ["add-promotion"],
    mutationFn: (values: { title: string }) =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/promotions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      }).then((res) => res.json()),
    onSuccess: (data) => {
      if (!data?.success) {
        toast.error(data?.message || "Something went wrong!");
        return;
      }
      toast.success(data?.message || "Promotion added successfully!");
      form.reset();
      onOpenChange();
      queryClient.invalidateQueries({ queryKey: ["promotion"] });
    },
  });

  // ✅ Update Promotion API
  const { mutate: updateMutate, isPending: isUpdating } = useMutation({
    mutationKey: ["edit-promotion", promotionId],
    mutationFn: (values: { title: string }) =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/promotions/${promotionId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      }).then((res) => res.json()),
    onSuccess: (data) => {
      if (!data?.success) {
        toast.error(data?.message || "Something went wrong!");
        return;
      }
      toast.success(data?.message || "Promotion updated successfully!");
      form.reset();
      onOpenChange();
      queryClient.invalidateQueries({ queryKey: ["promotion"] });
    },
  });

  // ✅ Handle submit
  function onSubmit(values: z.infer<typeof formSchema>) {
    if (promotionId) {
      updateMutate(values); // Edit
    } else {
      addMutate(values); // Add
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white !rounded-[10px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xl font-semibold text-primary leading-[120%]">
                    Promotion Title
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="h-[50px] w-full rounded-[10px] py-2 px-4 border border-primary text-lg font-semibold leading-[120%] text-black placeholder:text-[#A0AEC0]"
                      placeholder="Enter Promotion Title"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <div className="w-full flex items-center justify-end pt-4">
              <Button
                disabled={isAdding || isUpdating}
                className={`h-[42px] text-white text-lg font-semibold leading-[120%] py-2 px-6 rounded-[10px] ${
                  isAdding || isUpdating
                    ? "cursor-not-allowed opacity-50"
                    : "bg-primary"
                }`}
                type="submit"
              >
                {isAdding || isUpdating
                  ? "Submitting..."
                  : promotionId
                  ? "Update"
                  : "Submit"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAndEditPromotionForm;


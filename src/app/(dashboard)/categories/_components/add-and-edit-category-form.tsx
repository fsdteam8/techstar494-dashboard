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
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { ImagePlus, X } from "lucide-react";
import Image from "next/image";

const formSchema = z.object({
  categoryName: z.string().min(2, {
    message: "Category Name must be at least 2 characters.",
  }),
  categoryIcon: z.any().optional(),
  image: z.any().optional(),
});

export interface Category {
  _id: string;
  categoryName: string;
  image: string;
  categoryIcon: string;
  createdAt: string;
  updatedAt: string;
  id: string;
}

export interface CategoryResponse {
  success: boolean;
  message: string;
  data: Category;
}

const AddAndEditCategoryForm = ({
  open,
  onOpenChange,
  catId,
}: {
  open: boolean;
  onOpenChange: () => void;
  catId?: string | null;
}) => {
  const queryClient = useQueryClient();
  const session = useSession();
  const token = (session?.data?.user as { accessToken: string })?.accessToken;
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewIcon, setPreviewIcon] = useState<string | null>(null);
  const [isDragOverImage, setIsDragOverImage] = useState(false);
  const [isDragOverIcon, setIsDragOverIcon] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryName: "",
      categoryIcon: undefined,
      image: undefined,
    },
  });

  // ✅ FIXED: Correctly map icon → categoryIcon
  const handleImageChange = (file: File, type: "image" | "icon") => {
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (type === "image") {
          setPreviewImage(reader.result as string);
          form.setValue("image", file);
        } else {
          setPreviewIcon(reader.result as string);
          form.setValue("categoryIcon", file); // ✅ Correct
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent, type: "image" | "icon") => {
    e.preventDefault();
    if (type === "image") {
      setIsDragOverImage(false);
    } else {
      setIsDragOverIcon(false);
    }

    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith("image/")) {
      handleImageChange(files[0], type);
    }
  };

  const handleDragOver = (e: React.DragEvent, type: "image" | "icon") => {
    e.preventDefault();
    if (type === "image") {
      setIsDragOverImage(true);
    } else {
      setIsDragOverIcon(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent, type: "image" | "icon") => {
    e.preventDefault();
    if (type === "image") {
      setIsDragOverImage(false);
    } else {
      setIsDragOverIcon(false);
    }
  };

  // ✅ Fetch category data only if editing
  const { data } = useQuery<CategoryResponse>({
    queryKey: ["single-category", catId],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/category/${catId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => res.json()),
    enabled: !!catId && open,
  });

  // ✅ Reset form when editing
  useEffect(() => {
    if (data?.data) {
      form.reset({
        categoryName: data.data.categoryName || "",
        categoryIcon: undefined,
        image: undefined,
      });
      setPreviewImage(data.data.image || null);
      setPreviewIcon(data.data.categoryIcon || null);
    } else {
      form.reset({
        categoryName: "",
        categoryIcon: undefined,
        image: undefined,
      });
      setPreviewImage(null);
      setPreviewIcon(null);
    }
  }, [data, form, open]);

  // ✅ Create FormData for file uploads
  const createFormData = (values: z.infer<typeof formSchema>) => {
    const formData = new FormData();
    formData.append("categoryName", values.categoryName);

    if (values.image instanceof File) {
      formData.append("image", values.image);
    }

    if (values.categoryIcon instanceof File) {
      formData.append("categoryIcon", values.categoryIcon); // ✅ Fixed
    }

    return formData;
  };

  // ✅ Add Category API
  const { mutate: addMutate, isPending: isAdding } = useMutation({
    mutationKey: ["add-category"],
    mutationFn: (values: z.infer<typeof formSchema>) => {
      const formData = createFormData(values);
      return fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/category`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }).then((res) => res.json());
    },
    onSuccess: (data) => {
      if (!data?.success) {
        toast.error(data?.message || "Something went wrong!");
        return;
      }
      toast.success(data?.message || "Category added successfully!");
      form.reset();
      setPreviewImage(null);
      setPreviewIcon(null);
      onOpenChange();
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error) => {
      toast.error("Failed to add category");
      console.error("Add category error:", error);
    },
  });

  // ✅ Update Category API
  const { mutate: updateMutate, isPending: isUpdating } = useMutation({
    mutationKey: ["edit-category", catId],
    mutationFn: (values: z.infer<typeof formSchema>) => {
      const formData = createFormData(values);
      return fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/category/${catId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }).then((res) => res.json());
    },
    onSuccess: (data) => {
      if (!data?.success) {
        toast.error(data?.message || "Something went wrong!");
        return;
      }
      toast.success(data?.message || "Category updated successfully!");
      form.reset();
      setPreviewImage(null);
      setPreviewIcon(null);
      onOpenChange();
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["single-category", catId] });
    },
    onError: (error) => {
      toast.error("Failed to update category");
      console.error("Update category error:", error);
    },
  });

  // ✅ Handle submit
  function onSubmit(values: z.infer<typeof formSchema>) {
    if (catId) {
      updateMutate(values);
    } else {
      addMutate(values);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white !rounded-[10px] max-w-md mx-auto p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Category Name */}
            <FormField
              control={form.control}
              name="categoryName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xl font-semibold text-primary leading-[120%]">
                    Category Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="h-[50px] w-full rounded-[10px] py-2 px-4 border border-primary text-lg font-semibold leading-[120%] text-black placeholder:text-[#A0AEC0]"
                      placeholder="Enter Category Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            {/* Category Image */}
            <FormField
              control={form.control}
              name="image"
              render={() => (
                <FormItem>
                  <FormLabel className="text-xl font-semibold text-primary leading-[120%]">
                    Category Image
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      {!previewImage ? (
                        <div
                          className={`h-[150px] border border-dashed border-[#707070] rounded-[10px] p-4 text-center cursor-pointer transition-colors
                          ${
                            isDragOverImage
                              ? "border-blue-400 bg-blue-50"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                          onDrop={(e) => handleDrop(e, "image")}
                          onDragOver={(e) => handleDragOver(e, "image")}
                          onDragLeave={(e) => handleDragLeave(e, "image")}
                          onClick={() =>
                            document.getElementById("image-upload")?.click()
                          }
                        >
                          <div className="h-full flex flex-col items-center justify-center space-y-2">
                            <ImagePlus className="w-6 h-6 text-gray-400" />
                            <h4 className="text-sm font-normal text-[#707070]">
                              Drag and drop image here, or click to browse
                            </h4>
                          </div>
                          <input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageChange(file, "image");
                            }}
                          />
                        </div>
                      ) : (
                        <div className="relative">
                          <Image
                            width={200}
                            height={150}
                            src={previewImage}
                            alt="Preview"
                            className="w-full h-[150px] object-cover rounded-lg border-2 border-dashed border-gray-300"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setPreviewImage(null);
                              form.setValue("image", undefined);
                            }}
                            className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-50"
                          >
                            <X className="h-4 w-4 text-gray-600" />
                          </button>
                        </div>
                      )}
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Category Icon */}
            <FormField
              control={form.control}
              name="categoryIcon"
              render={() => (
                <FormItem>
                  <FormLabel className="text-xl font-semibold text-primary leading-[120%]">
                    Category Icon
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      {!previewIcon ? (
                        <div
                          className={`h-[150px] border border-dashed border-[#707070] rounded-[10px] p-4 text-center cursor-pointer transition-colors
                          ${
                            isDragOverIcon
                              ? "border-blue-400 bg-blue-50"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                          onDrop={(e) => handleDrop(e, "icon")}
                          onDragOver={(e) => handleDragOver(e, "icon")}
                          onDragLeave={(e) => handleDragLeave(e, "icon")}
                          onClick={() =>
                            document.getElementById("icon-upload")?.click()
                          }
                        >
                          <div className="h-full flex flex-col items-center justify-center space-y-2">
                            <ImagePlus className="w-6 h-6 text-gray-400" />
                            <h4 className="text-sm font-normal text-[#707070]">
                              Drag and drop icon here, or click to browse
                            </h4>
                          </div>
                          <input
                            id="icon-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageChange(file, "icon");
                            }}
                          />
                        </div>
                      ) : (
                        <div className="relative">
                          <Image
                            width={200}
                            height={150}
                            src={previewIcon}
                            alt="Preview"
                            className="w-full h-[150px] object-cover rounded-lg border-2 border-dashed border-gray-300"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setPreviewIcon(null);
                              form.setValue("categoryIcon", undefined);
                            }}
                            className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-50"
                          >
                            <X className="h-4 w-4 text-gray-600" />
                          </button>
                        </div>
                      )}
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Submit */}
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
                  : catId
                  ? "Update Category"
                  : "Add Category"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAndEditCategoryForm;

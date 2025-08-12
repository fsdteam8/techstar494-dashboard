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
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { ImagePlus, Upload, X } from "lucide-react";
import Image from "next/image";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { toast } from "react-toastify";
// import { useRouter } from "next/navigation";

const FormSchema = z.object({
  description: z.string().min(1, "Description is required"),
  title: z.string().min(1, "Title is required"),
  image: z.any().optional(),
});

const EditBlogForm = ({ blogId }: { blogId: string }) => {
  //   const router = useRouter();
  //   const queryClient = useQueryClient();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  console.log(blogId)
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      description: "",
      image: undefined,
    },
  });

  const handleImageChange = (file: File) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      form.setValue("image", [file]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith("image/")) {
      handleImageChange(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  //   const { mutate, isPending } = useMutation({
  //     mutationKey: ["add-privacy-policy"],
  //     mutationFn: (values: z.infer<typeof FormSchema>) =>
  //       fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/fadDisclaimer/create`, {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(values),
  //       }).then((res) => res.json()),
  //     onSuccess: (data) => {
  //       if (!data?.success) {
  //         toast.error(data?.message ?? "Something went wrong");
  //         return;
  //       }

  //       toast.success(data?.message ?? "Privacy Policy added successfully");
  //       form.reset();
  //       router.push("/documents/privacy-policy");
  //       queryClient.invalidateQueries({ queryKey: ["privacy-policy"] });
  //     },
  //   });

  function onSubmit(values: z.infer<typeof FormSchema>) {
    console.log(values);
    // mutate(values);
  }
  return (
    <div className="pt-[64px]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="">
          <div className="space-y-[64px]">
            <div className="border border-[#6459491A]/10 rounded-[8px] p-[15px]">
              <FormField
                control={form.control}
                name="image"
                render={() => (
                  <FormItem>
                    <h3 className="text-xl font-semibold text-[#1A1C21] leading-[120%] pb-3">
                      Thumbnail Image
                    </h3>
                    <FormLabel className="text-base text-[#272727] font-medium leading-[120%] tracking-[0%] mb-2 block">
                      Photo
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        {!previewImage ? (
                          <div
                            className={`
                                  h-[310px] border border-dashed border-[#707070] rounded-[10px] p-8 text-center cursor-pointer transition-colors
                                  ${
                                    isDragOver
                                      ? "border-blue-400 bg-blue-50"
                                      : "border-gray-300 hover:border-gray-400"
                                  }
                                `}
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onClick={() =>
                              document.getElementById("image-upload")?.click()
                            }
                          >
                            <div className="h-full flex flex-col items-center justify-center space-y-3">
                              <div className="flex flex-col items-center gap-4">
                                <ImagePlus className="w-[38px] h-[38px] text-gray-400 " />
                                <h4 className="text-base font-normal text-[#707070] leading-[120%]">
                                  Drag and drop image here, or click add image
                                </h4>
                                <button
                                  type="button"
                                  className="text-base font-medium text-white bg-primary py-[10px] px-[20px] rounded-[8px]"
                                >
                                  Add Image
                                </button>
                              </div>
                            </div>
                            <input
                              id="image-upload"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleImageChange(file);
                                }
                              }}
                            />
                          </div>
                        ) : (
                          <div className="relative">
                            <Image
                              width={292}
                              height={277}
                              src={previewImage || "/placeholder.svg"}
                              alt="Preview"
                              className="w-full h-[310px] object-cover rounded-lg border-2 border-dashed border-gray-300"
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
                            <button
                              type="button"
                              onClick={() =>
                                document.getElementById("image-upload")?.click()
                              }
                              className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-gray-50"
                            >
                              <Upload className="h-4 w-4 text-gray-600" />
                            </button>
                            <input
                              id="image-upload"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleImageChange(file);
                                }
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium text-black leading-[120%]">
                    Blog Title
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="border border-[#6B46C1] rounded-[8px] h-[51px] w-full p-4 placeholder:text-[#737373] text-lg font-medium text-black"
                      placeholder="Title ..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium text-black leading-[120%]">
                    Blog Details
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
              //   disabled={isPending}
              className="w-[178px] h-[51px] px-8 bg-primary text-white rounded-[8px] text-base font-bold leading-normal "
              type="submit"
            >
              {/* {isPending ? "Sending..." : "Save Changes"} */}
              Save Changes
            </button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditBlogForm;

"use client";
import ErrorContainer from "@/components/shared/shared/ErrorContainer/ErrorContainer";
import NotFound from "@/components/shared/shared/NotFound/NotFound";
import ReusableLoader from "@/components/shared/shared/reusableLoader/ReusableLoader";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SquarePen, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useState } from "react";
import AddAndEditCategoryForm from "./add-and-edit-category-form";
import DeleteModal from "@/components/modal/DeleteModal";
import { toast } from "react-toastify";
export interface Category {
  _id: string;
  categoryName: string;
  image: string;
  categoryIcon: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  id: string;
}

export interface CategoriesResponse {
  success: boolean;
  message: string;
  data: Category[];
}

const CategoriesContainer = () => {
  const [open, setIsOpen] = useState(false);
  const [selectCatId, setSelectCatId] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const session = useSession();
  const queryClient = useQueryClient();
  const token = (session?.data?.user as { accessToken: string })?.accessToken;
  const { data, isLoading, error, isError } = useQuery<CategoriesResponse>({
    queryKey: ["categories"],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/category`).then((res) => res.json()),
  });
  console.log(data?.data);
  const categoryData = data?.data || [];

  // delete api logic
  const { mutate: deleteCategory } = useMutation({
    mutationKey: ["delete-category"],
    mutationFn: (id: string) =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/category/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => res.json()),
    onSuccess: (data) => {
      if (!data?.success) {
        toast.error(data?.message || "Failed to delete category");
        return;
      } else {
        toast.success(data?.message || "category deleted successfully");
      }
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  // delete modal logic
  const handleDelete = () => {
    if (selectCatId) {
      deleteCategory(selectCatId);
    }
    setDeleteModalOpen(false);
  };
  if (isLoading) {
    return (
      <ReusableLoader
        rows={6}
        headings={["Category Name", "Category Icon", "Date", "Action"]}
      />
    );
  }

  if (isError) {
    return (
      <div className="my-10 rounded-lg">
        <ErrorContainer message={error?.message || "Something went wrong"} />
      </div>
    );
  }

  if (data?.data?.length === 0) {
    return (
      <div className="my-10 rounded-lg">
        <NotFound message="Oops! No data available. Modify your filters or check your internet connection." />
      </div>
    );
  }
  return (
    <div className="mt-10">
      <table className="w-full">
        <thead className="bg-[#F9FAFB] rounded-t-[8px]">
          <tr className="w-full grid grid-cols-4 py-3 px-4">
            <th className="text-base text-[#6B7280] font-bold text-left">
              Category Name
            </th>
            <th className="text-base text-[#6B7280] font-bold text-center">
              Category Icon
            </th>
            <th className="text-base text-[#6B7280] font-bold text-center">
              Date
            </th>
            <th className="text-base text-[#6B7280] font-bold text-center">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {categoryData?.map((cat) => (
            <tr
              key={cat._id}
              className="w-full bg-white grid grid-cols-4 p-4 mb-[2px]"
            >
              {/* Category Name */}
              <td className="flex items-center gap-2">
                <Image
                  src={cat.image || "/assets/images/no-pic.jpg"}
                  alt={cat.categoryName}
                  width={60}
                  height={60}
                  className="w-[60px] h-[60px] rounded-[8px]"
                />
                <div>
                  <p className="text-sm text-[#6B7280]">{cat.categoryName}</p>
                </div>
              </td>

              {/* Category Icon */}
              <td className="flex items-center justify-center text-sm text-[#6B7280]">
                <Image
                  src={cat?.categoryIcon || "/assets/images/no-pic.jpg"}
                  alt={cat?.categoryName}
                  width={60}
                  height={60}
                  className="w-[60px] h-[60px] rounded-[8px]"
                />
              </td>

              {/* Date */}
              <td className="flex items-center justify-center text-sm text-[#6B7280]">
                {new Date(cat.createdAt).toLocaleDateString()}
              </td>
              {/* Action */}
              <td className="flex justify-center items-center gap-2">
                <button
                  onClick={() => {
                    setIsOpen(true);
                    setSelectCatId(cat._id);
                  }}
                  className=" bg-[#6B46C1] p-2 rounded-[4px]"
                >
                  <SquarePen className="w-4 h-4 text-white" />
                </button>
                <button
                  onClick={() => {
                    setDeleteModalOpen(true);
                    setSelectCatId(cat._id);
                  }}
                  className=" bg-[#6B46C1] p-2 rounded-[4px]"
                >
                  {" "}
                  <Trash2 className="w-4 h-4 text-white" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {open && (
        <AddAndEditCategoryForm
          open={open}
          onOpenChange={() => setIsOpen(false)}
          catId={selectCatId}
        />
      )}
      {/* delete modal  */}
      {deleteModalOpen && (
        <DeleteModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
};

export default CategoriesContainer;

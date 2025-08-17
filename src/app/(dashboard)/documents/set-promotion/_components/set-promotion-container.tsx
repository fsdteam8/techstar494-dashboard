"use client";
import ErrorContainer from "@/components/shared/shared/ErrorContainer/ErrorContainer";
import NotFound from "@/components/shared/shared/NotFound/NotFound";
import TableSkeletonWrapper from "@/components/shared/shared/TableSkeletonWrapper/TableSkeletonWrapper";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SquarePen, Trash2 } from "lucide-react";
import React, { useState } from "react";
import AddAndEditPromotionForm from "./add-and-edit-promotion-form";
import DeleteModal from "@/components/modal/DeleteModal";
import { toast } from "react-toastify";

export interface Promotion {
  _id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PromotionsResponse {
  success: boolean;
  message: string;
  count: number;
  data: Promotion[];
}

const SetPromotionContainer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedpromotionId, setSelectedPromotionId] = useState<string | null>(
    null
  );
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const queryClient = useQueryClient();

  // get api logic
  const { data, isLoading, error, isError } = useQuery<PromotionsResponse>({
    queryKey: ["promotion"],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/promotions`).then((res) =>
        res.json()
      ),
  });

  // console.log(data?.data);
  // delete api logic
  const { mutate: deletePromotion } = useMutation({
    mutationKey: ["delete-promotion"],
    mutationFn: (id: string) =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/promotions/${id}`, {
        method: "DELETE",
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // },
      }).then((res) => res.json()),
    onSuccess: (data) => {
      if (!data?.success) {
        toast.error(data?.message || "Failed to delete promotion");
        return;
      } else {
        toast.success(data?.message || "Promotion deleted successfully");
      }
      queryClient.invalidateQueries({ queryKey: ["promotion"] });
    },
  });

  // delete modal logic
  const handleDelete = () => {
    if (selectedpromotionId) {
      deletePromotion(selectedpromotionId);
    }
    setDeleteModalOpen(false);
  };
  if (isLoading) {
    return (
      <div className="my-10 rounded-[12px]">
        <TableSkeletonWrapper count={4} />
      </div>
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
    <div className="pt-[64px]">
      <div>
        <h4 className="text-base font-medium text-black leading-[120%] pb-2">
          Promotion Lists
        </h4>
      </div>
      <div>
        {data?.data?.map((item) => {
          return (
            <div key={item._id} className="pb-2">
              <h4 className="flex items-center justify-between text-base font-normal leading-[120%] text-[#595959] p-4 rounded-[8px] border border-[#6B46C1]">
                {item.title}{" "}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setIsOpen(true);
                      setSelectedPromotionId(item._id);
                    }}
                    className=" bg-[#6B46C1] p-3 rounded-[4px]"
                  >
                    {" "}
                    <SquarePen className="w-4 h-4 text-white" />
                  </button>
                  <button
                    onClick={() => {
                      setDeleteModalOpen(true);
                      setSelectedPromotionId(item?._id);
                    }}
                    className=" bg-[#6B46C1] p-3 rounded-[2px]"
                  >
                    {" "}
                    <Trash2 className="w-4 h-4 text-white" />
                  </button>
                </div>
              </h4>
            </div>
          );
        })}
      </div>

      {/* edit modal */}
      {isOpen && selectedpromotionId && (
        <AddAndEditPromotionForm
          open={isOpen}
          onOpenChange={() => setIsOpen(false)}
          promotionId={selectedpromotionId}
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

export default SetPromotionContainer;

"use client";
import DeleteModal from "@/components/modal/DeleteModal";
import ErrorContainer from "@/components/shared/shared/ErrorContainer/ErrorContainer";
import NotFound from "@/components/shared/shared/NotFound/NotFound";
import TableSkeletonWrapper from "@/components/shared/shared/TableSkeletonWrapper/TableSkeletonWrapper";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SquarePen, Trash2 } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "react-toastify";

export type FAQDataType = {
  _id: string;
  question: string;
  answer: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
};

export type FAQDataResponse = {
  success: boolean;
  message: string;
  count: number;
  data: FAQDataType[];
};

const FaqContainer = () => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery<FAQDataResponse>({
    queryKey: ["all-faq"],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/faq`).then((res) =>
        res.json()
      ),
  });

  // delete api logic
  const { mutate: deleteFaq } = useMutation({
    mutationKey: ["delete-faq"],
    mutationFn: (id: string) =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/faq/${id}`, {
        method: "DELETE",
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // },
      }).then((res) => res.json()),
    onSuccess: (data) => {
      if (!data?.success) {
        toast.error(data?.message || "Failed to delete faq");
        return;
      } else {
        toast.success(data?.message || "faq deleted successfully");
      }
      queryClient.invalidateQueries({ queryKey: ["all-faq"] });
    },
  });

  // delete modal logic
  const handleDelete = () => {
    if (selectedBlogId) {
      deleteFaq(selectedBlogId);
    }
    setDeleteModalOpen(false);
  };
  if (isLoading) {
    return (
      <div className="my-10 rounded-lg">
        <TableSkeletonWrapper count={6} />
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
  console.log(data?.data);
  return (
    <div>
      <div className="mt-4">
        {data?.data?.map((faq) => {
          return (
            <div key={faq._id} className="p-5 rounded-[8px] bg-[#411D96] mb-4">
              <div className="w-full flex items-center justify-between">
                <h2 className="text-2xl font-medium text-[#FCFCFE] leading-[120%]">
                  {faq.question}
                </h2>
                <div className="flex items-center gap-2">
                  <Link href={`/documents/faq/edit-faq/${faq._id}`}>
                    <button className=" bg-[#6B46C1] p-3 rounded-[2px]">
                      {" "}
                      <SquarePen className="w-4 h-4 text-white" />
                    </button>
                  </Link>
                  <button
                    onClick={() => {
                      setDeleteModalOpen(true);
                      setSelectedBlogId(faq?._id);
                    }}
                    className=" bg-[#6B46C1] p-3 rounded-[2px]"
                  >
                    {" "}
                    <Trash2 className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
              <p className="text-base font-normal text-[#FCFCFE] leading-[150%] pt-3">
                {faq.answer}
              </p>
            </div>
          );
        })}
      </div>
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

export default FaqContainer;

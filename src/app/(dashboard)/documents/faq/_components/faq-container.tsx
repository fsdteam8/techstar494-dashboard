"use client";
import ErrorContainer from "@/components/shared/shared/ErrorContainer/ErrorContainer";
import NotFound from "@/components/shared/shared/NotFound/NotFound";
import TableSkeletonWrapper from "@/components/shared/shared/TableSkeletonWrapper/TableSkeletonWrapper";
import { useQuery } from "@tanstack/react-query";
import { SquarePen, Trash2 } from "lucide-react";
import React from "react";

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
  const { data, isLoading, isError, error } = useQuery<FAQDataResponse>({
    queryKey: ["all-faq"],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/faq`).then((res) =>
        res.json()
      ),
  });
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
                  <button className=" bg-[#6B46C1] p-3 rounded-[2px]">
                    {" "}
                    <SquarePen className="w-4 h-4 text-white" />
                  </button>
                  <button className=" bg-[#6B46C1] p-3 rounded-[2px]">
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
    </div>
  );
};

export default FaqContainer;

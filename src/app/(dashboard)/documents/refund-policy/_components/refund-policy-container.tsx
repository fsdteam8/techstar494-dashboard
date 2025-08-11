"use client";
import ErrorContainer from "@/components/shared/shared/ErrorContainer/ErrorContainer";
import NotFound from "@/components/shared/shared/NotFound/NotFound";
import PrivacyPolicyWrapper from "@/components/shared/shared/PrivacyPolicyWrapper/PrivacyPolicyWrapper";
import { useQuery } from "@tanstack/react-query";
import React from "react";

export type RefundPolicyResponse = {
  success: boolean;
  message: string;
  data: {
    _id: string;
    documentType: "refund_policy";
    content: string;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
  };
};


const RefundPolicyContainer = () => {
  const { data, isLoading, isError, error } = useQuery<RefundPolicyResponse>({
    queryKey: ["refund-policy"],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/legal-documents/refund-policy`).then(
        (res) => res.json()
      ),
  });

   if (isLoading) {
    return (
      <div className="my-10 rounded-lg">
        <PrivacyPolicyWrapper count={1} />
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

  if (data && data?.data === null || data?.data === undefined) {
    return (
      <div className="my-10 rounded-lg">
        <NotFound message="Oops! No data available. Modify your filters or check your internet connection." />
      </div>
    );
  }

  console.log(data);
  return <div className="pt-[64px]">

    <p dangerouslySetInnerHTML={{__html: data?.data?.content ?? ""}}/>
  </div>;
};

export default RefundPolicyContainer;

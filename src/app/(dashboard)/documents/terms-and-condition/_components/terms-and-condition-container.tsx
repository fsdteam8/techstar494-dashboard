"use client";
import ErrorContainer from "@/components/shared/shared/ErrorContainer/ErrorContainer";
import NotFound from "@/components/shared/shared/NotFound/NotFound";
import PrivacyPolicyWrapper from "@/components/shared/shared/PrivacyPolicyWrapper/PrivacyPolicyWrapper";
import { useQuery } from "@tanstack/react-query";
import React from "react";

export type FdaDisclaimerResponse = {
  success: boolean;
  message: string;
  data: {
    _id: string;
    description: string;
    __v: number;
  } | null;
};

const TermsAndConditionContainer = () => {
  const { data, isLoading, isError, error } = useQuery<FdaDisclaimerResponse>({
    queryKey: ["privacy-policy"],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/fadDisclaimer`).then(
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

    <p dangerouslySetInnerHTML={{__html: data?.data?.description ?? ""}}/>
  </div>;
};

export default TermsAndConditionContainer;

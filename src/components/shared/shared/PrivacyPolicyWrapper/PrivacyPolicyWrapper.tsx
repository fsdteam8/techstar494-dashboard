import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

interface PrivacyPolicyWrapperProps {
  width?: string;
  height?: string;
  className?: string;
  count?: number;
}

const PrivacyPolicyWrapper: React.FC<PrivacyPolicyWrapperProps> = ({
  width = "100%",
  height = "600px",
  className = "",
  count = 1,
}) => {
  return (
    <div className="">
      {[...Array(count)].map((_, index) => (
        <Skeleton
          key={index}
          className={`rounded-[16px] ${className}`}
          style={{ width, height }}
        />
      ))}
    </div>
  );
};

export default PrivacyPolicyWrapper;

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";

const AddGrandPurpLabsHeader = () => {
  return (
    <div className="w-full flex items-center justify-start">
      <div>
        <h2 className="text-xl font-bold text-[#1F2937] leading-[120%]">
          Grand Purp Labs
        </h2>
        <div className="flex items-center gap-2">
          <p className="text-sm text-[#4B5563] leading-[120%] font-normal pt-2">
            Documents
          </p>
          <span>
            <ChevronRight className="w-4 h-4 text-[#4B5563] mt-2" />
          </span>
          <Link
            href="/documents/legality"
            className="hover:underline hover:text-primary font-medium"
          >
            <p className="text-sm text-[#4B5563] leading-[120%] font-normal pt-2">
              Grand Purp Labs
            </p>
          </Link>
          <span>
            <ChevronRight className="w-4 h-4 text-[#4B5563] mt-2" />
          </span>
          <p className="text-sm text-[#4B5563] leading-[120%] font-normal pt-2">
            Add Grand Purp Labs
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddGrandPurpLabsHeader;

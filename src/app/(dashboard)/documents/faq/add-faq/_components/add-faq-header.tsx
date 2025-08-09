import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";

const AddFaqHeader = () => {
  return (
    <div className="w-full flex items-center justify-start">
      <div>
        <h2 className="text-xl font-bold text-[#1F2937] leading-[120%]">
          Documents
        </h2>
        <div className="flex items-center gap-2">
          <p className="text-sm text-[#4B5563] leading-[120%] font-normal pt-2">
            Documents
          </p>
          <span>
            <ChevronRight className="w-4 h-4 text-[#4B5563] mt-2" />
          </span>
          <Link href="/documents/faq" className="hover:underline hover:text-primary font-medium">
            <p className="text-sm text-[#4B5563] leading-[120%] font-normal pt-2">
              FAQ
            </p>
          </Link>
          <span>
            <ChevronRight className="w-4 h-4 text-[#4B5563] mt-2" />
          </span>
          <p className="text-sm text-[#4B5563] leading-[120%] font-normal pt-2">
            Add FAQ
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddFaqHeader;

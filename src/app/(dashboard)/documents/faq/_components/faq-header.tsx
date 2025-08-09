import { Button } from "@/components/ui/button";
import { ChevronRight, Plus } from "lucide-react";
import Link from "next/link";
import React from "react";

const FaqHeader = () => {
  return (
    <div className="w-full flex items-center justify-between">
      <div>
        <h2 className="text-xl font-bold text-[#1F2937] leading-[120%]">FAQ</h2>
        <div className="flex items-center gap-2">
          <p className="text-sm text-[#4B5563] leading-[120%] font-normal pt-2">
            Documents
          </p>
          <span>
            <ChevronRight className="w-4 h-4 text-[#4B5563] mt-2" />
          </span>
          <p className="text-sm text-[#4B5563] leading-[120%] font-normal pt-2">
            FAQ
          </p>
        </div>
      </div>
      <div>
        <Link href="/documents/faq/add-faq">
          <Button className="h-[52px] flex items-center gap-2 text-base font-medium text-white leading-[120%] py-4 px-8 rounded-[8px] bg-[#6B46C1]">
            <Plus className="w-5 h-5 text-white" /> Add FAQ
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default FaqHeader;

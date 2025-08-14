import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import React from "react";

const SetPormotionHeader = () => {
  return (
    <div className="w-full flex items-center justify-between">
      <div>
        <h2 className="text-xl font-bold text-[#1F2937] leading-[120%]">
          Set Promotion
        </h2>
        <div className="flex items-center gap-2">
          <p className="text-sm text-[#4B5563] leading-[120%] font-normal pt-2">
            Documents
          </p>
          <span>
            <ChevronRight className="w-4 h-4 text-[#4B5563] mt-2" />
          </span>
          <p className="text-sm text-[#4B5563] leading-[120%] font-normal pt-2">
            Set Promotion
          </p>
        </div>
      </div>
      <div>
        <Button className="h-[51px] text-base font-medium text-white leading-[120%] py-4 px-8 rounded-[8px] bg-[#6B46C1]">
          Add More
        </Button>
      </div>
    </div>
  );
};

export default SetPormotionHeader;

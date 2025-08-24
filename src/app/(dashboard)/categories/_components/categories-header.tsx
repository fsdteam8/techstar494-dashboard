"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import AddAndEditCategoryForm from "./add-and-edit-category-form";

const CategoriesHeader = () => {
  const [open, setIsOpen] = useState(false);
  return (
    <>
      <div className="w-full flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#1F2937] leading-[120%]">
            All Categories
          </h2>
          <div className="flex items-center gap-2">
            <p className="text-sm text-[#4B5563] leading-[120%] font-normal pt-2">
              See your categories list
            </p>
          </div>
        </div>
        <div>
          <Button
            onClick={() => setIsOpen(true)}
            className="h-[52px] text-base font-medium text-white leading-[120%] py-4 px-8 rounded-[8px] bg-[#6B46C1]"
          >
            Add Category
          </Button>
        </div>
      </div>

      {open && (
        <AddAndEditCategoryForm
          open={open}
          onOpenChange={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default CategoriesHeader;

"use client";
import TechstarPagination from "@/components/ui/TechstarPagination";
import { ArrowRight, SquarePen, Trash2 } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

interface BlogType {
  id: number;
  title: string;
  description: string;
  img: string;
}

const allBlogData: BlogType[] = [
  {
    id: 1,
    title:
      "Sativa vs. Indica vs. Hybrid: Which Cannabis Strain is Right for You?",
    description:
      "Indica, Sativa, and Hybrid! These three names are like the magic words for any cannabis lover that open the door to a vibrant world of unique experiences! Right? These are the main types of cannabis strains, each with distinct characteristics and effects.",
    img: "/assets/images/blog.png",
  },
  {
    id: 2,
    title:
      "Sativa vs. Indica vs. Hybrid: Which Cannabis Strain is Right for You?",
    description:
      "Indica, Sativa, and Hybrid! These three names are like the magic words for any cannabis lover that open the door to a vibrant world of unique experiences! Right? These are the main types of cannabis strains, each with distinct characteristics and effects.",
    img: "/assets/images/blog.png",
  },
  {
    id: 3,
    title:
      "Sativa vs. Indica vs. Hybrid: Which Cannabis Strain is Right for You?",
    description:
      "Indica, Sativa, and Hybrid! These three names are like the magic words for any cannabis lover that open the door to a vibrant world of unique experiences! Right? These are the main types of cannabis strains, each with distinct characteristics and effects.",
    img: "/assets/images/blog.png",
  },
  {
    id: 4,
    title:
      "Sativa vs. Indica vs. Hybrid: Which Cannabis Strain is Right for You?",
    description:
      "Indica, Sativa, and Hybrid! These three names are like the magic words for any cannabis lover that open the door to a vibrant world of unique experiences! Right? These are the main types of cannabis strains, each with distinct characteristics and effects.",
    img: "/assets/images/blog.png",
  },
  {
    id: 5,
    title:
      "Sativa vs. Indica vs. Hybrid: Which Cannabis Strain is Right for You?",
    description:
      "Indica, Sativa, and Hybrid! These three names are like the magic words for any cannabis lover that open the door to a vibrant world of unique experiences! Right? These are the main types of cannabis strains, each with distinct characteristics and effects.",
    img: "/assets/images/blog.png",
  },
  {
    id: 6,
    title:
      "Sativa vs. Indica vs. Hybrid: Which Cannabis Strain is Right for You?",
    description:
      "Indica, Sativa, and Hybrid! These three names are like the magic words for any cannabis lover that open the door to a vibrant world of unique experiences! Right? These are the main types of cannabis strains, each with distinct characteristics and effects.",
    img: "/assets/images/blog.png",
  },
  {
    id: 7,
    title:
      "Sativa vs. Indica vs. Hybrid: Which Cannabis Strain is Right for You?",
    description:
      "Indica, Sativa, and Hybrid! These three names are like the magic words for any cannabis lover that open the door to a vibrant world of unique experiences! Right? These are the main types of cannabis strains, each with distinct characteristics and effects.",
    img: "/assets/images/blog.png",
  },
  {
    id: 8,
    title:
      "Sativa vs. Indica vs. Hybrid: Which Cannabis Strain is Right for You?",
    description:
      "Indica, Sativa, and Hybrid! These three names are like the magic words for any cannabis lover that open the door to a vibrant world of unique experiences! Right? These are the main types of cannabis strains, each with distinct characteristics and effects.",
    img: "/assets/images/blog.png",
  },
];

const AllBlogsContainer = () => {
  const [currentPage, setCurrentPage] = useState(1);
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-[64px]">
        {allBlogData?.map((blog) => {
          return (
            <div key={blog.id} className="pb-[64px]">
              <div className="relative">
                <Image
                  src={blog.img}
                  alt={blog.title}
                  width={364}
                  height={330}
                  className="w-full h-[330px] object-cover rounded-[16px]"
                  priority
                />

                {/* Overlay Icon */}
                <div className="absolute top-6 right-6 flex items-center gap-4">
                  <button
                    type="button"
                    className="bg-white rounded-full p-3 shadow-md hover:bg-gray-100 transition"
                    aria-label="Edit blog"
                  >
                    <SquarePen className="text-[#6B46C1] w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    className="bg-white rounded-full p-3 shadow-md hover:bg-gray-100 transition"
                    aria-label="Edit blog"
                  >
                    <Trash2 className="text-[#6B46C1] w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="py-6 px-4">
                <p className="flex items-center gap-5 text-base font-normal text-[#707070] leading-[150%]">
                  <span>Jun 21, 2025</span>
                  <span>Ravi</span>
                </p>
                <h3 className="text-xl font-medium text-[#2F2F2F] leading-[120%] pt-4 pb-3">
                  {blog.title}
                </h3>
                <p className="text-sm font-normal text-[#707070] leading-[120%] line-clamp-2">
                  {blog.description}
                </p>
                <button className="mt-4 flex items-center gap-2 text-base font-medium text-[#6B46C1] leading-[120%]">
                  Read More <ArrowRight className="text-[#6B46C1] w-5 h-5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <div className="bg-transparent flex items-center justify-between py-[10px] px-4 pb-[37px]">
        <p className="text-sm font-medium leading-[120%]  text-[#707070]">
          Showing {currentPage} to 8 of {10} results
        </p>

        <div>
          <TechstarPagination
            totalPages={10}
            currentPage={currentPage}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>
    </div>
  );
};

export default AllBlogsContainer;

"use client";
import DeleteModal from "@/components/modal/DeleteModal";
import ErrorContainer from "@/components/shared/shared/ErrorContainer/ErrorContainer";
import NotFound from "@/components/shared/shared/NotFound/NotFound";
import TableSkeletonWrapper from "@/components/shared/shared/TableSkeletonWrapper/TableSkeletonWrapper";
import TechstarPagination from "@/components/ui/TechstarPagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowRight, SquarePen, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "react-toastify";

type Blog = {
  _id: string;
  blogTitle: string;
  blogDescription: string; // can contain HTML or plain text
  image: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v: number;
};

type BlogListMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

type BlogListResponse = {
  status: boolean;
  message: string;
  data: Blog[];
  meta: BlogListMeta;
};

const AllBlogsContainer = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);
  const session = useSession();
  const queryClient = useQueryClient();
  const token = (session?.data?.user as { accessToken: string })?.accessToken;

  const { data, isLoading, isError, error } = useQuery<BlogListResponse>({
    queryKey: ["all-blogs", currentPage],
    queryFn: () =>
      fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/blog?page=${currentPage}&limit=8`
      ).then((res) => res.json()),
  });

  // delete api logic
  const { mutate: deleteBlog } = useMutation({
    mutationKey: ["delete-blog"],
    mutationFn: (id: string) =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/blog/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => res.json()),
    onSuccess: (data) => {
      if (!data?.status) {
        toast.error(data?.message || "Failed to delete blog");
        return;
      } else {
        toast.success(data?.message || "Blog deleted successfully");
      }
      queryClient.invalidateQueries({ queryKey: ["all-blogs"] });
    },
  });

  // delete modal logic
  const handleDelete = () => {
    if (selectedBlogId) {
      deleteBlog(selectedBlogId);
    }
    setDeleteModalOpen(false);
  };

  
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

  if (data && data?.data && data?.data?.length === 0) {
    return (
      <div className="my-10 rounded-lg">
        <NotFound message="Oops! No data available. Modify your filters or check your internet connection." />
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-[64px]">
        {data?.data?.map((blog) => {
          return (
            <div key={blog._id} className="pb-[64px]">
              <div className="relative">
                <Image
                  src={blog.image}
                  alt={blog.blogTitle}
                  width={364}
                  height={330}
                  className="w-full h-[330px] object-cover rounded-[16px]"
                  priority
                />

                {/* Overlay Icon */}
                <div className="absolute top-6 right-6 flex items-center gap-4">
                  <Link href={`/documents/all-blogs/edit-blog/${blog._id}`}>
                    <button
                      type="button"
                      className="bg-white rounded-full p-3 shadow-md hover:bg-gray-100 transition"
                      aria-label="Edit blog"
                    >
                      <SquarePen className="text-[#6B46C1] w-4 h-4" />
                    </button>
                  </Link>
                  <button
                    onClick={() => {
                      setDeleteModalOpen(true);
                      setSelectedBlogId(blog?._id);
                    }}
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
                  {blog.blogTitle}
                </h3>
                <p
                  dangerouslySetInnerHTML={{ __html: blog.blogDescription }}
                  className="text-sm font-normal text-[#707070] leading-[120%] line-clamp-2"
                />
                <button className="mt-4 flex items-center gap-2 text-base font-medium text-[#6B46C1] leading-[120%]">
                  Read More <ArrowRight className="text-[#6B46C1] w-5 h-5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {/* pagination  */}
      {data && data?.meta && data?.meta?.totalPages > 1 && (
        <div className="bg-transparent flex items-center justify-between py-[10px] px-4 pb-[37px]">
          <p className="text-sm font-medium leading-[120%]  text-[#707070]">
            Showing {currentPage} to {data && data?.meta && data?.meta?.limit}{" "}
            of {data && data?.meta && data?.meta?.totalPages} results
          </p>

          <div>
            <TechstarPagination
              totalPages={data && data?.meta && data?.meta?.totalPages}
              currentPage={currentPage}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        </div>
      )}

      {/* delete modal  */}
      {deleteModalOpen && (
        <DeleteModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
};

export default AllBlogsContainer;

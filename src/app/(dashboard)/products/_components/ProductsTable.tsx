// 'use client';
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import Image from "next/image";
// import { ChevronUp, Edit, Eye, Trash2 } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { useState } from "react";
// import TechstarPagination from "@/components/ui/TechstarPagination";
// import { toast } from "sonner";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import ProductDetails from "./ProductDetails";
// import { useSession } from "next-auth/react";




// interface ProductPrice {
//   unit: string;
//   quantity: number;
//   price: number;
// }

// interface Product {
//   _id: string;
//   name: string;
//   description: string;
//   benefits: string[];
//   prices: ProductPrice[];
//   photo: string[];
//   createdAt: string;
//   slug: string; 
// }

// interface ApiResponse {
//   success: boolean;
//   message: string;
//   data: Product[];
//   meta: {
//     currentPage: number;
//     totalPages: number;
//     totalItems: number;
//     itemsPerPage: number;
//   };
// }

// const fetchProducts = async (page: number): Promise<ApiResponse> => {
//   const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products?page=${page}`);
//   if (!response.ok) {
//     throw new Error("Failed to fetch products");
//   }
//   return response.json();
// };

// const deleteProduct = async (productId: string): Promise<void> => {
//   const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products/${productId}`, {
//     method: "DELETE",
//   });
//   if (!response.ok) {
//     throw new Error("Failed to delete product");
//   }
// };

// export default function ProductsTable() {
//   const [currentPage, setCurrentPage] = useState(1);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [productToDelete, setProductToDelete] = useState<string | null>(null);
//   const [selectedProductSlug, setSelectedProductSlug] = useState<string | null>(null);
//   const queryClient = useQueryClient();
//   const session = useSession()
//   const token = (session?.data?.user as { accessToken: string })?.accessToken

//   const { data, isLoading, error } = useQuery<ApiResponse>({
//     queryKey: ["products", currentPage],
//     queryFn: () => fetchProducts(currentPage),
//   });

//   const deleteMutation = useMutation({
//     mutationFn: deleteProduct,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["products", currentPage] });
//       toast.success("Product deleted successfully");
//       setIsDeleteModalOpen(false);
//       setProductToDelete(null);
//     },
//     onError: () => {
//       toast.error("Failed to delete product");
//     },
//   });

//   const handleDeleteClick = (productId: string) => {
//     setProductToDelete(productId);
//     setIsDeleteModalOpen(true);
//   };

//   const handleConfirmDelete = () => {
//     if (productToDelete) {
//       deleteMutation.mutate(productToDelete);
//     }
//   };

//   const handleViewClick = (slug: string) => {
//     setSelectedProductSlug(slug);
//   };

//   const handleBackToTable = () => {
//     setSelectedProductSlug(null);
//   };

//   if (error) {
//     return <div>Error fetching products: {error.message}</div>;
//   }

//   if (selectedProductSlug) {
//     return <ProductDetails slug={selectedProductSlug} onBack={handleBackToTable} />;
//   }

//   return (
//     <div className="min-h-screen mt-[32px]">
//       <div className="w-full mx-auto bg-white rounded-lg shadow-sm overflow-hidden">
//         {/* Table Header */}
//         <div className="grid grid-cols-[1fr_1fr_auto_auto_auto] md:grid-cols-[2fr_2fr_1fr_1fr_1fr] gap-4 p-4 border-b text-sm font-semibold text-[#6B7280] bg-[#F9FAFB]">
//           <div className="col-span-1">Product Name</div>
//           <div className="col-span-1">Key Benefits</div>
//           <div className="col-span-1 hidden md:block">Price</div>
//           <div className="col-span-1 hidden md:block">Added Date</div>
//           <div className="col-span-1 text-right">Actions</div>
//         </div>

//         {/* Skeleton Loading State */}
//         {isLoading ? (
//           <div className="divide-y divide-gray-100">
//             {[...Array(5)].map((_, index) => (
//               <div
//                 key={index}
//                 className="grid grid-cols-[1fr_1fr_auto_auto_auto] md:grid-cols-[2fr_2fr_1fr_1fr_1fr] gap-4 p-4 items-center animate-pulse"
//               >
//                 <div className="flex items-start gap-4 col-span-1">
//                   <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
//                   <div className="grid gap-2">
//                     <div className="h-5 w-40 bg-gray-200 rounded"></div>
//                     <div className="h-4 w-60 bg-gray-200 rounded"></div>
//                   </div>
//                 </div>
//                 <div className="grid gap-2 col-span-1">
//                   {[...Array(3)].map((_, i) => (
//                     <div key={i} className="flex items-center gap-2">
//                       <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
//                       <div className="h-4 w-32 bg-gray-200 rounded"></div>
//                       <div className="h-4 w-16 bg-gray-200 rounded ml-auto hidden md:block"></div>
//                       <div className="h-4 w-16 bg-gray-200 rounded hidden md:block"></div>
//                     </div>
//                   ))}
//                 </div>
//                 <div className="h-4 w-16 bg-gray-200 rounded hidden md:block col-span-1"></div>
//                 <div className="h-4 w-24 bg-gray-200 rounded hidden md:block col-span-1"></div>
//                 <div className="flex items-center justify-end gap-2 col-span-1">
//                   {[...Array(3)].map((_, i) => (
//                     <div key={i} className="w-8 h-8 bg-gray-200 rounded-full"></div>
//                   ))}
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           /* Product Rows */
//           <div className="divide-y divide-gray-100">
//             {data?.data.map((product) => (
//               <div
//                 key={product._id}
//                 className="grid grid-cols-[1fr_1fr_auto_auto_auto] md:grid-cols-[2fr_2fr_1fr_1fr_1fr] gap-4 p-4 items-center"
//               >
//                 {/* Product Name & Description */}
//                 <div className="flex items-start gap-4 col-span-1">
//                   <Image
//                     src={product.photo[0] || "/placeholder.svg"}
//                     alt={product.name}
//                     width={80}
//                     height={80}
//                     className="rounded-lg object-cover aspect-square"
//                   />
//                   <div className="grid gap-1">
//                     <h3 className="font-semibold text-[18px] text-[#111827]">{product.name}</h3>
//                     <p className="text-xs text-[#111827] font-normal line-clamp-2">{product.description}</p>
//                   </div>
//                 </div>

//                 {/* Key Benefits */}
//                 <div className="grid gap-1 text-sm col-span-1">
//                   {product.benefits.map((benefit, index) => (
//                     <div key={index} className="flex items-center gap-2">
//                       <ChevronUp className="w-3 h-3 text-gray-400" />
//                       <span className="text-[#111827] text-sm font-normal">{benefit}</span>
//                       <span className="text-[#111827] text-sm font-medium ml-auto hidden md:inline">
//                         {product.prices[0]?.quantity} {product.prices[0]?.unit}
//                       </span>
//                       <span className="text-gray-700 font-medium hidden md:inline">
//                         ${product.prices[0]?.price.toFixed(2)}
//                       </span>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Price (hidden on small screens, combined with benefits) */}
//                 <div className="text-sm text-[#111827] font-medium hidden md:block col-span-1">
//                   ${product.prices[0]?.price.toFixed(2)}
//                 </div>

//                 {/* Added Date */}
//                 <div className="text-sm text-[#6B7280] hidden md:block col-span-1">
//                   {new Date(product.createdAt).toLocaleDateString()}
//                 </div>

//                 {/* Actions */}
//                 <div className="flex items-center justify-end gap-2 col-span-1">
//                   <Button variant="ghost" size="icon" className="w-8 h-8">
//                     <Edit className="w-4 h-4 text-gray-500" />
//                     <span className="sr-only">Edit</span>
//                   </Button>
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="w-8 h-8"
//                     onClick={() => handleViewClick(product.slug)}
//                   >
//                     <Eye className="w-4 h-4 text-gray-500" />
//                     <span className="sr-only">View</span>
//                   </Button>
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="w-8 h-8"
//                     onClick={() => handleDeleteClick(product._id)}
//                   >
//                     <Trash2 className="w-4 h-4 text-gray-500" />
//                     <span className="sr-only">Delete</span>
//                   </Button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Delete Confirmation Modal */}
//         <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
//           <DialogContent className="bg-white">
//             <DialogHeader>
//               <DialogTitle>Confirm Deletion</DialogTitle>
//               <DialogDescription>
//                 Are you sure you want to delete this product? This action cannot be undone.
//               </DialogDescription>
//             </DialogHeader>
//             <DialogFooter>
//               <Button
//                 variant="outline"
//                 className="text-gray-600"
//                 onClick={() => {
//                   setIsDeleteModalOpen(false);
//                   setProductToDelete(null);
//                 }}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 variant="destructive"
//                 onClick={handleConfirmDelete}
//                 disabled={deleteMutation.isPending}
//                 className="bg-red-600 text-white"
//               >
//                 {deleteMutation.isPending ? "Deleting..." : "Delete"}
//               </Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>

//         {/* Pagination */}
//         <div className="bg-white flex items-center justify-between py-[10px] px-4">
//           <p className="text-sm font-medium leading-[120%] text-[#707070]">
//             Showing {currentPage} to {data?.meta.currentPage} of {data?.meta.totalPages} results
//           </p>
//           {data?.meta && (
//             <div className="p-4 border-t border-[#FFFFFF] text-sm text-gray-600">
//               <TechstarPagination
//                 totalPages={data.meta.totalPages}
//                 currentPage={currentPage}
//                 onPageChange={(page) => setCurrentPage(page)}
//               />
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }



"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { ChevronUp, Edit, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import TechstarPagination from "@/components/ui/TechstarPagination";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ProductDetails from "./ProductDetails";
import AddProductForm from "./AddProductForm";
// import { useSession } from "next-auth/react";

interface ProductPrice {
  unit: string;
  quantity: number;
  price: number;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  benefits: string[];
  prices: ProductPrice[];
  photo: string[];
  createdAt: string;
  slug: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: Product[];
  meta: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

const fetchProducts = async (page: number): Promise<ApiResponse> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products?page=${page}`);
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }
  return response.json();
};

const deleteProduct = async (productId: string): Promise<void> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products/${productId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete product");
  }
};

export default function ProductsTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [selectedProductSlug, setSelectedProductSlug] = useState<string | null>(null);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const queryClient = useQueryClient();
  // const { data: session } = useSession();
  // const token = (session?.user as { accessToken: string })?.accessToken;

  const { data, isLoading, error } = useQuery<ApiResponse>({
    queryKey: ["products", currentPage],
    queryFn: () => fetchProducts(currentPage),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products", currentPage] });
      toast.success("Product deleted successfully");
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    },
    onError: () => {
      toast.error("Failed to delete product");
    },
  });

  const handleDeleteClick = (productId: string) => {
    setProductToDelete(productId);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (productToDelete) {
      deleteMutation.mutate(productToDelete);
    }
  };

  const handleViewClick = (slug: string) => {
    setSelectedProductSlug(slug);
  };

  const handleEditClick = (product: Product) => {
    setEditProduct(product);
  };

  const handleBackToTable = () => {
    setSelectedProductSlug(null);
    setEditProduct(null);
  };

  if (error) {
    return <div>Error fetching products: {error.message}</div>;
  }

  if (selectedProductSlug) {
    return <ProductDetails slug={selectedProductSlug} onBack={handleBackToTable} />;
  }

  if (editProduct) {
    return <AddProductForm isEditing={true} editProduct={editProduct} onSave={handleBackToTable} onCancel={handleBackToTable} />;
  }

  return (
    <div className="min-h-screen mt-[32px]">
      <div className="w-full mx-auto bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-[1fr_1fr_auto_auto_auto] md:grid-cols-[2fr_2fr_1fr_1fr_1fr] gap-4 p-4 border-b text-sm font-semibold text-[#6B7280] bg-[#F9FAFB]">
          <div className="col-span-1">Product Name</div>
          <div className="col-span-1">Key Benefits</div>
          <div className="col-span-1 hidden md:block">Price</div>
          <div className="col-span-1 hidden md:block">Added Date</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>

        {/* Skeleton Loading State */}
        {isLoading ? (
          <div className="divide-y divide-gray-100">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="grid grid-cols-[1fr_1fr_auto_auto_auto] md:grid-cols-[2fr_2fr_1fr_1fr_1fr] gap-4 p-4 items-center animate-pulse"
              >
                <div className="flex items-start gap-4 col-span-1">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                  <div className="grid gap-2">
                    <div className="h-5 w-40 bg-gray-200 rounded"></div>
                    <div className="h-4 w-60 bg-gray-200 rounded"></div>
                  </div>
                </div>
                <div className="grid gap-2 col-span-1">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
                      <div className="h-4 w-32 bg-gray-200 rounded"></div>
                      <div className="h-4 w-16 bg-gray-200 rounded ml-auto hidden md:block"></div>
                      <div className="h-4 w-16 bg-gray-200 rounded hidden md:block"></div>
                    </div>
                  ))}
                </div>
                <div className="h-4 w-16 bg-gray-200 rounded hidden md:block col-span-1"></div>
                <div className="h-4 w-24 bg-gray-200 rounded hidden md:block col-span-1"></div>
                <div className="flex items-center justify-end gap-2 col-span-1">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Product Rows */
          <div className="divide-y divide-gray-100">
            {data?.data.map((product) => (
              <div
                key={product._id}
                className="grid grid-cols-[1fr_1fr_auto_auto_auto] md:grid-cols-[2fr_2fr_1fr_1fr_1fr] gap-4 p-4 items-center"
              >
                {/* Product Name & Description */}
                <div className="flex items-start gap-4 col-span-1">
                  <Image
                    src={product.photo[0] || "/placeholder.svg"}
                    alt={product.name}
                    width={80}
                    height={80}
                    className="rounded-lg object-cover aspect-square"
                  />
                  <div className="grid gap-1">
                    <h3 className="font-semibold text-[18px] text-[#111827]">{product.name}</h3>
                    <p className="text-xs text-[#111827] font-normal line-clamp-2">{product.description}</p>
                  </div>
                </div>

                {/* Key Benefits */}
                <div className="grid gap-1 text-sm col-span-1">
                  {product.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <ChevronUp className="w-3 h-3 text-gray-400" />
                      <span className="text-[#111827] text-sm font-normal">{benefit}</span>
                      <span className="text-[#111827] text-sm font-medium ml-auto hidden md:inline">
                        {product.prices[0]?.quantity} {product.prices[0]?.unit}
                      </span>
                      <span className="text-gray-700 font-medium hidden md:inline">
                        ${product.prices[0]?.price.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Price (hidden on small screens, combined with benefits) */}
                <div className="text-sm text-[#111827] font-medium hidden md:block col-span-1">
                  ${product.prices[0]?.price.toFixed(2)}
                </div>

                {/* Added Date */}
                <div className="text-sm text-[#6B7280] hidden md:block col-span-1">
                  {new Date(product.createdAt).toLocaleDateString()}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 col-span-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-8 h-8"
                    onClick={() => handleEditClick(product)}
                  >
                    <Edit className="w-4 h-4 text-gray-500" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-8 h-8"
                    onClick={() => handleViewClick(product.slug)}
                  >
                    <Eye className="w-4 h-4 text-gray-500" />
                    <span className="sr-only">View</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-8 h-8"
                    onClick={() => handleDeleteClick(product._id)}
                  >
                    <Trash2 className="w-4 h-4 text-gray-500" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this product? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                className="text-gray-600"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setProductToDelete(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmDelete}
                disabled={deleteMutation.isPending}
                className="bg-red-600 text-white"
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Pagination */}
        <div className="bg-white flex items-center justify-between py-[10px] px-4">
          <p className="text-sm font-medium leading-[120%] text-[#707070]">
            Showing {currentPage} to {data?.meta.currentPage} of {data?.meta.totalPages} results
          </p>
          {data?.meta && (
            <div className="p-4 border-t border-[#FFFFFF] text-sm text-gray-600">
              <TechstarPagination
                totalPages={data.meta.totalPages}
                currentPage={currentPage}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
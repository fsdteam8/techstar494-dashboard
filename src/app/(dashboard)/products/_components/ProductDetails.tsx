'use client';
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface ProductPrice {
  unit: string;
  quantity: number;
  price: number;
}

interface Product {
  _id: string;
  name: string;
  slug: string;
  batch: string;
  description: string;
  disclaimers: string;
  benefits: string[];
  prices: ProductPrice[];
  photo: string[];
  category: string;
  experiences: string[];
  dosage: string;
  coas: string[];
  restrictedStates: string[];
  expirationDate: string;
  createdAt: string;
  updatedAt: string;
  id: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: Product;
}

interface ProductDetailsProps {
  slug: string;
  onBack: () => void;
}

const fetchProductDetails = async (slug: string): Promise<ApiResponse> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products/slug/${slug}`);
  if (!response.ok) {
    throw new Error("Failed to fetch product details");
  }
  return response.json();
};

export default function ProductDetails({ slug, onBack }: ProductDetailsProps) {
  const { data, isLoading, error } = useQuery<ApiResponse>({
    queryKey: ["product", slug],
    queryFn: () => fetchProductDetails(slug),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-600">Loading product details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">Error: {error.message}</div>
      </div>
    );
  }

  const product = data?.data;

  return (
    <div className="min-h-screen mt-[32px]">
      <Button
        variant="ghost"
        className="mb-4 flex items-center gap-2"
        onClick={onBack}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Products
      </Button>

      {product && (
        <div className="w-full mx-auto  ">
          <div className="flex gap-10 ">
            {/* Product Images */}
            <div className="space-y-4 w-[35%]">
              <Image
                src={product.photo[0] || "/placeholder.svg"}
                alt={product.name}
                width={300}
                height={300}
                className="rounded-lg object-cover w-full h-[400px]"
              />
              {product.photo.length > 1 && (
                <div className="grid grid-cols-3 gap-2">
                  {product.photo.slice(1).map((photo, index) => (
                    <Image
                      key={index}
                      src={photo}
                      alt={`${product.name} ${index + 1}`}
                      width={100}
                      height={100}
                      className="rounded-lg  object-cover aspect-square"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-4 w-[60%]">
              <h1 className="text-2xl font-bold text-[#111827]">{product.name}</h1>
              <p className="text-sm text-[#6B7280]">{product.description}</p>
              <p className="text-sm text-red-600">{product.disclaimers}</p>

              <div>
                <h2 className="text-lg font-semibold text-[#111827]">Benefits</h2>
                <ul className="list-disc list-inside text-sm text-[#111827]">
                  {product.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-[#111827]">Pricing</h2>
                {product.prices.map((price, index) => (
                  <p key={index} className="text-sm text-[#111827]">
                    {price.quantity} {price.unit} - ${price.price.toFixed(2)}
                  </p>
                ))}
              </div>

              <div>
                <h2 className="text-lg font-semibold text-[#111827]">Details</h2>
                <p className="text-sm text-[#111827]">
                  <span className="font-medium">Batch:</span> {product.batch}
                </p>
                <p className="text-sm text-[#111827]">
                  <span className="font-medium">Category:</span> {product.category}
                </p>
                <p className="text-sm text-[#111827]">
                  <span className="font-medium">Experiences:</span> {product.experiences.join(", ")}
                </p>
                <p className="text-sm text-[#111827]">
                  <span className="font-medium">Dosage:</span> {product.dosage}
                </p>
                <p className="text-sm text-[#111827]">
                  <span className="font-medium">Restricted States:</span>{" "}
                  {product.restrictedStates.join(", ")}
                </p>
                <p className="text-sm text-[#111827]">
                  <span className="font-medium">Expiration Date:</span>{" "}
                  {new Date(product.expirationDate).toLocaleDateString()}
                </p>
                <p className="text-sm text-[#111827]">
                  <span className="font-medium">Created At:</span>{" "}
                  {new Date(product.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-[#111827]">
                  <span className="font-medium">Updated At:</span>{" "}
                  {new Date(product.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
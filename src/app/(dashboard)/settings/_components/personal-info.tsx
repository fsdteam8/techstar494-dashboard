"use client";

import { Button } from "@/components/ui/button";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { Camera, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
export type User = {
  _id: string;
  name: string;
  email: string;
  dob: string | null;
  gender: "male" | "female" | "other";
  role: "ADMIN" | "USER" | "MODERATOR" | string;
  stripeAccountId: string | null;
  bio: string;
  phone: string;
  profileImage: string;
  multiProfileImage: string[];
  pdfFile: string;
  otp: string | null;
  otpExpires: string | null;
  isVerified: boolean;
  refreshToken: string;
  lastLoginAt: string;
  hasActiveSubscription: boolean;
  subscriptionExpireDate: string | null;
  blockedUsers: string[];
  language: string;
  address: {
    country: string;
    cityState: string;
    roadArea: string;
    postalCode: string;
    taxId: string;
  };
};

export type UserResponse = {
  status: boolean;
  message: string;
  data: User;
};

const PersonalInfo = () => {
  const session = useSession();
  const token = (session?.data?.user as { accessToken: string })?.accessToken;
  const userId = (session?.data?.user as { id: string })?.id;
  const queryClient = new QueryClient();

  const [profileImage, setProfileImage] = useState("/images/no-img.webp");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // get api
  const { data } = useQuery<UserResponse>({
    queryKey: ["profile-img", userId],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/${userId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => res.json()),
  });

  // post api
  const { mutate, isPending } = useMutation({
    mutationKey: ["upload-profile-image", userId],
    mutationFn: async (formData: FormData) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/upload-avatar/${userId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );
      if (!res.ok) throw new Error("Upload failed");
      return res.json();
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Profile image added successfully!");
      queryClient.invalidateQueries({
        queryKey: ["profile-img"],
      });
      console.log("Response:", data);
    },
    onError: (error) => {
      toast.error("Upload failed");
      console.error(error);
    },
  });

  // delete api
  const { mutate: deleteImage } = useMutation({
    mutationKey: ["delete-profile-image", userId],
    mutationFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/upload-avatar/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!res.ok) throw new Error("Delete failed");
      return res.json();
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Profile image deleted successfully!");
      queryClient.invalidateQueries({
        queryKey: ["profile-img"],
      });
      console.log("Response:", data);
    },
    onError: (error) => {
      toast.error("Delete failed");
      console.error(error);
    },
  });

  useEffect(() => {
    const profileImage = data?.data?.profileImage;
    if (profileImage) {
      setProfileImage(profileImage);
    }
  }, [data?.data?.profileImage]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file to backend
    const formData = new FormData();
    formData.append("profileImage", file, file.name);
    mutate(formData);
  };

  const handleDelete = () => {
    deleteImage();
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-4 mb-8 bg-[#6459490D] px-6 py-8 rounded-[12px] relative mt-8">
      <div className="relative">
        <div className="w-32 h-32 rounded-full overflow-hidden border relative">
          <Image
            src={profileImage}
            alt="Profile"
            width={128}
            height={128}
            className="object-cover"
          />
        </div>

        <div className="absolute -bottom-2 -right-2 flex gap-1">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleFileChange}
          />

          {/* Camera Icon (Choose & Upload Image) */}
          <Button
            size="sm"
            className="w-8 h-8 p-0 rounded-full bg-[#2c5d7c] hover:bg-[#1e4258]"
            title="Upload new image"
            onClick={() => fileInputRef.current?.click()}
            disabled={isPending}
          >
            <Camera className="w-4 h-4" />
          </Button>

          {/* Trash Icon (Reset image) */}
          <Button
            size="sm"
            className="w-8 h-8 p-0 rounded-full bg-red-500 hover:bg-red-600"
            title="Delete current image"
            onClick={handleDelete}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="h-full flex flex-col items-start justify-center">
        <h4>{data?.data?.name}</h4>
        <p>{data?.data?.email}</p>
        <p>{data?.data?.address?.cityState} , {data?.data?.address?.country}</p>
      </div>
    </div>
  );
};

export default PersonalInfo;

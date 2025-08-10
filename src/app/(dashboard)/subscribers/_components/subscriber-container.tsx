"use client";
import TechstarPagination from "@/components/ui/TechstarPagination";
import Image from "next/image";
import React, { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ListFilter } from "lucide-react";

// TypeScript type
export type Order = {
  id: number;
  image: string;
  customerName: string;
  subId: string;
  date: string;
  email: string;
  status: string;
};

export const orderData: Order[] = [
  {
    id: 1,
    image: "/assets/images/user.jpg",
    customerName: "Mr. Raja",
    subId: "SUB-1001",
    date: "2023-05-01",
    email: "raja@example.com",
    status: "Active",
  },
  {
    id: 2,
    image: "/assets/images/user.jpg",
    customerName: "Ms. Anika",
    subId: "SUB-1002",
    date: "2023-06-15",
    email: "anika@example.com",
    status: "Active",
  },
  {
    id: 3,
    image: "/assets/images/user.jpg",
    customerName: "Mr. Karim",
    subId: "SUB-1003",
    date: "2023-07-21",
    email: "karim@example.com",
    status: "Active",
  },
  {
    id: 4,
    image: "/assets/images/user.jpg",
    customerName: "Ms. Fatima",
    subId: "SUB-1004",
    date: "2023-08-03",
    email: "fatima@example.com",
    status: "Active",
  },
  {
    id: 5,
    image: "/assets/images/user.jpg",
    customerName: "Mr. Hasan",
    subId: "SUB-1005",
    date: "2023-09-14",
    email: "hasan@example.com",
    status: "Active",
  },
  {
    id: 6,
    image: "/assets/images/user.jpg",
    customerName: "Ms. Rina",
    subId: "SUB-1006",
    date: "2023-10-05",
    email: "rina@example.com",
    status: "Active",
  },
];

const SubscriberContainer = () => {
  const [currentPage, setCurrentPage] = useState(1);
  return (
    <div>
      <div className="w-full flex items-center justify-end py-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-[10px] py-[15px] px-[32px] rounded-[8px] border-[1.5px] border-primary text-sm font-medium text-black leading-[120%]">
            <ListFilter size={20} className="text-primary" /> Filters
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-[5rem] bg-[#F0EDF9]">
            <DropdownMenuLabel className="cursor-pointer text-sm font-medium text-[#737373] leading-[120%]">
              This Month
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#B3B3B3]" />
            <DropdownMenuLabel className="cursor-pointer text-sm font-medium text-[#737373] leading-[120%]">
              Previous Month
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#B3B3B3]" />
            <DropdownMenuLabel className="cursor-pointer text-sm font-medium text-[#737373] leading-[120%]">
              Last Month
            </DropdownMenuLabel>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="mt-2">
        <table className="w-full">
          <thead className="bg-[#F9FAFB] rounded-t-[8px]">
            <tr className="w-full grid grid-cols-4 py-3 px-4">
              <th className="text-sm text-[#6B7280] font-medium leading-[120%] text-left">
                Subscriber Name
              </th>
              <th className="text-sm text-[#6B7280] font-medium leading-[120%] text-center">
                Subscribed Date
              </th>
              <th className="text-sm text-[#6B7280] font-medium leading-[120%] text-center">
                Email Address
              </th>
              <th className="text-sm text-[#6B7280] font-medium leading-[120%] text-center">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {orderData?.map((order) => (
              <tr
                key={order.id}
                className="w-full bg-white grid grid-cols-4 p-4 mb-[2px]"
              >
                <td className="flex items-center justify-start gap-2 text-center">
                  <div>
                    <Image
                      src={order.image}
                      alt="user"
                      width={60}
                      height={60}
                      className="w-[60px] h-[60px] rounded-[8px]"
                    />
                  </div>
                  <div className=" w-full flex flex-col items-start">
                    <p className="text-lg text-[#111827] font-semibold leading-[120%]">
                      {order.customerName}
                    </p>
                    <p className="text-sm text-[#111827] font-normal leading-[120%] pt-[2px]">
                      {order.subId}
                    </p>
                  </div>
                </td>
                <td className="h-full flex items-center justify-center text-sm text-[#6B7280] font-medium leading-[120%] text-center">
                  {order.date}
                </td>
                <td className="h-full flex items-center justify-center text-sm text-[#6B7280] font-medium leading-[120%] text-center">
                  {order.email}
                </td>
                <td className="h-full flex items-center justify-center">
                  <button
                    type="button"
                    className={`h-[22px] w-[116px] flex items-center justify-center py-1 rounded-full  text-sm bg-[#D5FFD5] text-[#6B7280] font-medium leading-[120%] text-center`}
                  >
                    {order.status}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* <div className="">
          {data &&
            data?.data &&
            data?.data?.pagination &&
            data?.data?.pagination?.totalPages > 1 && (
              <div className="bg-white flex items-center justify-between py-[10px] px-4">
                <p className="text-sm font-medium leading-[120%]  text-[#707070]">
                  Showing {currentPage} to 8 of{" "}
                  {data?.data?.pagination?.totalData} results
                </p>

                <div>
                  <TechstarPagination
                    totalPages={data?.data?.pagination?.totalPages}
                    currentPage={currentPage}
                    onPageChange={(page) => setCurrentPage(page)}
                  />
                </div>
              </div>
            )}
        </div> */}
        <div className="bg-white flex items-center justify-between py-[10px] px-4">
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
    </div>
  );
};

export default SubscriberContainer;

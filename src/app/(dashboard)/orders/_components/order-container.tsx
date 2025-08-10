// import TechstarPagination from "@/components/ui/TechstarPagination";
import Image from "next/image";
// import React, { useState } from "react";

// TypeScript type
export type Order = {
  id: number;
  image: string;
  customerName: string;
  orderProduct: string;
  purchasedDate: string; // ISO date format (YYYY-MM-DD)
  price: string; // formatted with currency symbol
  status: "Pending" | "Ongoing" | "Delivered";
};

// Sample data
export const orderData: Order[] = [
  {
    id: 1,
    customerName: "John Doe",
    image: "/assets/images/user.jpg",
    orderProduct: "Product A",
    purchasedDate: "2023-05-01",
    price: "$10.99",
    status: "Delivered",
  },
  {
    id: 2,
    customerName: "Jane Smith",
    image: "/assets/images/user.jpg",
    orderProduct: "Product B",
    purchasedDate: "2023-05-03",
    price: "$25.50",
    status: "Pending",
  },
  {
    id: 3,
    customerName: "Michael Johnson",
    image: "/assets/images/user.jpg",
    orderProduct: "Product C",
    purchasedDate: "2023-05-05",
    price: "$18.75",
    status: "Ongoing",
  },
  {
    id: 4,
    customerName: "Emily Davis",
    image: "/assets/images/user.jpg",
    orderProduct: "Product D",
    purchasedDate: "2023-05-06",
    price: "$12.00",
    status: "Pending",
  },
  {
    id: 5,
    customerName: "Chris Wilson",
    image: "/assets/images/user.jpg",
    orderProduct: "Product E",
    purchasedDate: "2023-05-07",
    price: "$8.99",
    status: "Ongoing",
  },
  {
    id: 6,
    customerName: "Olivia Brown",
    image: "/assets/images/user.jpg",
    orderProduct: "Product F",
    purchasedDate: "2023-05-08",
    price: "$15.00",
    status: "Delivered",
  },
  {
    id: 7,
    customerName: "William Taylor",
    image: "/assets/images/user.jpg",
    orderProduct: "Product G",
    purchasedDate: "2023-05-09",
    price: "$20.25",
    status: "Pending",
  },
  {
    id: 8,
    customerName: "Sophia Martinez",
    image: "/assets/images/user.jpg",
    orderProduct: "Product H",
    purchasedDate: "2023-05-10",
    price: "$9.99",
    status: "Delivered",
  },
  {
    id: 9,
    customerName: "James Anderson",
    image: "/assets/images/user.jpg",
    orderProduct: "Product I",
    purchasedDate: "2023-05-11",
    price: "$30.00",
    status: "Pending",
  },
  {
    id: 10,
    customerName: "Isabella Thomas",
    image: "/assets/images/user.jpg",
    orderProduct: "Product J",
    purchasedDate: "2023-05-12",
    price: "$5.49",
    status: "Delivered",
  },
];
const OrderContainer = () => {
  // const [currentPage, setCurrentPage] = useState(1);
  return (
    <div>
      <div className="mt-8">
        <table className="w-full">
          <thead className="bg-[#F9FAFB] rounded-t-[8px]">
            <tr className="w-full grid grid-cols-5 py-3 px-4">
              <th className="text-sm text-[#6B7280] font-medium leading-[120%] text-left">
                Customer Name
              </th>
              <th className="text-sm text-[#6B7280] font-medium leading-[120%] text-center">
                Ordered product
              </th>
              <th className="text-sm text-[#6B7280] font-medium leading-[120%] text-center">
                Purchased date
              </th>
              <th className="text-sm text-[#6B7280] font-medium leading-[120%] text-center">
                Price
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
                className="w-full bg-white grid grid-cols-5 p-4 mb-[2px]"
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
                      {order.customerName}
                    </p>
                  </div>
                </td>
                <td className="h-full flex items-center justify-center text-sm text-[#6B7280] font-medium leading-[120%] text-center">
                  {order.orderProduct}
                </td>
                <td className="h-full flex items-center justify-center text-sm text-[#6B7280] font-medium leading-[120%] text-center">
                  {order.purchasedDate}
                </td>
                <td className="h-full flex items-center justify-center text-sm text-[#6B7280] font-medium leading-[120%] text-center">
                  {order.price}
                </td>
                <td className="h-full flex items-center justify-center">
                  <button
                    type="button"
                    className={`h-[22px] w-[116px] flex items-center justify-center py-1 rounded-full  text-sm text-[#6B7280] font-medium leading-[120%] text-center ${
                      order?.status === "Pending"
                        ? "bg-[#FFD5D5]"
                        : order?.status === "Ongoing"
                        ? "bg-[#FBCA85]"
                        : "bg-[#D5FFD5]"
                    }`}
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
              <div className="bg-white flex items-center justify-between py-[10px] px-[50px]">
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
      </div>
    </div>
  );
};

export default OrderContainer;

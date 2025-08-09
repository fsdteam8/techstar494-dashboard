import React from "react";

// TypeScript type
export type Order = {
  id: number;
  customerName: string;
  orderProduct: string;
  purchasedDate: string; // ISO date format (YYYY-MM-DD)
  price: string; // formatted with currency symbol
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
};

// Sample data
export const orderData: Order[] = [
  {
    id: 1,
    customerName: "John Doe",
    orderProduct: "Product A",
    purchasedDate: "2023-05-01",
    price: "$10.99",
    status: "Delivered",
  },
  {
    id: 2,
    customerName: "Jane Smith",
    orderProduct: "Product B",
    purchasedDate: "2023-05-03",
    price: "$25.50",
    status: "Pending",
  },
  {
    id: 3,
    customerName: "Michael Johnson",
    orderProduct: "Product C",
    purchasedDate: "2023-05-05",
    price: "$18.75",
    status: "Shipped",
  },
  {
    id: 4,
    customerName: "Emily Davis",
    orderProduct: "Product D",
    purchasedDate: "2023-05-06",
    price: "$12.00",
    status: "Processing",
  },
  {
    id: 5,
    customerName: "Chris Wilson",
    orderProduct: "Product E",
    purchasedDate: "2023-05-07",
    price: "$8.99",
    status: "Cancelled",
  },
  {
    id: 6,
    customerName: "Olivia Brown",
    orderProduct: "Product F",
    purchasedDate: "2023-05-08",
    price: "$15.00",
    status: "Delivered",
  },
  {
    id: 7,
    customerName: "William Taylor",
    orderProduct: "Product G",
    purchasedDate: "2023-05-09",
    price: "$20.25",
    status: "Pending",
  },
  {
    id: 8,
    customerName: "Sophia Martinez",
    orderProduct: "Product H",
    purchasedDate: "2023-05-10",
    price: "$9.99",
    status: "Shipped",
  },
  {
    id: 9,
    customerName: "James Anderson",
    orderProduct: "Product I",
    purchasedDate: "2023-05-11",
    price: "$30.00",
    status: "Processing",
  },
  {
    id: 10,
    customerName: "Isabella Thomas",
    orderProduct: "Product J",
    purchasedDate: "2023-05-12",
    price: "$5.49",
    status: "Delivered",
  },
];
const OrderContainer = () => {
  return (
    <div>
      <div className="mt-8">
        <table className="w-full">
          <thead>
            <tr className="w-full flex items-center justify-between">
              <th className="text-sm text-[#6B7280] font-medium leading-[120%]">
                Customer Name
              </th>
              <th className="text-sm text-[#6B7280] font-medium leading-[120%]">
                Ordered product
              </th>
              <th className="text-sm text-[#6B7280] font-medium leading-[120%]">
                Purchased date
              </th>
              <th className="text-sm text-[#6B7280] font-medium leading-[120%]">
                Price
              </th>
              <th className="text-sm text-[#6B7280] font-medium leading-[120%]">
                Status
              </th>
            </tr>
          </thead>
        </table>
      </div>
    </div>
  );
};

export default OrderContainer;

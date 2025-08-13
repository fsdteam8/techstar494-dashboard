// import React from "react";
// import "@/app/globals.css";
// const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
//   return <div>{children}</div>;
// };

// export default DashboardLayout;

// app/layout.tsx

import type { ReactNode } from "react";
import "@/app/globals.css";
import ClientLayout from "@/components/overveiw-componet/AppSidebar";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-[#F3F4F6]">
      <ClientLayout>{children}</ClientLayout>
    </div>
  );
}

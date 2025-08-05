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
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}

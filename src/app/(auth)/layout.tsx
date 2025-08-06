import React from "react";
import "@/app/globals.css";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return <div className="bg-[#F0EDF9]">{children}</div>;
};

export default AuthLayout;

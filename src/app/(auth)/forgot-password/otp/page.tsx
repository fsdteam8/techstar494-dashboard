import React, { Suspense } from "react";
import OtpForm from "./_components/otp-form";

const OtpFormPage = () => {
  return (
    <div className="h-screen flex items-center justify-center">
      <Suspense fallback={<div>Loading...</div>}>
        <OtpForm />
      </Suspense>
    </div>
  );
};

export default OtpFormPage;

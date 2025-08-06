import React, { Suspense } from "react";
import AuthLayoutDesign from "../_components/auth-layout";
import OtpForm from "./_components/otp-form";

const OtpFormPage = () => {
  return (
    <div>
      <AuthLayoutDesign>
        <Suspense fallback={<div>Loading...</div>}>
          <OtpForm />
        </Suspense>
      </AuthLayoutDesign>
    </div>
  );
};

export default OtpFormPage;

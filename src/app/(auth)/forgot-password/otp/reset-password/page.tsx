import React, { Suspense } from "react";
import ResetPasswordForm from "./_components/reset-password-form";

const ResetPasswordPage = () => {
  return (
    <div className="h-screen flex items-center justify-center">
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
};

export default ResetPasswordPage;

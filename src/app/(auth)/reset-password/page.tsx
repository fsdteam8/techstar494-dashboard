import React, { Suspense } from "react";
import AuthLayoutDesign from "../_components/auth-layout";
import ResetPasswordForm from "./_components/reset-password-form";

const ResetPasswordPage = () => {
  return (
    <div>
      <AuthLayoutDesign>
        <Suspense fallback={<div>Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </AuthLayoutDesign>
    </div>
  );
};

export default ResetPasswordPage;

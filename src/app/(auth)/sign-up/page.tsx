import React from "react";
import AuthLayoutDesign from "../_components/auth-layout";
import SignUpForm from "./_components/sign-up-form";

const SignUpPage = () => {
  return (
    <div>
      <AuthLayoutDesign>
        <SignUpForm />
      </AuthLayoutDesign>
    </div>
  );
};

export default SignUpPage;

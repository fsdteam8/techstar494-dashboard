import React from "react";
import SettingsHeader from "./_components/settings-header";
import ChangePasswordForm from "./_components/change-password";
// import PersonalInfo from "./_components/personal-info";

const SettingsPage = () => {
  return (
    <div>
      <SettingsHeader />
      {/* <PersonalInfo /> */}
      <ChangePasswordForm />
    </div>
  );
};

export default SettingsPage;

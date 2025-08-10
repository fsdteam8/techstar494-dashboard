import React from "react";
import SendMailForm from "./_components/send-mail-form";

const SendMailPage = () => {
  return (
    <div>
      <h2 className="text-4xl text-black text-center leading-[120%] font-bold pb-10">
        Send mail to the subscribers
      </h2>
      <SendMailForm />
    </div>
  );
};

export default SendMailPage;

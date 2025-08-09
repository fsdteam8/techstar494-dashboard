import React from "react";
import AditFaqHeader from "./_components/edit-faq-header";
import EditFaqForm from "./_components/edit-faq-form";

const EditFaqPage = ({ params }: { params: { id: string } }) => {
  return (
    <div>
      <AditFaqHeader faqId ={params.id}/>
      <EditFaqForm faqId ={params.id}/>
    </div>
  );
};

export default EditFaqPage;

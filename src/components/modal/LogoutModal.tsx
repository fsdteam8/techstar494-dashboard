import React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";

type logoutModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const LogoutModal = ({ isOpen, onClose, onConfirm }: logoutModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[510px] h-auto bg-white border border-[#6B46C1] py-[25px] md:py-[35px] lg:py-[45px] px-[20px] md:px-[26px] lg:px-[32px] rounded-[16px]">
        <div className="w-full flex items-center justify-center pb-4">
          <Image
            src="/assets/images/logout-logo.png"
            alt="logout"
            width={175}
            height={400}
            className="w-[175px] h-[40px] mx-auto"
          />
        </div>
        <DialogHeader>
          <DialogTitle className="text-black text-2xl font-semibold leading-[100%] text-center">
            Are You Sure To Log Out?
          </DialogTitle>
        </DialogHeader>
        <DialogFooter className="w-full flex items-center justify-end gap-3 mt-6 md:mt-8 lg:mt-10">
          <button
            className="w-full h-[48px] text-base font-medium bg-white text-primary leading-[100%] py-[14px] px-[18px] rounded-[8px] border border-primary"
            onClick={onConfirm}
          >
            Yes
          </button>
          <button
            className="w-full h-[48px] text-base font-medium bg-primary text-white leading-[100%] py-[14px] px-[18px] rounded-[8px]"
            onClick={onClose}
          >
            No
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LogoutModal;

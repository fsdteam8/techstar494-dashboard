"use client";

import {
  useState,
  useRef,
  useEffect,
  type KeyboardEvent,
  type ClipboardEvent,
} from "react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";

export default function OtpForm() {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const decodedEmail = decodeURIComponent(email || "");
  const router = useRouter();

  // Focus the first input on component mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    // Update the OTP array
    const newOtp = [...otp];
    newOtp[index] = value.slice(0, 1); // Only take the first character

    setOtp(newOtp);

    // Auto-focus next input if value is entered
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    // Move to previous input on backspace if current input is empty
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0 &&
      inputRefs.current[index - 1]
    ) {
      inputRefs.current[index - 1]?.focus();
    }

    // Handle arrow keys for navigation
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // otp api integration
  const { mutate, isPending } = useMutation({
    mutationKey: ["verify-otp"],
    mutationFn: (values: { otp: string; email: string }) =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/verify-code`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(values),
      }).then((res) => res.json()),
    onSuccess: (data) => {
      if (!data?.status) {
        toast.error(data?.message || "Something went wrong");
        return;
      } else {
        toast.success(data?.message || "Email sent successfully!");
        router.push(
          `/reset-password?email=${encodeURIComponent(decodedEmail)}`
        );
      }
    },
  });

  // reset otp api integrattion
  const { mutate: resentOtp, isPending: resentOtpPending } = useMutation({
    mutationKey: ["fotgot-password"],
    mutationFn: (email: string) =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/forget-password`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ email }),
      }).then((res) => res.json()),
    onSuccess: (data, email) => {
      if (!data?.status) {
        toast.error(data?.message || "Something went wrong");
        return;
      } else {
        toast.success(data?.message || "Email sent successfully!");
        router.push(`/otp?email=${encodeURIComponent(email)}`);
      }
    },
  });

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").trim();

    // Check if pasted content is a valid 6-digit number
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("");
      setOtp(digits);

      // Focus the last input
      if (inputRefs.current[5]) {
        inputRefs.current[5].focus();
      }
    }
  };

  // handle resend otp
  const handleResendOtp = async () => {
    resentOtp(decodedEmail);
  };

  // handle verify otp
  const handleVerify = async () => {
    const otpValue = otp.join("");

    // Check if OTP is complete
    if (otpValue.length !== 6) {
      toast.error("Please enter all 6 digits of the OTP.");
      return;
    }
    mutate({ otp: otpValue, email: decodedEmail });

    console.log("OTP Verified:", otpValue);
  };

  return (
    <div className="w-full md:w-[570px]">
      <h3 className="text-2xl md:text-[32px] lg:text-[40px] font-bold text-black text-left leading-[120%] ">
        Enter OTP
      </h3>
      <p className="text-base md:text-lg lg:text-xl font-medium text-[#B0B0B0] leading-[120%] pt-[5px]">
        We have share a code of your registered email address <br />
        robertfox@example.com
      </p>
      <div className="pt-5 md:pt-6">
        {/* OTP Input Fields */}
        <div className="flex w-full justify-start gap-[18px] md:gap-[24px] lg:gap-[30px]">
          {otp.map((digit, index) => (
            <Input
              key={index}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              className={`w-[50px] md:w-[60px] lg:w-[70px] h-[50px] md:h-[60px] lg:h-[70px] bg-transparent text-black placeholder:text-[#999999] text-center text-2xl md:text-[28px] lg:text-[32px] font-semibold leading-[120%] border-[1px] rounded-[8px] focus:outline-none ${
                digit ? "border-black" : "border-[#B0B0B0]"
              }`}
              aria-label={`OTP digit ${index + 1}`}
            />
          ))}
        </div>

        {/* Resend OTP */}
        <div className="flex items-center justify-between mt-6">
          <span className="text-base font-normal text-black leading-[120%]">
            Didn&apos;t Receive OTP?{" "}
          </span>
          <button
            onClick={handleResendOtp}
            disabled={resentOtpPending}
            className="text-base font-normal text-black cursor-pointer leading-[120%] hover:underline"
          >
            {resentOtpPending ? "Resending..." : "Resend  code"}
          </button>
        </div>

        {/* Verify Button */}
        <div className="mt-5 md:mt-7 lg:mt-8">
          <Button
          disabled={isPending}
          onClick={handleVerify}
          className="text-base font-medium text-white cursor-pointer leading-[120%] rounded-[8px] py-4 w-full h-[51px] bg-primary"
          type="submit"
        >
          {isPending ? "Verifying..." : "Verify"}
        </Button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ChevronLeft } from "lucide-react";

import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

function formatDate(date: Date | undefined) {
  if (!date) {
    return "";
  }
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
function isValidDate(date: Date | undefined) {
  if (!date) {
    return false;
  }
  return !isNaN(date.getTime());
}

const formSchema = z.object({
  couponCode: z.string().min(4, {
    message: "Coupon Code must be at least 4 characters.",
  }),
  discount: z.string().min(1, {
    message: "Discount is required.",
  }),
});

const CouponContainer = () => {
  const session = useSession();
  const token = (session?.data?.user as { accessToken: string })?.accessToken;
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());

  console.log(date);
  const [month, setMonth] = useState<Date | undefined>(date);
  const [value, setValue] = useState(formatDate(date));

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      couponCode: "",
      discount: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["create-coupon"],
    mutationFn: (values: {
      couponCode: string;
      discount: string;
      timeValidation: Date;
    }) =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/coupon-making/create`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      }).then((res) => res.json()),
      onSuccess: (data)=>{
        if(!data?.success){
          toast.error(data?.message || "Something went wrong");
          return;
        }
        toast.success(data?.message || "Coupon added successfully!");
        form.reset();
      }
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!date) {
      console.error("Date is undefined");
      return;
    }
    const payload = {
      couponCode: values.couponCode,
      discount: values.discount,
      timeValidation: date ?? new Date(),
    };
    console.log(payload);
    mutate(payload);
  }
  return (
    <div>
      <div>
        <h2 className="flex items-center gap-2 text-[32px] leading-[120%] font-semibold text-[#1F2937]">
          <ChevronLeft className="w-8 h-8" /> Coupon Making
        </h2>
        <h2 className="text-[32px] leading-[120%] font-semibold text-[#1F2937] pt-8">
          Coupon Making
        </h2>
      </div>
      <div className="mt-[34px]">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 w-full lg:w-1/2"
          >
            <FormField
              control={form.control}
              name="couponCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium text-black leading-[120%]">
                    Coupon code must be 6 characters long and include both
                    letters and numbers.
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="h-[51px] w-full border border-[#666666] rounded-[6px] p-4 placeholder:text-[#666666] placeholder:font-normal text-base font-semibold text-black leading-[120%]"
                      placeholder="Coupon code"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="discount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium text-black leading-[120%]">
                    Set Coupon %
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="h-[51px] w-full border border-[#666666] rounded-[6px] p-4 placeholder:text-[#666666] placeholder:font-normal text-base font-semibold text-black leading-[120%]"
                      placeholder="Input Percentage%"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="discount"
              render={() => (
                <FormItem>
                  <FormLabel className="text-base font-medium text-black leading-[120%]">
                    Validation
                  </FormLabel>
                  <FormControl>
                    <div className="relative flex gap-2">
                      <Input
                        id="date"
                        value={value}
                        placeholder="June 01, 2025"
                        className="h-[51px] w-full border border-[#666666] rounded-[6px] p-4 placeholder:text-[#666666] placeholder:font-normal text-base font-semibold text-black leading-[120%]"
                        onChange={(e) => {
                          const date = new Date(e.target.value);
                          setValue(e.target.value);
                          if (isValidDate(date)) {
                            setDate(date);
                            setMonth(date);
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "ArrowDown") {
                            e.preventDefault();
                            setOpen(true);
                          }
                        }}
                      />
                      <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            id="date-picker"
                            variant="ghost"
                            className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                          >
                            <CalendarIcon className="size-3.5" />
                            <span className="sr-only">Select date</span>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-auto overflow-hidden p-0 bg-white"
                          align="end"
                          alignOffset={-8}
                          sideOffset={10}
                        >
                          <Calendar
                            mode="single"
                            selected={date}
                            captionLayout="dropdown"
                            month={month}
                            onMonthChange={setMonth}
                            onSelect={(date) => {
                              setDate(date);
                              setValue(formatDate(date));
                              setOpen(false);
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <Button
              disabled={isPending}
              className={`h-[51px] bg-[#6B46C1] text-white py-4 px-7 rounded-[8px] text-base leading-[120%] font-medium ${
                isPending && "opacity-50 cursor-not-allowed"
              }`}
              type="submit"
            >
              {isPending ? "Loading..." : "Generate Coupon"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CouponContainer;

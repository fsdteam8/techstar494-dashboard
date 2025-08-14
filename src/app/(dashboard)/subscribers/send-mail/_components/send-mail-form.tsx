/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useMutation } from '@tanstack/react-query'
import QuillEditor from '@/components/ui/quill-editor'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

const FormSchema = z.object({
  subject: z.string().min(1, 'Subject is required'),
  html: z.string().min(1, 'Body is required'),
})

const SendMailForm = () => {
  const router = useRouter()

  const session = useSession()
  const token = (session?.data?.user as { accessToken: string })?.accessToken

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      subject: '',
      html: '',
    },
  })

  const { mutate, isPending } = useMutation({
    mutationKey: ['send-email'],
    mutationFn: async (data: z.infer<typeof FormSchema>) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/subscriber/admin/send-email`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(data),
        }
      )

      const text = await res.text() // get raw server response

      try {
        return JSON.parse(text) // try to parse JSON
      } catch {
        throw new Error(`Invalid JSON from server: ${text}`)
      }
    },
    onSuccess: (data) => {
      if (!data?.success) {
        toast.error(data?.message || 'Something went wrong')
        return
      }
      toast.success(data?.message || 'Email sent successfully')
      form.reset()
      router.push('/subscribers')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to send email')
    },
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log('email sent', data)
    mutate(data)
  }

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full bg-white rounded-[8px] shadow-md p-6 flex flex-col gap-6"
        >
          <h3 className="text-2xl font-bold text-[#111827] leading-normal">
            Compose Your Email
          </h3>

          {/* Subject */}
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-medium text-black">
                  Subject
                </FormLabel>
                <FormControl>
                  <Input
                    className="w-full h-[40px] border border-black rounded-[8px] bg-white text-base font-medium placeholder:text-[#929292]"
                    placeholder="Enter Your Subject..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Body */}
          <FormField
            control={form.control}
            name="html"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-medium text-black">
                  Body
                </FormLabel>
                <FormControl>
                  <QuillEditor
                    id="html"
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit */}
          <div>
            <button
              disabled={isPending}
              className={`w-[154px] h-[54px] py-4 px-8 rounded-[8px] text-base font-bold leading-normal ${
                isPending
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-primary text-white'
              }`}
              type="submit"
            >
              {isPending ? 'Sending...' : 'Send Email'}
            </button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default SendMailForm

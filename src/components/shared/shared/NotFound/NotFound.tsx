import { TextAnimate } from '@/components/magicui/text-animate'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'

interface Props {
  message: string
}

const NotFound = ({ message }: Props) => {
  const router = useRouter()
  return (
    <div className="w-full h-[450px] flex flex-col items-center justify-center bg-white rounded-[16px]">
      {/* Image */}
      <Image
        src="/assets/images/404.png"
        alt="404 Not Found Illustration"
        width={300}
        height={300}
        className="mb-4 w-[250px] h-[250px]"
      />

      {/* Message */}
      <p className="text-lg font-bold text-gradient text-center w-1/3">
        <TextAnimate animation="slideUp" by="word">
          {message}
        </TextAnimate>
      </p>

      {/* Go Back Button */}
      <Button
        onClick={() => router.back()}
        variant="default"
        className="text-white mt-5 rounded-[10px]"
      >
        Go Back
      </Button>
    </div>
  )
}

export default NotFound

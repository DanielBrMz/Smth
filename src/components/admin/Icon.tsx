import Image from 'next/image'
import React from 'react'
import image from '/public/SP_icon.png'

const Logo = () => {
  return (
    <Image
      src={image}
      alt="Sidepocket Icon"
      width={0}
      height={0}
      sizes="100vw"
      className="h-auto w-[23.18rem]"
      priority
    />
  )
}

export default Logo

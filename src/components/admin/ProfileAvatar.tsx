'use client'
import { useAuth } from '@payloadcms/ui'

import Image from 'next/image'
import type { User } from 'payload'

const ProfileAvatar = ({ size = 40 }) => {
  const { user } = useAuth<User>()

  return (
    <div
      className="relative rounded-full overflow-hidden"
      style={{
        width: size,
        height: size,
      }}
    >
      {user && user.profilePicture ? (
        <Image
          src={`http://localhost:3000/api/media/file/${user!.profilePicture.filename}`}
          alt={'Profile Picture'}
          layout="fill"
          objectFit="cover"
          className="rounded-full"
        />
      ) : null}
    </div>
  )
}

export default ProfileAvatar

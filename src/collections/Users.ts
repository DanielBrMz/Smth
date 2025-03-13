import { ensureFirstUserIsAdmin } from '@/hooks/ensureFirstUserIsAdmin'
import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    defaultColumns: ['name', 'lastName', 'username', 'email', 'profilePicture'],
    useAsTitle: 'name',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'lastName',
      type: 'text',
    },
    {
      name: 'username',
      type: 'text',
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
    },
    {
      name: 'phoneNumber',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      hasMany: true,
      saveToJWT: true,
      hooks: {
        beforeChange: [ensureFirstUserIsAdmin],
      },
      defaultValue: ['admin'],
      options: [
        {
          label: 'admin',
          value: 'admin',
        },
        {
          label: 'reviewer',
          value: 'reviewer',
        },
      ],
    },
    {
      name: 'profilePicture',
      type: 'upload',
      relationTo: 'media',
      displayPreview: true,
      required: false,
      localized: true,
    },
  ],
}

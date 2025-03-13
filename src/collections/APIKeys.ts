import { CollectionConfig } from 'payload'
import { v4 as uuidv4 } from 'uuid'

// Type for the APIKey document
export interface APIKey {
  id: string
  name: string
  key: string
  createdBy: {
    id: string
  }
  lastUsed?: Date
  isActive: boolean
}

// Function to generate a secure API key
const generateAPIKey = (): string => {
  const prefix = 'pk'
  const uniqueId = uuidv4().replace(/-/g, '')
  return `${prefix}_${uniqueId}`
}

export const APIKeys: CollectionConfig = {
  slug: 'api-keys',
  admin: {
    useAsTitle: 'name',
    description: 'API Keys for programmatic access to the API',
    group: 'Admin',
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'A friendly name to identify this API key',
      },
    },
    {
      name: 'key',
      type: 'text',
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'The API key value (generated automatically)',
      },
      hooks: {
        beforeChange: [
          ({ operation }) => {
            // Only generate new key on creation
            if (operation === 'create') {
              return generateAPIKey()
            }
          },
        ],
      },
    },
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
      hooks: {
        beforeChange: [
          ({ req }) => {
            return req.user!.id
          },
        ],
      },
    },
    {
      name: 'lastUsed',
      type: 'date',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Last time this key was used',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Deactivate to temporarily disable this API key',
      },
    },
  ],
  hooks: {
    afterRead: [
      // Mask the API key in the admin UI except immediately after creation
      ({ doc, req }) => {
        if (req.url?.includes('/api/')) {
          if (doc.key && !req.url.includes('create')) {
            doc.key = '••••••••' + doc.key.slice(-4)
          }
        }
        return doc
      },
    ],
  },
}

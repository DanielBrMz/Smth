import type { AccessArgs } from 'payload'

import type { User } from '../payload-types'
import { checkRole } from '@/helpers/checkRole'

type isAdmin = (args: AccessArgs<User>) => boolean

export const admins: isAdmin = ({ req: { user } }) => {
  return user ? checkRole(['admin'], user) : false
}

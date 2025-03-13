import type { AccessArgs } from 'payload'

import type { User } from '../payload-types'
import { checkRole } from '@/helpers/checkRole'

type isReviewer = (args: AccessArgs<User>) => boolean

export const reviewers: isReviewer = ({ req: { user } }) => {
  return user ? checkRole(['reviewer'], user) : false
}

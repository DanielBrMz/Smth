import type { AccessArgs } from 'payload'

import type { Endorser } from '../payload-types'

type isEndorser = (args: AccessArgs<Endorser>) => boolean

export const endorsers: isEndorser = ({ req: { user } }) => {
  return Boolean(user)
}

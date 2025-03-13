import type { User } from '@/payload-types'

export const checkRole = (allRoles: User['role'] = [], user?: User): boolean => {
  if (user) {
    if (
      allRoles?.some((role) => {
        return user?.role?.some((individualRole) => {
          return individualRole === role
        })
      })
    )
      return true
  }

  return false
}

import { CollectionConfig } from 'payload'
import {
  type AudienceMember,
  type Distribution,
  type AudienceStats,
  EmploymentStatus,
  IncomeRange,
  InvestmentExperience,
  NetWorthRange,
  AudienceStatus,
} from '../types/audience'
import type { Endorser } from '@/payload-types'

export const Audiences: CollectionConfig = {
  slug: 'audience',
  admin: {
    useAsTitle: 'mainAppUserId',
    defaultColumns: ['mainAppUserId', 'endorser', 'employmentStatus', 'state', 'createdAt'],
    group: 'Endorser Platform',
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'mainAppUserId',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'User ID from the main application',
      },
      index: true,
    },
    {
      name: 'endorser',
      type: 'relationship',
      relationTo: 'endorsers',
      required: true,
      admin: {
        description: 'The endorser this audience member follows',
      },
    },
    {
      name: 'employmentStatus',
      type: 'select',
      required: true,
      options: Object.values(EmploymentStatus).map((value) => ({
        label: value.replace('_', ' '),
        value,
      })),
    },
    {
      name: 'incomeRange',
      type: 'select',
      required: true,
      options: [
        { label: '$0-$50,000', value: IncomeRange.ZERO },
        { label: '$50,001-$100,000', value: IncomeRange.ONE },
        { label: '$100,001-$200,000', value: IncomeRange.TWO },
        { label: '$200,001-$500,000', value: IncomeRange.THREE },
        { label: '$500,001-$1,000,000', value: IncomeRange.FOUR },
        { label: '$1,000,001-$5,000,000', value: IncomeRange.FIVE },
        { label: '$5,000,001+', value: IncomeRange.SIX },
      ],
    },
    {
      name: 'investmentExperience',
      type: 'select',
      required: true,
      options: Object.values(InvestmentExperience).map((value) => ({
        label: value.replace('_', ' '),
        value,
      })),
    },
    {
      name: 'state',
      type: 'text',
      required: true,
      admin: {
        description: 'US State code (e.g., CA, NY)',
      },
    },
    {
      name: 'netWorth',
      type: 'select',
      required: true,
      options: [
        { label: '$0-$50,000', value: NetWorthRange.ZERO },
        { label: '$50,001-$100,000', value: NetWorthRange.ONE },
        { label: '$100,001-$200,000', value: NetWorthRange.TWO },
        { label: '$200,001-$500,000', value: NetWorthRange.THREE },
        { label: '$500,001-$1,000,000', value: NetWorthRange.FOUR },
        { label: '$1,000,001-$5,000,000', value: NetWorthRange.FIVE },
        { label: '$5,000,001+', value: NetWorthRange.SIX },
      ],
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: AudienceStatus.ACTIVE,
      options: Object.values(AudienceStatus).map((value) => ({
        label: value,
        value,
      })),
    },
    {
      name: 'lastActive',
      type: 'date',
      admin: {
        readOnly: true,
      },
    },
  ],
  timestamps: true,
  endpoints: [
    {
      path: '/by-user/:mainAppUserId',
      method: 'get',
      handler: async (req) => {
        const { mainAppUserId } = req.routeParams || { mainAppUserId: null }
        const payload = req.payload

        try {
          const audience = await payload.find({
            collection: 'audience',
            where: {
              mainAppUserId: {
                equals: mainAppUserId,
              },
            },
            depth: 1,
          })

          if (!audience.docs[0]) {
            return Response.json(
              {
                taken: false,
                username: null,
              },
              { status: 404 },
            )
          }

          const endorser = audience.docs[0]?.endorser as Endorser
          return Response.json({
            taken: true,
            username: endorser?.username || null,
          })
        } catch (error) {
          console.error(error)
          return Response.json({ error: 'Internal server error' }, { status: 500 })
        }
      },
    },
    {
      path: '/endorser/:endorserId/stats',
      method: 'get',
      handler: async (req) => {
        const { endorserId } = req.routeParams || { endorserId: null }
        const payload = req.payload

        try {
          const audience = await payload.find({
            collection: 'audience',
            where: {
              'endorser.id': {
                equals: endorserId,
              },
              status: {
                equals: AudienceStatus.ACTIVE,
              },
            },
            depth: 0,
          })

          const stats = calculateAudienceStats(audience.docs as unknown as AudienceMember[])

          return Response.json({
            total: audience.totalDocs,
            stats,
          })
        } catch (error) {
          console.error(error)
          return Response.json({ error: 'Internal server error' }, { status: 500 })
        }
      },
    },
    {
      path: '/update-preferences',
      method: 'post',
      handler: async (req) => {
        if (!req.json) {
          return Response.json({ error: 'Missing request body' }, { status: 400 })
        }

        const body = await req.json()
        const { mainAppUserId, endorserId, ...preferences } = body
        const payload = req.payload

        try {
          const existingAudience = await payload.find({
            collection: 'audience',
            where: {
              mainAppUserId: {
                equals: mainAppUserId,
              },
            },
          })

          let result

          if (existingAudience.docs[0]) {
            result = await payload.update({
              collection: 'audience',
              id: existingAudience.docs[0].id,
              data: {
                ...preferences,
                endorser: endorserId,
                lastActive: new Date().toISOString(),
              },
            })
          } else {
            result = await payload.create({
              collection: 'audience',
              data: {
                mainAppUserId,
                endorser: endorserId,
                ...preferences,
                lastActive: new Date().toISOString(),
              },
            })
          }

          return Response.json(result)
        } catch (error) {
          console.error(error)
          return Response.json({ error: 'Internal server error' }, { status: 500 })
        }
      },
    },
  ],
  hooks: {
    beforeChange: [
      async (args) => {
        const { data, operation, req } = args
        const payload = req.payload

        if (operation === 'create') {
          const existing = await payload.find({
            collection: 'audience',
            where: {
              mainAppUserId: {
                equals: data.mainAppUserId,
              },
            },
          })

          if (existing.docs.length > 0) {
            throw new Error('User already exists in audience')
          }
        }
        return data
      },
    ],
    afterChange: [
      async ({ doc, req }) => {
        const payload = req.payload

        if (doc.endorser?.id) {
          try {
            const stats = await payload.find({
              collection: 'audience',
              where: {
                'endorser.id': {
                  equals: doc.endorser.id,
                },
                status: {
                  equals: AudienceStatus.ACTIVE,
                },
              },
            })

            await payload.update({
              collection: 'endorsers',
              id: doc.endorser.id,
              data: {
                audienceStats: {
                  ...calculateAudienceStats(stats.docs as unknown as AudienceMember[]),
                  updated: new Date().toISOString(),
                },
              },
            })
          } catch (error) {
            console.error('Error updating endorser stats:', error)
          }
        }
      },
    ],
  },
}

const calculateAudienceStats = (members: AudienceMember[]): AudienceStats => {
  return {
    total: members.length,
    stats: {
      employment: calculateDistribution(members, 'employmentStatus'),
      income: calculateDistribution(members, 'incomeRange'),
      experience: calculateDistribution(members, 'investmentExperience'),
      location: calculateDistribution(members, 'state'),
      worth: calculateDistribution(members, 'netWorth'),
    },
    activity: {
      active: members.filter((m) => m.status === AudienceStatus.ACTIVE).length,
      inactive: members.filter((m) => m.status === AudienceStatus.INACTIVE).length,
      growth: calculateGrowthRate(members),
    },
    updated: new Date().toISOString(),
  }
}
const calculateDistribution = <T extends keyof AudienceMember>(
  members: AudienceMember[],
  field: T,
): Distribution<AudienceMember[T]>[] => {
  const distribution = members.reduce<Record<string, number>>((acc, member) => {
    const value = String(member[field])
    acc[value] = (acc[value] || 0) + 1
    return acc
  }, {})

  return Object.entries(distribution).map(([value, count]) => ({
    value: value as AudienceMember[T],
    count,
    pct: members.length > 0 ? (count / members.length) * 100 : 0,
    ...(field === 'employmentStatus' && { type: value }),
    ...(field === 'investmentExperience' && { level: value }),
    ...(field === 'state' && { state: value }),
    ...(['incomeRange', 'netWorth'].includes(field) && { range: value }),
  }))
}

const calculateGrowthRate = (members: AudienceMember[]): number => {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const newMembers = members.filter((member) => new Date(member.createdAt) > thirtyDaysAgo).length

  return members.length > 0 ? (newMembers / members.length) * 100 : 0
}

export default Audiences
import { v4 as uuidv4 } from 'uuid'
import type { CollectionConfig } from 'payload'
import getEmailTemplate from '@/components/shared/EmailTemplate'

interface AudienceMember {
  status: string
  employmentStatus: string
  incomeRange: string
  investmentExperience: string
  state: string
  netWorth: string
  createdAt: string
}

export const Endorsers: CollectionConfig = {
  slug: 'endorsers',
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    defaultColumns: [
      'name',
      'lastName',
      'username',
      'email',
      'phoneNumber',
      'profilePicture',
      'referralCode',
    ],
    useAsTitle: 'username',
  },
  auth: {
    verify: {
      generateEmailHTML: ({ token }) => {
        const url = `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/endorser/verifyemail?token=${token}`
        const email = getEmailTemplate(url)
        return email
      },
      generateEmailSubject: () => {
        return `Welcome Creator Partner!`
      },
    },
  },
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
      name: 'profilePicture',
      type: 'upload',
      relationTo: 'media',
      displayPreview: true,
      required: false,
      localized: true,
    },
    {
      name: 'username',
      type: 'text',
    },
    {
      name: 'referralCode',
      type: 'text',
      admin: {
        readOnly: true,
      },
      hooks: {
        beforeChange: [
          ({ value }) => {
            if (!value || value.length > 100) {
              return uuidv4()
            }
            return value
          },
        ],
      },
    },
    {
      name: 'audienceMembers',
      type: 'relationship',
      relationTo: 'audience',
      hasMany: true,
      admin: {
        description: 'List of all audience members following this endorser',
      },
    },
    {
      name: 'audienceStats',
      type: 'group',
      admin: {
        description: "Statistics about the endorser's audience",
        position: 'sidebar',
      },
      fields: [
        {
          name: 'total', // Shortened from totalMembers
          type: 'number',
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'stats', // Changed from demographics
          type: 'group',
          fields: [
            {
              name: 'employment', // Shortened from employmentDistribution
              type: 'array',
              admin: {
                readOnly: true,
              },
              fields: [
                {
                  name: 'type', // Changed from status
                  type: 'text',
                },
                {
                  name: 'count',
                  type: 'number',
                },
                {
                  name: 'pct', // Shortened from percentage
                  type: 'number',
                },
              ],
            },
            {
              name: 'income', // Shortened from incomeDistribution
              type: 'array',
              admin: {
                readOnly: true,
              },
              fields: [
                {
                  name: 'range',
                  type: 'text',
                },
                {
                  name: 'count',
                  type: 'number',
                },
                {
                  name: 'pct',
                  type: 'number',
                },
              ],
            },
            {
              name: 'experience', // Shortened from investmentExperienceDistribution
              type: 'array',
              admin: {
                readOnly: true,
              },
              fields: [
                {
                  name: 'level',
                  type: 'text',
                },
                {
                  name: 'count',
                  type: 'number',
                },
                {
                  name: 'pct',
                  type: 'number',
                },
              ],
            },
            {
              name: 'location', // Changed from stateDistribution
              type: 'array',
              admin: {
                readOnly: true,
              },
              fields: [
                {
                  name: 'state',
                  type: 'text',
                },
                {
                  name: 'count',
                  type: 'number',
                },
                {
                  name: 'pct',
                  type: 'number',
                },
              ],
            },
            {
              name: 'worth', // Shortened from netWorthDistribution
              type: 'array',
              admin: {
                readOnly: true,
              },
              fields: [
                {
                  name: 'range',
                  type: 'text',
                },
                {
                  name: 'count',
                  type: 'number',
                },
                {
                  name: 'pct',
                  type: 'number',
                },
              ],
            },
          ],
        },
        {
          name: 'activity', // Changed from activityMetrics
          type: 'group',
          fields: [
            {
              name: 'active', // Shortened from activeMembers
              type: 'number',
              admin: {
                readOnly: true,
              },
            },
            {
              name: 'inactive', // Shortened from inactiveMembers
              type: 'number',
              admin: {
                readOnly: true,
              },
            },
            {
              name: 'growth', // Shortened from growthRate
              type: 'number',
              admin: {
                readOnly: true,
              },
            },
          ],
        },
        {
          name: 'updated', // Shortened from lastUpdated
          type: 'date',
          admin: {
            readOnly: true,
          },
        },
      ],
    },
  ],
  endpoints: [
    {
      path: '/:username/audience',
      method: 'get',
      handler: async (req) => {
        const { username } = req.routeParams || { username: null }
        const payload = req.payload

        try {
          const endorser = await payload.find({
            collection: 'endorsers',
            where: {
              username: {
                equals: username,
              },
            },
          })

          if (!endorser.docs[0]) {
            return Response.json({ error: 'Endorser not found' }, { status: 404 })
          }

          const audience = await payload.find({
            collection: 'audience',
            where: {
              endorser: {
                equals: endorser.docs[0].id,
              },
            },
            depth: 0,
          })

          return Response.json({
            total: audience.totalDocs,
            members: audience.docs,
            stats: endorser.docs[0].audienceStats,
          })
        } catch (error) {
          console.error(error)
          return Response.json({ error: 'Internal server error' }, { status: 500 })
        }
      },
    },
    {
      path: '/:username/stats',
      method: 'get',
      handler: async (req) => {
        const { username } = req.routeParams || { username: null }
        const payload = req.payload

        try {
          const endorser = await payload.find({
            collection: 'endorsers',
            where: {
              username: {
                equals: username,
              },
            },
          })

          if (!endorser.docs[0]) {
            return Response.json({ error: 'Endorser not found' }, { status: 404 })
          }

          return Response.json(endorser.docs[0].audienceStats)
        } catch (error) {
          console.error(error)
          return Response.json({ error: 'Internal server error' }, { status: 500 })
        }
      },
    },
    {
      path: '/is-endorser-available/:username',
      method: 'get',
      handler: async (req) => {
        const { username } = req.routeParams || { username: null }
        const payload = req.payload

        try {
          const endorser = await payload.find({
            collection: 'endorsers',
            where: {
              username: {
                equals: username,
              },
            },
          })

          return Response.json({
            available: endorser.docs[0] !== undefined,
            id: endorser.docs[0]?.id,
          })
        } catch (error) {
          console.error(error)
          return Response.json({ available: false, id: -1 }, { status: 400 })
        }
      },
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, req }) => {
        const payload = req.payload

        // Update audience stats when an endorser changes
        try {
          const audience = await payload.find({
            collection: 'audience',
            where: {
              endorser: {
                equals: doc.id,
              },
            },
          })

          const stats = calculateAudienceStats(
            audience.docs.map((member) => ({
              ...member,
              status: member.status || '',
              employmentStatus: member.employmentStatus || '',
              incomeRange: member.incomeRange || '',
              investmentExperience: member.investmentExperience || '',
              state: member.state || '',
              netWorth: member.netWorth || '',
              createdAt: member.createdAt || '',
            })),
          )

          await payload.update({
            collection: 'endorsers',
            id: doc.id,
            data: {
              audienceStats: {
                ...stats,
                updated: new Date().toISOString(),
              },
            },
          })
        } catch (error) {
          console.error('Error updating audience stats:', error)
        }
      },
    ],
  },
}

const calculateAudienceStats = (audienceMembers: AudienceMember[]) => {
  const activeMembers: AudienceMember[] = audienceMembers.filter(
    (member) => member.status === 'ACTIVE',
  )
  const distributions: {
    employment: Record<string, number>
    income: Record<string, number>
    investmentExperience: Record<string, number>
    state: Record<string, number>
    netWorth: Record<string, number>
  } = {
    employment: {},
    income: {},
    investmentExperience: {},
    state: {},
    netWorth: {},
  }

  audienceMembers.forEach((member) => {
    distributions.employment[member.employmentStatus] =
      (distributions.employment[member.employmentStatus] || 0) + 1
    distributions.income[member.incomeRange] = (distributions.income[member.incomeRange] || 0) + 1
    distributions.investmentExperience[member.investmentExperience] =
      (distributions.investmentExperience[member.investmentExperience] || 0) + 1
    distributions.state[member.state] = (distributions.state[member.state] || 0) + 1
    distributions.netWorth[member.netWorth] = (distributions.netWorth[member.netWorth] || 0) + 1
  })

  return {
    totalMembers: audienceMembers.length,
    demographics: {
      employmentDistribution: formatDistribution(distributions.employment),
      incomeDistribution: formatDistribution(distributions.income),
      investmentExperienceDistribution: formatDistribution(distributions.investmentExperience),
      geographicDistribution: formatDistribution(distributions.state),
      netWorthDistribution: formatDistribution(distributions.netWorth),
    },
    activityMetrics: {
      activeMembers: activeMembers.length,
      inactiveMembers: audienceMembers.length - activeMembers.length,
      growthRate: calculateGrowthRate(audienceMembers),
    },
  }
}

const formatDistribution = (distribution: Record<string, number>) => {
  const total = Object.values(distribution).reduce((sum, count) => sum + count, 0)
  return Object.entries(distribution).map(([value, count]) => ({
    value,
    count,
    percentage: (count / total) * 100,
  }))
}

const calculateGrowthRate = (members: AudienceMember[]) => {
  // Calculate growth rate based on new members in the last 30 days
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const newMembers = members.filter((member) => new Date(member.createdAt) > thirtyDaysAgo).length

  return (newMembers / members.length) * 100
}

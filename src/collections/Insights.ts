import {
  BoldFeature,
  ItalicFeature,
  UnderlineFeature,
  StrikethroughFeature,
  SubscriptFeature,
  SuperscriptFeature,
  HeadingFeature,
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { CollectionConfig } from 'payload'

export const Insights: CollectionConfig = {
  slug: 'insights',
  access: {
    create: () => true,
    read: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    useAsTitle: 'title',
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      minLength: 5,
      maxLength: 40,
    },
    {
      name: 'description',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures.filter(
            (feature) =>
              feature.key !== 'upload' &&
              feature.key !== 'relationship' &&
              feature.key !== 'horizontalRule' &&
              feature.key !== 'inlineCode' &&
              feature.key !== 'link' &&
              feature.key !== 'strikeThrough',
          ),
          HeadingFeature({
            enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'],
          }),
          BoldFeature(),
          ItalicFeature(),
          UnderlineFeature(),
          StrikethroughFeature(),
          SubscriptFeature(),
          SuperscriptFeature(),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
      required: false,
      localized: true,
    },
    {
      name: 'contents',
      type: 'relationship',
      relationTo: 'contents',
      hasMany: false,
      admin: {
        description: 'Media stored in R2',
      },
    },
    {
      name: 'insight_location',
      type: 'select',
      required: true,
      defaultValue: 'Welcome Video',
      localized: true,
      options: [
        { label: 'Welcome Video', value: 'Welcome Video' },
        {
          label: 'Account Onboarding - Account Onboarding Start',
          value: 'Account Onboarding Account Onboarding Start',
        },
        { label: 'Account Onboarding - Address', value: 'Account Onboarding Address' },
        {
          label: 'Account Onboarding - Annual Income',
          value: 'Account Onboarding Annual Income',
        },
        {
          label: 'Account Onboarding - Brokerage Accounts',
          value: 'Account Onboarding Brokerage Accounts',
        },
        {
          label: 'Account Onboarding - Choose Account Type',
          value: 'Account Onboarding Choose Account Type',
        },
        {
          label: 'Account Onboarding - Citizenship Status',
          value: 'Account Onboarding Citizenship Status',
        },
        { label: 'Account Onboarding - Disclosures', value: 'Account Onboarding Disclosures' },
        {
          label: 'Account Onboarding - Employment Status',
          value: 'Account Onboarding Employment Status',
        },
        {
          label: 'Account Onboarding - Investment Experience',
          value: 'Account Onboarding Investment Experience',
        },
        {
          label: 'Account Onboarding - Investment Goal',
          value: 'Account Onboarding Investment Goal',
        },
        {
          label: 'Account Onboarding - Liquid Net Worth',
          value: 'Account Onboarding Liquid Net Worth',
        },
        {
          label: 'Account Onboarding - Retirement Accounts',
          value: 'Account Onboarding Retirement Accounts',
        },
        {
          label: 'Account Onboarding - Risk Tolerance',
          value: 'Account Onboarding Risk Tolerance',
        },
        {
          label: 'Account Onboarding - Tax Filing Status',
          value: 'Account Onboarding Tax Filing Status',
        },
        { label: 'Account Onboarding - Time Horizon', value: 'Account Onboarding Time Horizon' },
        {
          label: 'Account Onboarding - Total Net Worth',
          value: 'Account Onboarding Total Net Worth',
        },
        {
          label: 'Account Onboarding - Trusted Contact',
          value: 'Account Onboarding Trusted Contact',
        },
        {
          label: 'Account Onboarding - Verify Identity',
          value: 'Account Onboarding Verify Identity',
        },
        { label: 'Explore - Growth Sidepockets', value: 'Explore Growth Sidepockets' },
        { label: 'Explore - Income Sidepockets', value: 'Explore Income Sidepockets' },
        { label: 'Explore - Model Sidepocket', value: 'Explore Model Sidepocket' },
        {
          label: 'Explore - Preservation Sidepockets',
          value: 'Explore Preservation Sidepockets',
        },
        { label: 'Explore - Speculative Sidepockets', value: 'Explore Speculative Sidepockets' },
        {
          label: 'Explore - Which Sidepocket is right for me?',
          value: 'Explore Which Sidepocket is right for me?',
        },
        { label: 'Funding - Funding Schedule', value: 'Funding Funding Schedule' },
        { label: 'Funding - One-time Transaction', value: 'Funding One-time Transaction' },
        { label: 'Menu - Account Value', value: 'Menu Account Value' },
        { label: 'Menu - Available for Withdrawal', value: 'Menu Available for Withdrawal' },
        { label: 'Menu - Buying Power', value: 'Menu Buying Power' },
        { label: 'Menu - Explore', value: 'Menu Explore' },
        { label: 'Menu - Funding', value: 'Menu Funding' },
        { label: 'Menu - My Sidepockets', value: 'Menu My Sidepockets' },
        { label: 'Menu - Sidepocket Premier', value: 'Menu Sidepocket Premier' },
        { label: 'Menu - Sidepocket Value', value: 'Menu Sidepocket Value' },
        { label: 'My Sidepocket - Add Account', value: 'My Sidepocket Add Account' },
        { label: 'My Sidepocket - Dow Jones ETF', value: 'My Sidepocket Dow Jones ETF' },
        {
          label: 'My Sidepocket - Live Sidepocket List',
          value: 'My Sidepocket Live Sidepocket List',
        },
        {
          label: 'My Sidepocket - Live User Sidepocket',
          value: 'My Sidepocket Live User Sidepocket',
        },
        { label: 'My Sidepocket - S&P 500 ETF', value: 'My Sidepocket S&P 500 ETF' },
        { label: 'My Sidepocket - Transactions', value: 'My Sidepocket Transactions' },
        { label: 'My Sidepocket - QQQ ETF', value: 'My Sidepocket QQQ ETF' },
        { label: 'Onboarding - 30 Day Access Screen', value: 'Onboarding 30 Day Access Screen' },
        { label: 'Onboarding - Sign Up Screen', value: 'Onboarding Sign Up Screen' },
        { label: 'Onboarding Splash Screen', value: 'Onboarding Splash Screen' },
        {
          label: 'Subscription Selection - All Access Subscription',
          value: 'Subscription Selection All Access Subscription',
        },
        {
          label: 'Subscription Selection - Lite Subscription',
          value: 'Subscription Selection Lite Subscription',
        },
      ],
    },

    {
      name: 'review_status',
      type: 'select',
      required: true,
      defaultValue: 'todo',
      localized: true,
      options: [
        { label: 'To Do', value: 'todo' },
        { label: 'Sent to Review', value: 'sent_to_review' },
        { label: 'In Progress', value: 'in_progress' },
        { label: 'Rejected', value: 'rejected' },
        { label: 'Approved', value: 'approved' },
        { label: 'Changes Requested', value: 'changes_requested' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'review_assignee',
      type: 'relationship',
      relationTo: 'users',
      hasMany: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'state',
      type: 'select',
      required: true,
      defaultValue: 'Draft',
      localized: true,
      options: [
        { label: 'Draft', value: 'Draft' },
        { label: 'Ready for Review', value: 'Ready for Review' },
        { label: 'Approved', value: 'Approved' },
        { label: 'Rejected', value: 'Rejected' },
        { label: 'Published', value: 'Published' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'review_commentary',
      type: 'textarea',
      localized: true,
      admin: {
        readOnly: false,
        position: 'sidebar',
      },
    },
    {
      name: 'metadata',
      type: 'json',
      required: true,
      defaultValue: {
        onLogIn: true,
        default: false,
      },
      localized: true,
      admin: {
        hidden: true,
      },
    },
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'endorsers',
      admin: {
        readOnly: false,
        hidden: false,
      },
    },
  ],
  endpoints: [
    {
      path: '/:username/get',
      method: 'get',
      handler: async (req) => {
        const { username } = req.routeParams || { username: null }
        const payload = req.payload

        try {
          const user = await payload.find({
            collection: 'endorsers',
            where: { username: { equals: username } },
            depth: 0,
          })

          if (!user.docs[0]) return Response.json([])

          const insights = await payload.find({
            collection: 'insights',
            where: { 'createdBy.id': { equals: user.docs[0].id } },
            limit: 100,
            depth: 2,
          })

          return Response.json(insights)
        } catch (error) {
          console.error(error)
          return Response.json({ error: 'Internal server error' }, { status: 500 })
        }
      },
    },
    {
      path: '/me',
      method: 'get',
      handler: async (req) => {
        try {
          const { user } = req
          if (!user) return Response.json([], { status: 401 })

          const insights = await req.payload.find({
            collection: 'insights',
            where: { 'createdBy.id': { equals: user.id } },
            depth: 2,
          })

          return Response.json(insights)
        } catch (error) {
          console.error(error)
          return Response.json({ error: 'Internal server error' }, { status: 500 })
        }
      },
    },
  ],
  timestamps: true,
}

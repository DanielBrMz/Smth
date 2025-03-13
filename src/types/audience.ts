import { BasePayload, PayloadRequest } from 'payload'

export enum EmploymentStatus {
  EMPLOYED = 'EMPLOYED',
  SELF_EMPLOYED = 'SELF_EMPLOYED',
  RETIRED = 'RETIRED',
  STUDENT = 'STUDENT',
  OTHER = 'OTHER',
}

export enum IncomeRange {
  ZERO = 'ZERO',
  ONE = 'ONE',
  TWO = 'TWO',
  THREE = 'THREE',
  FOUR = 'FOUR',
  FIVE = 'FIVE',
  SIX = 'SIX',
}

export enum InvestmentExperience {
  NONE = 'NONE',
  LIMITED = 'LIMITED',
  GOOD = 'GOOD',
  EXTENSIVE = 'EXTENSIVE',
}

export enum NetWorthRange {
  ZERO = 'ZERO',
  ONE = 'ONE',
  TWO = 'TWO',
  THREE = 'THREE',
  FOUR = 'FOUR',
  FIVE = 'FIVE',
  SIX = 'SIX',
}

export enum AudienceStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export interface Endorser {
  id: string // Changed from number to string as PayloadCMS uses string IDs
  name: string
  username: string
  email: string
  referralCode: string
  audienceStats?: AudienceStats
}

export interface AudienceMember {
  id: string // Changed from number to string
  mainAppUserId: string
  endorser: {
    id: string
    relationTo: 'endorsers'
  }
  employmentStatus: EmploymentStatus
  incomeRange: IncomeRange
  investmentExperience: InvestmentExperience
  state: string
  netWorth: NetWorthRange
  status: AudienceStatus
  lastActive: string
  createdAt: string
  updatedAt: string
}

export interface Distribution<T> {
  type?: string // Added for employment
  level?: string // Added for experience
  range?: string // Added for income and netWorth
  state?: string // Added for location
  value: T
  count: number
  pct: number // Changed from percentage to match Endorser schema
}

export interface AudienceStats {
  total: number
  stats: {
    employment: Distribution<EmploymentStatus>[]
    income: Distribution<IncomeRange>[]
    experience: Distribution<InvestmentExperience>[]
    location: Distribution<string>[]
    worth: Distribution<NetWorthRange>[]
  }
  activity: {
    active: number
    inactive: number
    growth: number
  }
  updated: string
}

export interface UpdatePreferencesBody {
  mainAppUserId: string
  endorserId: string
  employmentStatus: EmploymentStatus
  incomeRange: IncomeRange
  investmentExperience: InvestmentExperience
  state: string
  netWorth: NetWorthRange
}

export interface AudienceEndpointRequest extends PayloadRequest {
  routeParams?: {
    mainAppUserId?: string
    endorserId?: string
    username?: string // Added for endorser endpoints
  }
  payload: BasePayload & {
    find: <T>(args: {
      collection: string
      where: Record<string, unknown>
      depth?: number
    }) => Promise<{
      docs: T[]
      totalDocs: number
      [key: string]: unknown
    }>
    create: <T>(args: { collection: string; data: Partial<T> }) => Promise<T>
    update: <T>(args: { collection: string; id: string; data: Partial<T> }) => Promise<T>
  }
  body?: ReadableStream<Uint8Array> | null // Changed to match PayloadRequest interface
}

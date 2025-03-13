import React from 'react'
import { Users, Activity, TrendingUp, UserCheck } from 'lucide-react'
import { AudienceStats } from '@/types/audience'

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  subtitle?: string
  color: string
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, subtitle, color }) => {
  return (
    <div className="bg-[#232652] rounded-xl p-6 flex items-start">
      <div className={`rounded-full p-3 mr-4 ${color}`}>{icon}</div>
      <div>
        <h3 className="text-[#809fb8] text-sm mb-1">{title}</h3>
        <div className="text-white text-2xl font-bold">{value}</div>
        {subtitle && <p className="text-[#809fb8] text-xs mt-1">{subtitle}</p>}
      </div>
    </div>
  )
}

interface AudienceOverviewProps {
  stats: AudienceStats
}

const AudienceOverview: React.FC<AudienceOverviewProps> = ({ stats }) => {
  // Format the date to be more readable
  const formattedDate = stats.updated
    ? new Date(stats.updated).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'N/A'

  // Calculate percentage of active users
  const activePercentage =
    stats.total > 0 ? Math.round((stats.activity.active / stats.total) * 100) : 0

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-white text-lg font-semibold">Overview</h2>
        <p className="text-[#809fb8] text-sm">Last updated: {formattedDate}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Audience"
          value={stats.total.toLocaleString()}
          icon={<Users className="h-6 w-6 text-white" />}
          color="bg-[#7849DE]/20"
        />

        <StatCard
          title="Active Members"
          value={`${stats.activity.active.toLocaleString()} (${activePercentage}%)`}
          icon={<UserCheck className="h-6 w-6 text-white" />}
          color="bg-[#22C55E]/20"
        />

        <StatCard
          title="Growth Rate"
          value={`${stats.activity.growth.toFixed(1)}%`}
          subtitle="Last 30 days"
          icon={<TrendingUp className="h-6 w-6 text-white" />}
          color="bg-[#3B82F6]/20"
        />

        <StatCard
          title="Engagement Level"
          value={
            stats.activity.inactive > 0
              ? (stats.activity.active / stats.activity.inactive).toFixed(2)
              : 'N/A'
          }
          subtitle="Active/Inactive Ratio"
          icon={<Activity className="h-6 w-6 text-white" />}
          color="bg-[#F59E0B]/20"
        />
      </div>
    </div>
  )
}

export default AudienceOverview

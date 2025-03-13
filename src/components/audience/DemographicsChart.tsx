import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

// Define the format of demographic data
interface DemographicItem {
  type?: string
  level?: string
  range?: string
  state?: string
  value: string
  count: number
  pct: number
}

interface DemographicsChartProps {
  title: string
  data: DemographicItem[]
  valueKey: 'type' | 'level' | 'range' | 'state'
}

// Custom colors that match the application's theme
const COLORS = [
  '#7849DE',
  '#5a37a6',
  '#3B82F6',
  '#22C55E',
  '#F59E0B',
  '#EF4444',
  '#8B5CF6',
  '#EC4899',
]

const DemographicsChart: React.FC<DemographicsChartProps> = ({ title, data, valueKey }) => {
  // Ensure data exists and has items
  if (!data || data.length === 0) {
    return (
      <div className="bg-[#232652] rounded-xl p-6 h-80 flex flex-col justify-center items-center">
        <h3 className="text-white text-lg font-semibold mb-4">{title}</h3>
        <p className="text-[#809fb8] text-center">No data available</p>
      </div>
    )
  }

  // Sort data by count in descending order
  const sortedData = [...data].sort((a, b) => b.count - a.count)

  // Format labels for better readability
  const formatLabel = (item: DemographicItem) => {
    const label = item[valueKey] as string

    // Handle special formatting for different types of data
    if (valueKey === 'range') {
      // For income and net worth ranges
      if (label === 'ZERO') return '$0-$50k'
      if (label === 'ONE') return '$50k-$100k'
      if (label === 'TWO') return '$100k-$200k'
      if (label === 'THREE') return '$200k-$500k'
      if (label === 'FOUR') return '$500k-$1M'
      if (label === 'FIVE') return '$1M-$5M'
      if (label === 'SIX') return '$5M+'
    }

    if (valueKey === 'level') {
      // For investment experience
      if (label === 'NONE') return 'None'
      if (label === 'LIMITED') return 'Limited'
      if (label === 'GOOD') return 'Good'
      if (label === 'EXTENSIVE') return 'Extensive'
    }

    if (valueKey === 'type') {
      // For employment status
      if (label === 'EMPLOYED') return 'Employed'
      if (label === 'SELF_EMPLOYED') return 'Self-Employed'
      if (label === 'RETIRED') return 'Retired'
      if (label === 'STUDENT') return 'Student'
      if (label === 'OTHER') return 'Other'
    }

    return label ? label.replace(/_/g, ' ') : 'Unknown'
  }

  // Format the chart data
  const chartData = sortedData.map((item) => ({
    name: formatLabel(item),
    value: item.count,
    percentage: item.pct.toFixed(1),
  }))

  // Custom tooltip component
  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean
    payload?: { name: string; value: number; payload: { percentage: string } }[]
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#11142f] border border-[#384455] p-3 rounded-md shadow-lg">
          <p className="text-white font-medium">{payload[0].name}</p>
          <p className="text-[#809fb8]">
            Count: <span className="text-white">{payload[0].value}</span>
          </p>
          <p className="text-[#809fb8]">
            Percentage: <span className="text-white">{payload[0].payload.percentage}%</span>
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-[#232652] rounded-xl p-6 h-80">
      <h3 className="text-white text-lg font-semibold mb-4">{title}</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  stroke="rgba(0, 0, 0, 0.1)"
                  strokeWidth={1}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              layout="vertical"
              verticalAlign="middle"
              align="right"
              formatter={(value) => <span className="text-white text-xs">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default DemographicsChart

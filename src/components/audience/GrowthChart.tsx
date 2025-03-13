import React, { useMemo } from 'react'
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface GrowthChartProps {
  growthRate: number
}

const GrowthChart: React.FC<GrowthChartProps> = ({ growthRate }) => {
  // Generate projected growth data for next 6 months
  const projectionData = useMemo(() => {
    const currentDate = new Date()
    const data = []
    const baseValue = 100 // Starting point (100%)

    // For the current month, use 100% as the baseline
    data.push({
      month: currentDate.toLocaleString('default', { month: 'short' }),
      value: baseValue,
      projected: false,
    })

    // Generate 6 months of projected data
    for (let i = 1; i <= 6; i++) {
      const futureDate = new Date(currentDate)
      futureDate.setMonth(currentDate.getMonth() + i)

      // Calculate projected value based on growth rate
      // (compounding monthly)
      const projectedValue = baseValue * Math.pow(1 + growthRate / 100, i)

      data.push({
        month: futureDate.toLocaleString('default', { month: 'short' }),
        value: Math.round(projectedValue * 100) / 100,
        projected: true,
      })
    }

    return data
  }, [growthRate])

  // If growth rate is invalid, display a message
  if (isNaN(growthRate) || growthRate === 0) {
    return (
      <div className="bg-[#232652] rounded-xl p-6 min-h-[300px] flex flex-col justify-center items-center">
        <h3 className="text-white text-lg font-semibold mb-4">Growth Projection</h3>
        <p className="text-[#809fb8] text-center">Insufficient data for growth projection</p>
      </div>
    )
  }

  // Custom tooltip component
  interface CustomTooltipProps {
    active?: boolean
    payload?: { value: number; payload: { projected: boolean; value: number } }[]
    label?: string
  }

  const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const isProjected = payload[0].payload.projected
      return (
        <div className="bg-[#11142f] border border-[#384455] p-3 rounded-md shadow-lg">
          <p className="text-white font-medium">{label}</p>
          <p className="text-[#809fb8]">
            Audience Size: <span className="text-white">{payload[0].value.toFixed(1)}%</span>
            {isProjected && <span className="text-[#22C55E] ml-2">(Projected)</span>}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-[#232652] rounded-xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white text-lg font-semibold">Growth Projection</h3>
        <div className="flex items-center bg-[#11142f] px-3 py-1 rounded-lg">
          {growthRate > 0 ? (
            <>
              <TrendingUp className="text-[#22C55E] h-5 w-5 mr-2" />
              <span className="text-[#22C55E] font-medium">{growthRate.toFixed(1)}% growth</span>
            </>
          ) : (
            <>
              <TrendingDown className="text-[#EF4444] h-5 w-5 mr-2" />
              <span className="text-[#EF4444] font-medium">
                {Math.abs(growthRate).toFixed(1)}% decline
              </span>
            </>
          )}
        </div>
      </div>

      <p className="text-[#809fb8] mb-4">
        Projected audience growth over the next 6 months based on current growth rate
      </p>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={projectionData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7849DE" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#7849DE" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#384455" />
            <XAxis dataKey="month" stroke="#809fb8" tick={{ fill: '#809fb8' }} />
            <YAxis
              stroke="#809fb8"
              tick={{ fill: '#809fb8' }}
              domain={[
                Math.max(0, Math.floor(projectionData[0].value * 0.8)),
                Math.ceil(projectionData[projectionData.length - 1].value * 1.1),
              ]}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#7849DE"
              fillOpacity={1}
              fill="url(#colorValue)"
              strokeWidth={2}
              activeDot={{ r: 6, fill: '#7849DE', stroke: '#FFFFFF' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-between mt-4">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-[#7849DE] rounded-full mr-2"></div>
          <span className="text-[#809fb8] text-sm">Actual Size</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-[#7849DE] opacity-50 rounded-full mr-2"></div>
          <span className="text-[#809fb8] text-sm">Projected Growth</span>
        </div>
      </div>
    </div>
  )
}

export default GrowthChart

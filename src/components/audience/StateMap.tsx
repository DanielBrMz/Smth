import React, { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface LocationData {
  state: string
  count: number
  pct: number
}

interface StateMapProps {
  locationData: LocationData[]
}

const StateMap: React.FC<StateMapProps> = ({ locationData }) => {
  // Process data for visualization
  const chartData = useMemo(() => {
    if (!locationData || locationData.length === 0) {
      return []
    }

    // Sort by count in descending order and take top 10
    return [...locationData]
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
      .map((item) => ({
        state: item.state,
        count: item.count,
        percentage: item.pct.toFixed(1),
      }))
  }, [locationData])

  // If no data, display a message
  if (!locationData || locationData.length === 0) {
    return (
      <div className="bg-[#232652] rounded-xl p-6 min-h-[400px] flex flex-col justify-center items-center">
        <h3 className="text-white text-lg font-semibold mb-4">Geographic Distribution</h3>
        <p className="text-[#809fb8] text-center">No location data available</p>
      </div>
    )
  }

  // Custom tooltip component
  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean
    payload?: { payload: { state: string; count: number; percentage: string } }[]
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#11142f] border border-[#384455] p-3 rounded-md shadow-lg">
          <p className="text-white font-medium">{payload[0].payload.state}</p>
          <p className="text-[#809fb8]">
            Count: <span className="text-white">{payload[0].payload.count}</span>
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
    <div className="bg-[#232652] rounded-xl p-6">
      <h3 className="text-white text-lg font-semibold mb-4">Geographic Distribution</h3>
      <p className="text-[#809fb8] mb-4">Top 10 states by audience count</p>

      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 60, bottom: 5 }}
          >
            <XAxis type="number" stroke="#809fb8" />
            <YAxis
              dataKey="state"
              type="category"
              stroke="#809fb8"
              tickLine={false}
              axisLine={false}
              width={50}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" radius={[0, 4, 4, 0]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index === 0 ? '#7849DE' : `rgba(120, 73, 222, ${1 - index * 0.08})`}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default StateMap

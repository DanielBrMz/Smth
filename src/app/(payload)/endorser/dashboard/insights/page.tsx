'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { FileText } from 'lucide-react'

interface Insight {
  id: string
  title: string
  insight_location: string
  contents?: {
    mimeType?: string
  }
  state: string
  updatedAt: string
}

const InsightsPage: React.FC = () => {
  const router = useRouter()
  const [insights, setInsights] = useState<Insight[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const labels = ['Insight Name', 'Insight Location', 'Content Type', 'Status', 'Last Edited']
  const fields: (keyof Insight)[] = ['title', 'insight_location', 'contents', 'state', 'updatedAt']

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const userMe = await fetch('/api/endorsers/me', {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!userMe.ok) {
          throw new Error('Failed to fetch user')
        }

        const response = await fetch(`/api/insights/me`, {
          credentials: 'include', // Added credentials here too for consistency
        })

        if (!response.ok) {
          throw new Error('Failed to fetch insights')
        }

        const data = await response.json()
        setInsights(data.docs || []) // Ensure we always set an array
        setIsLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred')
        setIsLoading(false)
      }
    }

    fetchInsights()
  }, [])

  const getFieldValue = (item: Insight, field: keyof Insight): string => {
    if (field === 'contents') {
      const fieldValue = item.contents?.mimeType
        ? item.contents.mimeType.split('/')[0].charAt(0).toUpperCase() +
          item.contents.mimeType.split('/')[0].slice(1)
        : 'N/A'
      return fieldValue
    }

    if (field === 'updatedAt') {
      return new Date(item[field] as string).toLocaleDateString()
    }

    return (item[field] as string) || 'N/A'
  }

  if (isLoading) {
    return (
      <div className="flex p-0 w-full bg-[#11142f] rounded-[0.625rem] px-6 pt-7 pb-9 min-h-[400px] justify-center items-center">
        <div className="text-white text-center">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex p-0 w-full bg-[#11142f] rounded-[0.625rem] px-6 pt-7 pb-9 min-h-[400px] justify-center items-center">
        <div className="text-red-500 text-center">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="flex p-0 w-full bg-[#11142f] rounded-[0.625rem] px-6 pt-7 pb-9 flex-col">
      <div className="flex justify-between items-center">
        <span className="mx-6 overflow-auto text-[1.3rem] font-bold text-white">Insights</span>
        <Button
          onClick={() => router.push('insights/new')}
          className="max-w-[18rem] text-white bg-[#7849DE] hover:bg-[#5a37a6]"
        >
          CREATE NEW INSIGHT
        </Button>
      </div>

      {insights.length === 0 ? (
        <div className="flex flex-col items-center justify-center space-y-4 min-h-[300px] mt-9">
          <FileText className="w-16 h-16 text-gray-400" />
          <p className="text-gray-400 text-lg">No insights found</p>
          <p className="text-gray-500 text-base">Create your first insight to get started</p>
          <Button
            onClick={() => router.push('insights/new')}
            className="mt-4 bg-[#7849DE] hover:bg-[#5a37a6]"
          >
            Create New Insight
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-2 min-h-full mt-9">
          {/* Labels */}
          <div className="flex justify-between w-full px-4">
            {labels.map((label, index) => (
              <div
                key={index}
                className="flex-1 text-center text-base text-[#809fb8] font-semibold"
              >
                {label}
              </div>
            ))}
          </div>

          {/* Item list */}
          {insights.map((item) => (
            <Link
              className="bg-[#ffffff0d] rounded-lg p-4 w-full py-5 focus:pointer-events-auto hover:bg-[#ffffff4d] no-underline transition-colors duration-200"
              key={item.id}
              href={`insights/${item.id}`}
            >
              <div className="flex justify-between">
                {fields.map((key, index) => (
                  <div key={index} className="flex-1 text-center text-white text-xl font-semibold">
                    {getFieldValue(item, key)}
                  </div>
                ))}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default InsightsPage

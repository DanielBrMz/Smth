'use client'
import React, { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import LoadingScreen from '@/components/shared/LoadingScreen'
import AudienceOverview from '@/components/audience/AudienceOverview'
import DemographicsChart from '@/components/audience/DemographicsChart'
import StateMap from '@/components/audience/StateMap'
import GrowthChart from '@/components/audience/GrowthChart'
import { AudienceStats } from '@/types/audience'
import { Button } from '@/components/ui/button'
import { ExternalLink } from 'lucide-react'

export default function AudiencePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [audienceStats, setAudienceStats] = useState<AudienceStats | null>(null)
  const [endorserId, setEndorserId] = useState<string | null>(null)
  const [branchUrl, setBranchUrl] = useState<string>('')
  const [, setUsername] = useState<string>('')

  useEffect(() => {
    const fetchUserAndStats = async () => {
      try {
        // Step 1: Get the current logged-in endorser
        const userResponse = await fetch('/api/endorsers/me', {
          credentials: 'include',
        })

        if (!userResponse.ok) {
          throw new Error('Failed to fetch user data')
        }

        const userData = await userResponse.json()
        const currentEndorserId = userData.user.id
        const endorserUsername = userData.user.username || currentEndorserId

        setEndorserId(currentEndorserId)
        setUsername(endorserUsername)
        setBranchUrl(`https://sidepocket.app/endorser/${endorserUsername}`)

        // Step 2: Fetch audience stats for this endorser
        const statsResponse = await fetch(`/api/audience/endorser/${currentEndorserId}/stats`, {
          credentials: 'include',
        })

        if (!statsResponse.ok) {
          throw new Error('Failed to fetch audience statistics')
        }

        const statsData = await statsResponse.json()
        setAudienceStats(statsData.stats)
      } catch (error) {
        console.error('Error fetching audience data:', error)
        setError(error instanceof Error ? error.message : 'An unknown error occurred')
        toast.error('Failed to load audience data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserAndStats()
  }, [])

  // Handle sharing branch URL
  const handleShareBranch = async () => {
    const shareUrl = `${branchUrl}/signup`
    try {
      await navigator.clipboard.writeText(shareUrl)
      toast.success('Branch URL copied to clipboard!')
    } catch (err) {
      console.error('Failed to copy:', err)
      toast.error('Failed to copy URL')
    }
  }

  if (isLoading) {
    return <LoadingScreen />
  }

  // Display empty state with call to action
  if (!audienceStats || !endorserId || audienceStats.total === 0) {
    return (
      <div className="flex flex-col p-0 w-full bg-[#11142f] rounded-[0.625rem] px-6 pt-7 pb-9 min-h-[500px] justify-center items-center">
        <div className="max-w-lg text-center">
          <h2 className="text-white text-2xl font-bold mb-4">No audience data available yet</h2>
          <p className="text-[#809fb8] mb-6">
            Start growing your audience by sharing your branch with potential followers. As people
            join your branch, you&apos;ll see detailed analytics here.
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <div className="flex rounded-xl bg-[#232652] items-center p-3 gap-4">
              <div className="flex rounded-xl bg-gray-800 py-2 px-4">
                <span className="text-white break-all text-sm">{branchUrl}/signup</span>
              </div>
              <Button
                onClick={handleShareBranch}
                className="bg-[#7849DE] hover:bg-[#5a37a6] text-white"
              >
                Copy Link
              </Button>
            </div>

            <Button
              className="bg-[#232652] hover:bg-[#2c2f5e] text-white"
              onClick={() => window.open(branchUrl, '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Visit Your Branch
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex p-0 w-full bg-[#11142f] rounded-[0.625rem] px-6 pt-7 pb-9 min-h-[400px] justify-center items-center">
        <div className="text-red-500 text-center">
          <h3 className="text-xl font-bold mb-2">Error Loading Data</h3>
          <p>{error}</p>
          <Button
            className="mt-4 bg-[#7849DE] hover:bg-[#5a37a6] text-white"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col p-0 w-full bg-[#11142f] rounded-[0.625rem] px-6 pt-7 pb-9">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-[1.3rem] font-bold text-white">Audience Analytics</h1>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex rounded-xl bg-[#232652] items-center p-2 gap-3">
            <div className="flex rounded-xl bg-gray-800 py-1 px-3">
              <span className="text-white text-sm">{branchUrl}/signup</span>
            </div>
            <Button
              onClick={handleShareBranch}
              className="bg-[#7849DE] hover:bg-[#5a37a6] text-white text-sm whitespace-nowrap"
              size="sm"
            >
              Copy Link
            </Button>
          </div>

          <Button
            className="bg-[#232652] hover:bg-[#2c2f5e] text-white"
            size="sm"
            onClick={() => window.open(branchUrl, '_blank')}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Visit Branch
          </Button>
        </div>
      </div>

      {/* Overview Statistics */}
      <AudienceOverview stats={audienceStats} />

      {/* Demographics Section */}
      <div className="mt-8">
        <h2 className="text-white text-lg font-semibold mb-4">Audience Demographics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DemographicsChart
            title="Employment Status"
            data={audienceStats.stats.employment}
            valueKey="type"
          />
          <DemographicsChart
            title="Investment Experience"
            data={audienceStats.stats.experience}
            valueKey="level"
          />
          <DemographicsChart
            title="Income Range"
            data={audienceStats.stats.income}
            valueKey="range"
          />
          <DemographicsChart title="Net Worth" data={audienceStats.stats.worth} valueKey="range" />
        </div>
      </div>

      {/* Geographic Distribution */}
      <div className="mt-8">
        <StateMap
          locationData={audienceStats.stats.location.map((loc) => ({
            ...loc,
            state: loc.state || '',
          }))}
        />
      </div>

      {/* Growth Metrics */}
      <div className="mt-8">
        <GrowthChart growthRate={audienceStats.activity.growth} />
      </div>

      {/* Help section */}
      <div className="mt-12 bg-[#232652] rounded-xl p-6">
        <h2 className="text-white text-lg font-semibold mb-4">Growing Your Audience</h2>
        <p className="text-[#809fb8] mb-4">
          Building a strong audience base is essential for maximizing your impact as an endorser.
          Here are some tips to help you grow your audience:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#11142f] p-4 rounded-lg">
            <h3 className="text-white font-medium mb-2">Share Your Branch</h3>
            <p className="text-[#809fb8] text-sm">
              Regularly share your personalized branch link across your social media channels and
              with your network.
            </p>
          </div>

          <div className="bg-[#11142f] p-4 rounded-lg">
            <h3 className="text-white font-medium mb-2">Create Valuable Content</h3>
            <p className="text-[#809fb8] text-sm">
              Publish high-quality insights that provide unique value to your audience.
            </p>
          </div>

          <div className="bg-[#11142f] p-4 rounded-lg">
            <h3 className="text-white font-medium mb-2">Engage with Followers</h3>
            <p className="text-[#809fb8] text-sm">
              Respond to questions and comments to build a stronger connection with your audience.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

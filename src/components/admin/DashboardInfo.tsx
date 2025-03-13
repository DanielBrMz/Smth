import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { MessageCircle, ChevronRight, MoreHorizontal } from 'lucide-react'

const DashboardOnboard: React.FC = () => {
  return (
    <div className="h-fit bg-[#0A0B1E] text-white p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold">Endorser Platform</h1>
          <p className="text-slate-400">Manage and review content</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="border-[#6B4AE1] text-[#6B4AE1] hover:bg-[#6B4AE1]/20"
          >
            Support
          </Button>
          <Button className="bg-[#6B4AE1] hover:bg-[#6B4AE1]/80">Get Started</Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Quick Stats */}
        <Card className="bg-[#0E0F2C] border-[#1E1F3E] col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">Overview</CardTitle>
            <MoreHorizontal className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Pending Reviews</span>
                <span className="text-lg font-semibold text-[#22C55E]">24</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Completed Today</span>
                <span className="text-lg font-semibold text-[#22C55E]">12</span>
              </div>
              <Separator className="my-4 bg-[#1E1F3E]" />
              <Button variant="outline" className="w-full border-[#1E1F3E] hover:bg-[#1E1F3E]">
                View All Stats
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Center Column - Main Instructions */}
        <Card className="bg-[#0E0F2C] border-[#1E1F3E] col-span-2">
          <CardHeader>
            <CardTitle className="text-xl font-medium flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-[#6B4AE1]" />
              Review Process
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Review Steps */}
              <div className="space-y-4">
                <div className="bg-[#141633] rounded-lg p-4">
                  <h3 className="text-sm font-medium text-[#6B4AE1] mb-2">Step 1: Access</h3>
                  <p className="text-slate-400 text-sm">
                    Navigate to &apos;Insights&apos; collection to find content awaiting review
                  </p>
                </div>
                <div className="bg-[#141633] rounded-lg p-4">
                  <h3 className="text-sm font-medium text-[#6B4AE1] mb-2">Step 2: Review</h3>
                  <p className="text-slate-400 text-sm">
                    Carefully assess content for accuracy and guidelines compliance
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-[#141633] rounded-lg p-4">
                  <h3 className="text-sm font-medium text-[#6B4AE1] mb-2">Step 3: Status</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#22C55E]"></span>
                      <span className="text-slate-400">Approved</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#EF4444]"></span>
                      <span className="text-slate-400">Rejected</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#F59E0B]"></span>
                      <span className="text-slate-400">Changes Requested</span>
                    </div>
                  </div>
                </div>
                <div className="bg-[#141633] rounded-lg p-4">
                  <h3 className="text-sm font-medium text-[#6B4AE1] mb-2">Step 4: Finalize</h3>
                  <p className="text-slate-400 text-sm">
                    Save your review to notify content creators
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer Note */}
      <div className="mt-6 bg-[#0E0F2C] border border-[#1E1F3E] rounded-lg p-4">
        <p className="text-sm text-slate-400">
          Questions? Contact the support team for assistance with the review process.
        </p>
      </div>
    </div>
  )
}

export default DashboardOnboard

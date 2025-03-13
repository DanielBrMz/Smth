import React from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, FileText, MessageCircle, RefreshCw, Save } from 'lucide-react'

const DashboardOnboard: React.FC = () => {
  return (
    <div className="w-full h-fit bg-[#000021] p-4">
      <div className="max-w-[95%] space-y-6">
        {/* Welcome Banner */}
        <Alert className="bg-[#6B4AE1]/10 border-[#6B4AE1]/20 mb-6">
          <CheckCircle2 className="h-5 w-5 text-[#6B4AE1]" />
          <AlertTitle className="text-xl font-bold text-[#6B4AE1]">
            Welcome to the Endorser Platform!
          </AlertTitle>
          <AlertDescription className="text-[#6B4AE1]/90">
            Get started with our guide on reviewing and managing content.
          </AlertDescription>
        </Alert>

        {/* Instructions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Step 1 */}
          <Card className="bg-[#0E0F2C] border-[#1E1F3E] shadow-lg hover:shadow-xl transition-all">
            <CardHeader className="p-4">
              <CardTitle className="flex items-center gap-2 text-lg text-white">
                <FileText className="h-5 w-5 text-[#6B4AE1]" />
                Accessing Content
              </CardTitle>
            </CardHeader>
            <CardContent className="text-slate-400 space-y-2 p-4 pt-0">
              <ul className="list-disc pl-4 space-y-1 text-sm">
                <li>Navigate to the &apos;Insights&apos; collection in the sidebar</li>
                <li>You&apos;ll see a list of content items awaiting review</li>
              </ul>
            </CardContent>
          </Card>

          {/* Step 2 */}
          <Card className="bg-[#0E0F2C] border-[#1E1F3E] shadow-lg hover:shadow-xl transition-all">
            <CardHeader className="p-4">
              <CardTitle className="flex items-center gap-2 text-lg text-white">
                <MessageCircle className="h-5 w-5 text-[#6B4AE1]" />
                Reviewing Content
              </CardTitle>
            </CardHeader>
            <CardContent className="text-slate-400 space-y-2 p-4 pt-0">
              <ul className="list-disc pl-4 space-y-1 text-sm">
                <li>Click on an item to open its details</li>
                <li>Read through the content carefully</li>
                <li>Check for accuracy, clarity, and adherence to guidelines</li>
              </ul>
            </CardContent>
          </Card>

          {/* Step 3 */}
          <Card className="bg-[#0E0F2C] border-[#1E1F3E] shadow-lg hover:shadow-xl transition-all">
            <CardHeader className="p-4">
              <CardTitle className="flex items-center gap-2 text-lg text-white">
                <RefreshCw className="h-5 w-5 text-[#6B4AE1]" />
                Review Status
              </CardTitle>
            </CardHeader>
            <CardContent className="text-slate-400 p-4 pt-0">
              <ul className="list-disc pl-4 space-y-1 text-sm">
                <li>
                  <span className="text-[#22C55E] font-medium">Approved</span> - content ready to
                  publish
                </li>
                <li>
                  <span className="text-[#EF4444] font-medium">Rejected</span> - significant changes
                  needed
                </li>
                <li>
                  <span className="text-[#F59E0B] font-medium">Changes Requested</span> - minor
                  revisions
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Step 4 */}
          <Card className="bg-[#0E0F2C] border-[#1E1F3E] shadow-lg hover:shadow-xl transition-all">
            <CardHeader className="p-4">
              <CardTitle className="flex items-center gap-2 text-lg text-white">
                <Save className="h-5 w-5 text-[#6B4AE1]" />
                Finalizing Review
              </CardTitle>
            </CardHeader>
            <CardContent className="text-slate-400 space-y-2 p-4 pt-0">
              <ul className="list-disc pl-4 space-y-1 text-sm">
                <li>Click &apos;Save&apos; to update the item once review is complete</li>
                <li>Content creator will be notified of your review</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Footer Note */}
        <Card className="bg-[#0E0F2C] border-[#1E1F3E] mt-4">
          <CardContent className="p-4 text-sm text-slate-400">
            <p>
              Remember, your role is crucial in maintaining the quality and integrity of our
              platform&apos;s content. If you have any questions, please reach out to the support
              team.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default DashboardOnboard

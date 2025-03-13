import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Settings, Users } from 'lucide-react'
import Link from 'next/link'

const Page = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white">
      <div className="container mx-auto px-6 lg:px-8 py-20 lg:py-32">
        <div className="space-y-16 lg:space-y-24">
          {/* Hero Section */}
          <div className="text-center space-y-8 lg:space-y-12">
            <h1 className="text-6xl lg:text-7xl xl:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 tracking-tight">
              Sidepocket Endorser Platform
            </h1>
            <p className="text-slate-400 text-xl lg:text-2xl max-w-4xl mx-auto leading-relaxed">
              Welcome to your centralized content management hub. Streamline your workflow and
              manage content across Sidepocket Endorser Ecosystem.
            </p>
          </div>

          {/* Cards Section */}
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-7xl mx-auto">
            <Card className="bg-slate-900/50 border-slate-800 backdrop-blur transition-transform duration-300 hover:scale-105">
              <CardHeader className="p-8">
                <CardTitle className="flex items-center gap-3 text-white text-2xl lg:text-3xl">
                  <Settings className="w-8 h-8 text-blue-400" />
                  Admin Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-8 pt-0">
                <p className="text-slate-400 text-lg lg:text-xl">
                  Manage content across Sidepocket with advanced administrative controls and
                  monitoring tools.
                </p>
                <Link href="/admin" className="block">
                  <Button
                    variant="default"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6"
                  >
                    Visit Admin Dashboard
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800 backdrop-blur transition-transform duration-300 hover:scale-105">
              <CardHeader className="p-8">
                <CardTitle className="flex items-center gap-3 text-white text-2xl lg:text-3xl">
                  <Users className="w-8 h-8 text-purple-400" />
                  Endorser Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-8 pt-0">
                <p className="text-slate-400 text-lg lg:text-xl">
                  Create and manage content seamlessly with our intuitive endorser interface.
                </p>
                <Link href="/endorser/login" className="block">
                  <Button
                    variant="default"
                    className="w-full bg-purple-600 hover:bg-purple-700 text-lg py-6"
                  >
                    Visit Endorser Dashboard
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Deployment Notice */}
          <div className="text-center">
            <p className="text-base lg:text-lg text-slate-500">
              This is a deployment test environment. For production access, please contact your
              system administrator.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page

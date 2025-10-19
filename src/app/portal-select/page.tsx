"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Home, Briefcase } from "lucide-react";
import { Logo } from "@/components/logo";

export default function PortalSelectPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex flex-col items-center justify-center p-8">
      {/* Logo and Title */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <Logo size="lg" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome to REPilot.ai</h1>
        <p className="text-lg text-gray-600">Choose your portal to continue</p>
      </div>

      {/* Portal Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
        {/* Client Portal */}
        <Card 
          className="p-8 hover:shadow-2xl transition-all duration-300 cursor-pointer group border-2 hover:border-blue-500"
          onClick={() => router.push('/')}
        >
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Home className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Client Portal</h2>
            <p className="text-gray-600 mb-6">
              Search for your dream home with AI-powered recommendations
            </p>
            <Button 
              size="lg" 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              onClick={() => router.push('/')}
            >
              Enter Client Portal
            </Button>
          </div>
        </Card>

        {/* Agent Portal */}
        <Card 
          className="p-8 hover:shadow-2xl transition-all duration-300 cursor-pointer group border-2 hover:border-green-500"
          onClick={() => router.push('/agent')}
        >
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Briefcase className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Agent Portal</h2>
            <p className="text-gray-600 mb-6">
              Manage your clients and properties with powerful AI tools
            </p>
            <Button 
              size="lg" 
              className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
              onClick={() => router.push('/agent')}
            >
              Enter Agent Portal
            </Button>
          </div>
        </Card>
      </div>

      {/* Footer */}
      <div className="mt-12 text-center text-sm text-gray-500">
        <p>Powered by AI • Secure • Professional</p>
      </div>
    </div>
  );
}


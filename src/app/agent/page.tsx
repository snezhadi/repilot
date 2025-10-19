"use client";

import { Suspense } from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  Mic, 
  Home,
  Heart,
  FileText,
  ShoppingBag
} from "lucide-react";
import { Logo } from "@/components/logo";
import { CustomSidebar } from "@/components/custom-sidebar";
import { FullscreenChatInterface } from "@/components/fullscreen-chat-interface";
import { RecommendationsSidebar } from "@/components/recommendations-sidebar";
import { PropertyDetailsPopup } from "@/components/property-details-popup";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
  type?: "text" | "thinking" | "recommendations" | "price-chart" | "showing-slots" | "showing-confirmed";
  propertySet?: "default" | "richmond-detached" | "richmond-townhouses";
}

interface Property {
  id: string;
  title: string;
  price: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  image: string;
  matchScore: number;
  aiReason: string;
  isWatched: boolean;
}

function AgentPortalContent() {
  const searchParams = useSearchParams();
  const [inputValue, setInputValue] = useState("");
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [showChatSidebar, setShowChatSidebar] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [simulationMessages] = useState<Message[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [isInChatMode, setIsInChatMode] = useState(false);
  const [, setPropertySet] = useState<'default' | 'richmond-detached' | 'richmond-townhouses'>('default');
  const [sidebarWidth, setSidebarWidth] = useState(480);
  const [isResizing, setIsResizing] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [isPropertyPopupOpen, setIsPropertyPopupOpen] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  // Load chat from history - same logic as client portal
  const loadChatFromHistory = useCallback((chatId: string) => {
    const chatHistoryData: Record<string, { messages: Message[]; properties: Property[]; propertySet: 'default' | 'richmond-detached' | 'richmond-townhouses' }> = {
      "chat-1": {
        messages: [
          {
            id: "1",
            text: "I'm looking for a detached home in Richmond Hill with at least 4 bedrooms and 2 bathrooms, preferably close to good schools.",
            sender: "user" as const,
            timestamp: new Date("2024-01-15T10:30:00")
          },
          {
            id: "2",
            text: "Great! I've found some excellent detached homes in Richmond Hill that match your criteria. These properties are all close to top-rated schools and offer the space you're looking for.",
            sender: "ai" as const,
            timestamp: new Date("2024-01-15T10:30:05"),
            type: "recommendations" as const,
            propertySet: "richmond-detached"
          }
        ],
        properties: [],
        propertySet: "richmond-detached"
      },
    };

    const chatData = chatHistoryData[chatId];
    if (chatData) {
      setChatMessages(chatData.messages);
      setProperties(chatData.properties);
      setPropertySet(chatData.propertySet);
      setIsInChatMode(true);
      setShowRecommendations(true);
    }
  }, []);

  useEffect(() => {
    const chatId = searchParams.get('chatId');
    
    if (chatId) {
      loadChatFromHistory(chatId);
    }
  }, [searchParams, loadChatFromHistory]);

  const quickActions = [
    { 
      icon: Search, 
      label: "Search Properties", 
      color: "bg-purple-100 text-purple-700",
      conversation: []
    },
    { 
      icon: Home, 
      label: "First Time Buyer", 
      color: "bg-blue-100 text-blue-700",
      conversation: []
    },
    { 
      icon: Heart, 
      label: "Investment Property", 
      color: "bg-red-100 text-red-700",
      conversation: []
    },
    { 
      icon: FileText, 
      label: "Market Analysis", 
      color: "bg-green-100 text-green-700",
      conversation: []
    },
    { 
      icon: ShoppingBag, 
      label: "Quick Sale", 
      color: "bg-orange-100 text-orange-700",
      conversation: []
    },
  ];

  const handleSendMessage = (message: string) => {
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      text: message,
      sender: "user",
      timestamp: new Date()
    };
    setChatMessages(prev => [...prev, userMsg]);

    // Simple AI response
    setTimeout(() => {
      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        text: "I'm here to help you find the perfect property for your client. What are their requirements?",
        sender: "ai",
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, aiMsg]);
    }, 1000);
  };

  const handleBackToHome = () => {
    setIsInChatMode(false);
    setShowRecommendations(false);
    setChatMessages([]);
    setProperties([]);
  };

  const handleWatchlistToggle = (propertyId: string) => {
    setProperties(prev =>
      prev.map(p =>
        p.id === propertyId ? { ...p, isWatched: !p.isWatched } : p
      )
    );
  };

  const handleRemoveProperty = (propertyId: string) => {
    setProperties(prev => prev.filter(p => p.id !== propertyId));
  };

  const handlePropertyClick = (propertyId: string) => {
    setSelectedPropertyId(propertyId);
    setIsPropertyPopupOpen(true);
  };

  const handleClosePropertyPopup = () => {
    setIsPropertyPopupOpen(false);
    setSelectedPropertyId(null);
  };

  const handleAskAI = (propertyTitle: string) => {
    setInputValue(`@${propertyTitle} `);
    setIsInChatMode(true);
  };

  if (isInChatMode) {
    return (
      <div className="flex h-screen bg-background">
        <CustomSidebar activePage="home" mode="agent" />
        
        <div 
          className="flex-1 flex"
          style={{ 
            marginRight: showRecommendations ? `${sidebarWidth}px` : '0',
            marginLeft: '64px'
          }}
        >
          <FullscreenChatInterface
            messages={chatMessages}
            onSendMessage={handleSendMessage}
            onBackToHome={handleBackToHome}
            inputValue={inputValue}
            onInputChange={setInputValue}
            isVoiceActive={isVoiceActive}
            onVoiceToggle={() => setIsVoiceActive(!isVoiceActive)}
            isSimulating={isSimulating}
            recommendedProperties={properties}
            onPropertyClick={handlePropertyClick}
          />
        </div>

        {showRecommendations && (
          <>
            <div 
              className={`fixed top-0 h-full ${isResizing ? 'bg-primary/10' : ''}`}
              style={{ right: `${sidebarWidth}px`, width: '4px', cursor: 'col-resize', zIndex: 40 }}
              onMouseDown={() => setIsResizing(true)}
            >
              <div className="w-0.5 h-8 bg-gray-400 group-hover:bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            
            <div 
              className="fixed right-0 top-0 h-full bg-card border-l border-border"
              style={{ width: `${sidebarWidth}px` }}
            >
              <RecommendationsSidebar
                properties={properties}
                onClose={() => setShowRecommendations(false)}
                onWatchlistToggle={handleWatchlistToggle}
                onRemoveProperty={handleRemoveProperty}
                onPropertyClick={handlePropertyClick}
                onAskAI={handleAskAI}
              />
            </div>
          </>
        )}

        <PropertyDetailsPopup
          propertyId={selectedPropertyId}
          isOpen={isPropertyPopupOpen}
          onClose={handleClosePropertyPopup}
        />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <CustomSidebar activePage="home" mode="agent" />
      
      <div className="flex-1 flex flex-col ml-16">
        {/* Header with Agent Badge */}
        <div className="flex items-center justify-between px-8 py-4 border-b border-border bg-background">
          <div className="flex items-center gap-4">
            <Logo />
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300 px-3 py-1">
              Agent Portal
            </Badge>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <img 
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face" 
                alt="Agent" 
                className="w-8 h-8 rounded-full object-cover"
              />
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="max-w-2xl w-full space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                AI Pilot for Agents
              </h1>
              <p className="text-xl text-muted-foreground">
                Help your clients find their perfect property with AI-powered search
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input
                type="text"
                placeholder="Ask AI to search properties for your client..."
                className="w-full pl-12 pr-12 py-4 border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
                onFocus={() => setIsInChatMode(true)}
              />
              <Button
                variant="ghost"
                size="sm"
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full ${isVoiceActive ? 'bg-primary text-primary-foreground' : ''}`}
                onClick={() => setIsVoiceActive(!isVoiceActive)}
              >
                <Mic className="w-5 h-5" />
              </Button>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  className={`${action.color} p-4 rounded-lg hover:shadow-md transition-all duration-200 flex flex-col items-center justify-center space-y-2`}
                  onClick={() => setIsInChatMode(true)}
                >
                  <action.icon className="w-6 h-6" />
                  <span className="text-sm font-medium">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AgentPortalPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div></div>}>
      <AgentPortalContent />
    </Suspense>
  );
}


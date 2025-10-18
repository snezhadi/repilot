"use client";

import { useState } from "react";
import { CustomSidebar } from "@/components/custom-sidebar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  MessageSquare, 
  Calendar, 
  Trash2,
  ChevronRight
} from "lucide-react";
import { useRouter } from "next/navigation";

interface ChatSession {
  id: string;
  title: string;
  aiSummary: string;
  lastInteraction: Date;
  messageCount: number;
  propertyCount: number;
  tags: string[];
  preview: string;
}

export default function ChatHistoryPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTag, setFilterTag] = useState<string | null>(null);

  // Mock chat history data
  const mockChatHistory: ChatSession[] = [
    {
      id: "chat-1",
      title: "Richmond Hill Detached Home Search",
      aiSummary: "User searched for detached homes in Richmond Hill near Bayview Secondary with budget of $1.2M. After viewing options, switched to townhouses due to budget constraints. Scheduled showing for 88 Bantry Ave #5 at 12:30 PM.",
      lastInteraction: new Date("2024-01-16T14:30:00"),
      messageCount: 12,
      propertyCount: 8,
      tags: ["Search", "Detached", "Townhouse", "Showing Scheduled"],
      preview: "Looking for a detached house in Richmond Hill, preferably in Bayview Secondary zone..."
    },
    {
      id: "chat-2",
      title: "First Time Buyer Consultation",
      aiSummary: "First-time buyer consultation with $400k budget. Discussed importance of location, school districts, and property types. Provided guidance on detached vs townhouse vs condo options and mortgage pre-approval importance.",
      lastInteraction: new Date("2024-01-15T10:15:00"),
      messageCount: 8,
      propertyCount: 4,
      tags: ["First Time Buyer", "Consultation"],
      preview: "Hi! I'm a first-time homebuyer and I'm feeling overwhelmed by the whole process..."
    },
    {
      id: "chat-3",
      title: "Investment Property Analysis",
      aiSummary: "Explored investment properties for rental income with $600k budget. Analyzed ROI potential, rental demand areas, and compared single-family homes vs condos for investment purposes.",
      lastInteraction: new Date("2024-01-14T16:45:00"),
      messageCount: 10,
      propertyCount: 6,
      tags: ["Investment", "Rental Income"],
      preview: "I'm interested in buying an investment property to generate rental income..."
    },
    {
      id: "chat-4",
      title: "Market Trend Analysis - Downtown",
      aiSummary: "Discussed current market trends in downtown area. Analyzed price changes over past year, buyer vs seller market conditions, and future outlook for property values in the region.",
      lastInteraction: new Date("2024-01-12T09:20:00"),
      messageCount: 6,
      propertyCount: 0,
      tags: ["Market Analysis"],
      preview: "Can you help me understand the current real estate market trends..."
    },
    {
      id: "chat-5",
      title: "Duplex with Rental Suite Search",
      aiSummary: "User searched for duplex or in-law suite properties with $500k budget. Discussed rental income expectations and tenant screening advice for living in one unit while renting the other.",
      lastInteraction: new Date("2024-01-10T11:30:00"),
      messageCount: 7,
      propertyCount: 5,
      tags: ["Duplex", "Rental Income"],
      preview: "I'm looking for a property that can generate solid rental income while I live there..."
    },
    {
      id: "chat-6",
      title: "Condo Comparison - City Center",
      aiSummary: "Compared luxury condos in city center. Discussed amenities, HOA fees, investment potential, and lifestyle considerations for urban living.",
      lastInteraction: new Date("2024-01-08T15:00:00"),
      messageCount: 9,
      propertyCount: 7,
      tags: ["Condo", "City Center"],
      preview: "I'm interested in downtown condos with good amenities..."
    }
  ];

  const filteredChats = mockChatHistory.filter(chat => {
    const matchesSearch = searchQuery === "" || 
      chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.aiSummary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.preview.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterTag === null || chat.tags.includes(filterTag);
    
    return matchesSearch && matchesFilter;
  });

  const allTags = Array.from(new Set(mockChatHistory.flatMap(chat => chat.tags)));

  const handleChatClick = (chatId: string) => {
    // Navigate to home page with chat restored
    // In a real implementation, you would load the chat from storage/API
    router.push(`/?chatId=${chatId}`);
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-background">
      <CustomSidebar activePage="chat-history" />
      
      <div className="ml-16 min-h-screen">
        <div className="max-w-5xl mx-auto p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Chat History</h1>
            <p className="text-muted-foreground">Review your past conversations with AI Pilot</p>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterTag === null ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterTag(null)}
              >
                All
              </Button>
              {allTags.slice(0, 4).map(tag => (
                <Button
                  key={tag}
                  variant={filterTag === tag ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterTag(filterTag === tag ? null : tag)}
                  className="hidden md:flex"
                >
                  {tag}
                </Button>
              ))}
            </div>
          </div>

          {/* Chat Sessions List */}
          <div className="space-y-4">
            {filteredChats.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No conversations found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filters</p>
              </div>
            ) : (
              filteredChats.map((chat) => (
                <Card 
                  key={chat.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer group"
                  onClick={() => handleChatClick(chat.id)}
                >
                  <CardHeader className="pb-2 pt-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1.5">
                          <h3 className="text-base font-semibold group-hover:text-primary transition-colors">
                            {chat.title}
                          </h3>
                          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {chat.tags.map(tag => (
                            <Badge 
                              key={tag} 
                              variant="secondary" 
                              className="text-xs py-0 h-5"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle delete
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7 p-0"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-2 pb-3">
                    {/* AI Summary */}
                    <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white text-[10px] font-bold">AI</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-medium text-blue-900 mb-0.5">AI Summary</p>
                          <p className="text-xs text-blue-800 leading-relaxed">{chat.aiSummary}</p>
                        </div>
                      </div>
                    </div>

                    {/* Preview */}
                    <div className="mb-2">
                      <p className="text-xs text-muted-foreground italic line-clamp-1">
                        &ldquo;{chat.preview}&rdquo;
                      </p>
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          <span>{chat.messageCount} messages</span>
                        </div>
                        {chat.propertyCount > 0 && (
                          <div className="flex items-center gap-1">
                            <span className="text-primary font-medium">{chat.propertyCount} properties</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatTimeAgo(chat.lastInteraction)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Stats Summary */}
          {filteredChats.length > 0 && (
            <div className="mt-8 p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Showing {filteredChats.length} of {mockChatHistory.length} conversations
                </span>
                <span className="text-muted-foreground">
                  Total properties discussed: {mockChatHistory.reduce((sum, chat) => sum + chat.propertyCount, 0)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


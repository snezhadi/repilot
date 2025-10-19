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
  tags: string[];
  aiSummary: string;
  preview: string;
  lastInteraction: string;
  messageCount: number;
  propertyCount: number;
}

export default function AgentChatHistoryPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data for agent chat sessions
  const chatSessions: ChatSession[] = [
    {
      id: "chat-1",
      title: "Richmond Hill Detached Home Search",
      tags: ["Detached", "Richmond Hill", "$1.2M"],
      aiSummary: "Client is looking for a 3-bedroom detached home in Richmond Hill near Bayview Secondary School with easy access to Highway 404, budget around $1.2M.",
      preview: "Looking for a detached house in Richmond Hill, preferably in Bayview Secondary zone...",
      lastInteraction: "2024-01-16T14:30:00",
      messageCount: 12,
      propertyCount: 5
    },
    {
      id: "chat-2",
      title: "First-Time Buyer Consultation",
      tags: ["First-Time", "Budget-Friendly"],
      aiSummary: "New client, first-time homebuyer feeling overwhelmed. Budget around $400K, needs guidance on the entire process and looking for safe neighborhoods with good schools.",
      preview: "Hi! I have a first-time homebuyer client who's feeling overwhelmed...",
      lastInteraction: "2024-01-15T10:15:00",
      messageCount: 8,
      propertyCount: 3
    },
  ];

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString();
  };

  const handleChatClick = (chatId: string) => {
    router.push(`/agent?chatId=${chatId}`);
  };

  const filteredChats = chatSessions.filter(chat =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex h-screen bg-background">
      <CustomSidebar activePage="chat-history" mode="agent" />
      
      <div className="flex-1 ml-16">
        {/* Header */}
        <div className="border-b border-border bg-card">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">Chat History</h1>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                  Agent Portal
                </Badge>
              </div>
              <Badge variant="secondary" className="text-sm">
                {filteredChats.length} Conversations
              </Badge>
            </div>
            
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* Chat List */}
        <div className="p-6 space-y-3 overflow-y-auto" style={{ height: 'calc(100vh - 180px)' }}>
          {filteredChats.map((chat) => (
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
                    <div className="w-5 h-5 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
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
          ))}
        </div>
      </div>
    </div>
  );
}


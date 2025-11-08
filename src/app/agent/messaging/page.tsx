"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { CustomSidebar } from "@/components/custom-sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Send,
  Mic,
  MessageSquare,
  Search,
  Eye,
  Bed,
  Bath,
  Square,
  MapPin,
  Heart,
  Share2
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { PropertyDetailsPopup } from "@/components/property-details-popup";
import { INITIAL_AGENT_CLIENTS } from "@/data/agent-clients";

interface Message {
  id: string;
  text: string;
  sender: "agent" | "client";
  timestamp: Date;
  type?: "text" | "recommendations" | "showing-slots" | "showing-confirmed";
}

interface ChatThread {
  id: string;
  clientId: string;
  clientName: string;
  clientAvatar?: string;
  status: "active" | "paused" | "expired";
  unreadCount: number;
  lastActive: Date;
  preview: string;
  messages: Message[];
}

interface PropertyRecommendation {
  id: string;
  title: string;
  price: string;
  location: string;
  image: string;
  beds: number;
  baths: number;
  sqft: string;
  matchScore: number;
}

const recommendedProperties: PropertyRecommendation[] = [
  {
    id: "rec-1",
    title: "Modern Family Home with Garden",
    price: "$1,150,000",
    location: "Richmond Hill, ON",
    image: "/property1.jpg",
    beds: 4,
    baths: 3,
    sqft: "2,200 sqft",
    matchScore: 96
  },
  {
    id: "rec-2",
    title: "Luxury Townhouse Retreat",
    price: "$985,000",
    location: "Maple, ON",
    image: "/property2.jpg",
    beds: 3,
    baths: 3,
    sqft: "1,900 sqft",
    matchScore: 92
  },
  {
    id: "rec-3",
    title: "Elegant Detached Home",
    price: "$1,320,000",
    location: "Aurora, ON",
    image: "/property3.jpg",
    beds: 5,
    baths: 4,
    sqft: "2,800 sqft",
    matchScore: 89
  }
];

const baseChats: ChatThread[] = [
  {
    id: "chat-1",
    clientId: "client-1",
    clientName: "Alex Johnson",
    clientAvatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    status: "active",
    unreadCount: 0,
    lastActive: new Date(Date.now() - 1000 * 60 * 3),
    preview: "Absolutely! I'd be happy to arrange a showing for you. Here are the available time slots for this week:",
    messages: [
      {
        id: "m1",
        text: "Hi Sarah! I hope you're doing well. I've been looking at some properties in Richmond Hill and wanted to get your thoughts on a few options I found.",
        sender: "client",
        timestamp: new Date(Date.now() - 1000 * 60 * 30)
      },
      {
        id: "m2",
        text: "Hi! Great to hear from you. I'd be happy to help you with your property search in Richmond Hill. I actually have some excellent listings that might be perfect for your needs. Let me share a few that I think you'll love!",
        sender: "agent",
        timestamp: new Date(Date.now() - 1000 * 60 * 25)
      },
      {
        id: "m3",
        text: "I've found some amazing properties that match your criteria perfectly. These homes are in great neighborhoods with excellent schools and are within your budget range.",
        sender: "agent",
        timestamp: new Date(Date.now() - 1000 * 60 * 20),
        type: "recommendations"
      },
      {
        id: "m4",
        text: "These look really nice! I'm particularly interested in the Modern Family Home with Garden. However, I'm a bit concerned about the commute to downtown Toronto. How long would it typically take during rush hour?",
        sender: "client",
        timestamp: new Date(Date.now() - 1000 * 60 * 15)
      },
      {
        id: "m5",
        text: "That's a great question! The commute from Richmond Hill to downtown Toronto is actually quite manageable. During rush hour, it typically takes about 45-60 minutes by car, and there are excellent GO Transit options that can get you downtown in about 35-40 minutes. The area is also well-connected with Highway 404 and 407, giving you multiple route options. Many of my clients who work downtown find this commute very reasonable, especially considering the quality of life and space you get in Richmond Hill.",
        sender: "agent",
        timestamp: new Date(Date.now() - 1000 * 60 * 10)
      },
      {
        id: "m6",
        text: "That's reassuring! The Modern Family Home looks perfect for our needs. Would it be possible to schedule a showing? I'd love to see it in person.",
        sender: "client",
        timestamp: new Date(Date.now() - 1000 * 60 * 5)
      },
      {
        id: "m7",
        text: "Absolutely! I'd be happy to arrange a showing for you. Here are the available time slots for this week:",
        sender: "agent",
        timestamp: new Date(Date.now() - 1000 * 60 * 2),
        type: "showing-slots"
      }
    ]
  },
  {
    id: "chat-2",
    clientId: "client-2",
    clientName: "Sarah Williams",
    clientAvatar:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop&crop=face",
    status: "active",
    unreadCount: 3,
    lastActive: new Date(Date.now() - 1000 * 60 * 15),
    preview: "Could you compare the harbourfront condos again?",
    messages: [
      {
        id: "s1",
        text: "Morning Sarah! I added two new harbourfront penthouses for us to review.",
        sender: "agent",
        timestamp: new Date(Date.now() - 1000 * 60 * 60)
      },
      {
        id: "s2",
        text: "Thanks Sarah (the agent)! Can you send a side-by-side comparison with maintenance fees?",
        sender: "client",
        timestamp: new Date(Date.now() - 1000 * 60 * 40)
      }
    ]
  },
  {
    id: "chat-3",
    clientId: "client-3",
    clientName: "Michael Chen",
    clientAvatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    status: "paused",
    unreadCount: 0,
    lastActive: new Date(Date.now() - 1000 * 60 * 120),
    preview: "We’re pausing until work approves the relocation.",
    messages: [
      {
        id: "mc1",
        text: "Let me know once the relocation package is finalized — we’ll keep an eye on Laurelwood inventory.",
        sender: "agent",
        timestamp: new Date(Date.now() - 1000 * 60 * 150)
      },
      {
        id: "mc2",
        text: "Will do, thanks for checking in!",
        sender: "client",
        timestamp: new Date(Date.now() - 1000 * 60 * 140)
      }
    ]
  }
];

export default function AgentMessagingPage() {
  const [chats, setChats] = useState<ChatThread[]>(baseChats);
  const [selectedChatId, setSelectedChatId] = useState<string>("");
  const [inputValue, setInputValue] = useState("");
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showRecommendations, setShowRecommendations] = useState(false);

  const selectedChat = useMemo(
    () => chats.find((chat) => chat.id === selectedChatId) ?? null,
    [chats, selectedChatId]
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedChat]);

  const handleSelectChat = (chatId: string) => {
    setSelectedChatId(chatId);
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
      )
    );
  };

  const handleSendMessage = () => {
    if (!selectedChat || !inputValue.trim()) return;

    const newMessage: Message = {
      id: `${Date.now()}`,
      text: inputValue.trim(),
      sender: "agent",
      timestamp: new Date(),
      type: "text"
    };

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === selectedChat.id
          ? {
              ...chat,
              preview: newMessage.text,
              lastActive: newMessage.timestamp,
              messages: [...chat.messages, newMessage]
            }
          : chat
      )
    );
    setInputValue("");

    setTimeout(() => {
      const clientResponse: Message = {
        id: `${Date.now()}-client`,
        text: "Thanks for the update! I'll review and get back to you.",
        sender: "client",
        timestamp: new Date(),
        type: "text"
      };
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === selectedChat.id
            ? {
                ...chat,
                preview: clientResponse.text,
                lastActive: clientResponse.timestamp,
                unreadCount: chat.id === selectedChatId ? chat.unreadCount : chat.unreadCount + 1,
                messages: [...chat.messages, clientResponse]
              }
            : chat
        )
      );
    }, 1200);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleSendMessage();
  };

  const handlePropertyClick = (propertyId: string) => {
    setShowRecommendations(true);
  };

  return (
    <div className="flex h-screen bg-background">
      <CustomSidebar activePage="messaging" mode="agent" />

      {/* Chat list */}
      <div className="ml-16 w-80 border-r border-border flex flex-col bg-card">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Client Chats</h2>
            <Badge variant="secondary" className="text-xs">
              {chats.length} active
            </Badge>
          </div>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search clients" className="pl-9 pr-3" disabled />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {chats.map((chat) => {
            const client = INITIAL_AGENT_CLIENTS.find((c) => c.id === chat.clientId);
            return (
              <button
                key={chat.id}
                onClick={() => handleSelectChat(chat.id)}
                className={`w-full text-left px-4 py-3 border-b border-border transition-colors hover:bg-muted/50 ${
                  chat.id === selectedChatId ? "bg-muted/60" : "bg-transparent"
                }`}
              >
                <div className="flex items-start gap-3">
                  <Avatar className="w-10 h-10">
                    {chat.clientAvatar ? (
                      <AvatarImage src={chat.clientAvatar} alt={chat.clientName} />
                    ) : (
                      <AvatarFallback>{chat.clientName.slice(0, 2).toUpperCase()}</AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-sm font-semibold truncate">{chat.clientName}</h3>
                      <span className="text-xs text-muted-foreground">
                        {chat.lastActive.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-1">{chat.preview}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px]">
                        {chat.status === "active" ? "Active" : chat.status === "paused" ? "Paused" : "Expired"}
                      </Badge>
                      {client?.latestCriteria?.propertyTypes && (
                        <span className="text-[10px] text-muted-foreground">
                          {client.latestCriteria.propertyTypes.join(" • ")}
                        </span>
                      )}
                    </div>
                  </div>
                  {chat.unreadCount > 0 && (
                    <div className="min-w-[20px] h-5 rounded-full bg-primary text-primary-foreground text-[11px] font-semibold flex items-center justify-center">
                      {chat.unreadCount}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Conversation */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-background flex-shrink-0">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedChatId("")}
                  className="h-8 w-8 p-0 lg:hidden"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <Avatar className="w-10 h-10">
                  {selectedChat.clientAvatar ? (
                    <AvatarImage src={selectedChat.clientAvatar} alt={selectedChat.clientName} />
                  ) : (
                    <AvatarFallback>{selectedChat.clientName.slice(0, 2).toUpperCase()}</AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold">{selectedChat.clientName}</h2>
                    <Badge variant="secondary" className="text-xs capitalize">
                      {selectedChat.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Last active {selectedChat.lastActive.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2" />
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {selectedChat.messages.map((message) => {
                const isAgentMessage = message.sender === "agent";
                return (
                  <div
                    key={message.id}
                    className={`flex ${isAgentMessage ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`flex items-start space-x-3 max-w-[80%] ${
                        isAgentMessage ? "flex-row-reverse space-x-reverse" : ""
                      }`}
                    >
                      <Avatar className="w-8 h-8 flex-shrink-0">
                        {isAgentMessage ? (
                          <>
                            <AvatarImage src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face" alt="Agent" />
                            <AvatarFallback>AG</AvatarFallback>
                          </>
                        ) : (
                          <>
                            <AvatarImage src={selectedChat.clientAvatar} alt={selectedChat.clientName} />
                            <AvatarFallback>{selectedChat.clientName.slice(0, 2).toUpperCase()}</AvatarFallback>
                          </>
                        )}
                      </Avatar>
                      <Card
                        className={`${
                          isAgentMessage ? "bg-gray-100 text-gray-900" : "bg-background"
                        } max-w-full !py-3 border-0`}
                      >
                        <CardContent className="!px-4 !py-0">
                          {message.type === "recommendations" ? (
                            <div className="space-y-2">
                              <p className="text-sm break-words whitespace-pre-wrap">{message.text}</p>
                              <Card
                                className="bg-blue-50 border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer inline-block w-auto"
                                onClick={() => setShowRecommendations(true)}
                              >
                                <CardContent className="px-2 py-0">
                                  <div className="flex items-center gap-2">
                                    <div className="flex -space-x-1">
                                      <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                                        <img src="/property1.jpg" alt="Property" className="w-full h-full object-cover" />
                                      </div>
                                      <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                                        <img src="/property2.jpg" alt="Property" className="w-full h-full object-cover" />
                                      </div>
                                      <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                                        <img src="/property3.jpg" alt="Property" className="w-full h-full object-cover" />
                                      </div>
                                    </div>
                                    <span className="text-sm font-medium text-blue-900">View Property Recommendations</span>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          ) : message.type === "showing-slots" ? (
                            <div className="space-y-3">
                              <p className="text-sm font-medium text-green-700">
                                Here are the available time slots this week:
                              </p>
                              <div className="flex gap-2 flex-wrap">
                                {["10:00 AM", "2:00 PM", "4:30 PM"].map((slot) => (
                                  <button
                                    key={slot}
                                    className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors"
                                  >
                                    {slot}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ) : message.type === "showing-confirmed" ? (
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                  <span className="text-white text-sm">✓</span>
                                </div>
                                <p className="text-sm font-medium text-green-700">{message.text}</p>
                              </div>
                            </div>
                          ) : (
                            <div className="text-sm break-words prose prose-sm max-w-none [&_p]:mb-3 [&_ul]:mb-3 [&_li]:mb-1">
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.text}</ReactMarkdown>
                            </div>
                          )}
                          <p className="text-xs opacity-70 mt-1">
                            {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-border px-6 py-4 bg-background flex-shrink-0">
              <form onSubmit={handleSubmit} className="flex items-end gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className={`h-10 w-10 ${isVoiceActive ? "bg-primary text-primary-foreground" : ""}`}
                  onClick={() => setIsVoiceActive((prev) => !prev)}
                >
                  <Mic className="h-4 w-4" />
                </Button>
                <textarea
                  value={inputValue}
                  onChange={(event) => setInputValue(event.target.value)}
                  placeholder="Write a message..."
                  rows={2}
                  className="flex-1 resize-none rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />
                <Button type="submit" disabled={!inputValue.trim()} className="h-10 w-10 p-0">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-muted-foreground">
            Select a client conversation to get started.
          </div>
        )}
      </div>

      {/* Recommendations */}
      {showRecommendations && (
        <div className="hidden xl:flex w-96 border-l border-border flex-col bg-background">
        <div className="p-4 border-b border-border">
          <h3 className="text-lg font-semibold">Suggested for {selectedChat?.clientName ?? "client"}</h3>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Share handpicked listings instantly with your buyer.</span>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setShowRecommendations(false)}>
              <span className="sr-only">Close recommendations</span>
              ×
            </Button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {recommendedProperties.map((property) => (
            <Card key={property.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative">
                <img src={property.image} alt={property.title} className="h-40 w-full object-cover" />
                <Badge className="absolute top-2 right-2 bg-green-600">
                  {property.matchScore}% match
                </Badge>
              </div>
              <CardContent className="p-4 space-y-2">
                <h4 className="font-semibold text-lg">{property.title}</h4>
                <p className="text-xl font-bold text-primary">{property.price}</p>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1" />
                  {property.location}
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Bed className="h-3 w-3" /> {property.beds}
                  </span>
                  <span className="flex items-center gap-1">
                    <Bath className="h-3 w-3" /> {property.baths}
                  </span>
                  <span className="flex items-center gap-1">
                    <Square className="h-3 w-3" /> {property.sqft}
                  </span>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button size="sm" className="text-xs flex-1" onClick={() => handlePropertyClick(property.id)}>
                    <Eye className="h-3 w-3 mr-1" /> View
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      )}
    </div>
  );
}

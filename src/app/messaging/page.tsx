'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Send, Mic, Eye, Bed, Bath, Square, Car, MapPin, Heart, Share2, Calendar, Phone } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { PropertyDetailsPopup } from '@/components/property-details-popup';
import { CustomSidebar } from '@/components/custom-sidebar';

interface Message {
  id: string;
  text: string;
  sender: "user" | "agent";
  timestamp: Date;
  type?: "text" | "thinking" | "recommendations" | "showing-slots" | "showing-confirmed";
  propertySet?: "default" | "richmond-detached" | "richmond-townhouses";
}

interface Property {
  id: string;
  title: string;
  price: string;
  location: string;
  image: string;
  beds: number;
  baths: number;
  sqft: string;
  parking: string;
  type: string;
  matchScore: number;
  status: string;
}

// Mock properties for agent recommendations
const agentRecommendedProperties: Property[] = [
  {
    id: "agent-1",
    title: "Modern Family Home with Garden",
    price: "$1,150,000",
    location: "Richmond Hill, ON",
    image: "/property1.jpg",
    beds: 4,
    baths: 3,
    sqft: "2,200 sqft",
    parking: "2 cars",
    type: "Detached",
    matchScore: 95,
    status: "Available"
  },
  {
    id: "agent-2", 
    title: "Spacious Detached Home",
    price: "$1,080,000",
    location: "Richmond Hill, ON",
    image: "/property2.jpg",
    beds: 3,
    baths: 2,
    sqft: "1,850 sqft",
    parking: "2 cars",
    type: "Detached",
    matchScore: 92,
    status: "Available"
  },
  {
    id: "agent-3",
    title: "Luxury Townhouse with Garden",
    price: "$950,000",
    location: "Richmond Hill, ON", 
    image: "/property3.jpg",
    beds: 3,
    baths: 2,
    sqft: "1,800 sqft",
    parking: "1 car",
    type: "Townhouse",
    matchScore: 88,
    status: "Available"
  },
  {
    id: "agent-4",
    title: "Contemporary Family Home",
    price: "$1,220,000",
    location: "Richmond Hill, ON",
    image: "/property4.jpg", 
    beds: 4,
    baths: 3,
    sqft: "2,400 sqft",
    parking: "2 cars",
    type: "Detached",
    matchScore: 90,
    status: "Available"
  }
];

export default function MessagingPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [isPropertyPopupOpen, setIsPropertyPopupOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initialize with mock conversation
  useEffect(() => {
    const initialMessages: Message[] = [
      {
        id: "1",
        text: "Hi Sarah! I hope you're doing well. I've been looking at some properties in Richmond Hill and wanted to get your thoughts on a few options I found.",
        sender: "user",
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        type: "text"
      },
      {
        id: "2", 
        text: "Hi! Great to hear from you. I'd be happy to help you with your property search in Richmond Hill. I actually have some excellent listings that might be perfect for your needs. Let me share a few that I think you'll love!",
        sender: "agent",
        timestamp: new Date(Date.now() - 1000 * 60 * 25), // 25 minutes ago
        type: "text"
      },
      {
        id: "3",
        text: "I've found some amazing properties that match your criteria perfectly. These homes are in great neighborhoods with excellent schools and are within your budget range.",
        sender: "agent", 
        timestamp: new Date(Date.now() - 1000 * 60 * 20), // 20 minutes ago
        type: "recommendations",
        propertySet: "richmond-detached"
      },
      {
        id: "4",
        text: "These look really nice! I'm particularly interested in the Modern Family Home with Garden. However, I'm a bit concerned about the commute to downtown Toronto. How long would it typically take during rush hour?",
        sender: "user",
        timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
        type: "text"
      },
      {
        id: "5",
        text: "That's a great question! The commute from Richmond Hill to downtown Toronto is actually quite manageable. During rush hour, it typically takes about 45-60 minutes by car, and there are excellent GO Transit options that can get you downtown in about 35-40 minutes. The area is also well-connected with Highway 404 and 407, giving you multiple route options. Many of my clients who work downtown find this commute very reasonable, especially considering the quality of life and space you get in Richmond Hill.",
        sender: "agent",
        timestamp: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
        type: "text"
      },
      {
        id: "6",
        text: "That's reassuring! The Modern Family Home looks perfect for our needs. Would it be possible to schedule a showing? I'd love to see it in person.",
        sender: "user", 
        timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
        type: "text"
      },
      {
        id: "7",
        text: "Absolutely! I'd be happy to arrange a showing for you. Here are the available time slots for this week:",
        sender: "agent",
        timestamp: new Date(Date.now() - 1000 * 60 * 2), // 2 minutes ago
        type: "showing-slots"
      }
    ];

    setMessages(initialMessages);
    setShowRecommendations(true);
  }, []);

  const handleSendMessage = (message: string) => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: "user",
      timestamp: new Date(),
      type: "text"
    };

    setMessages(prev => [...prev, newMessage]);

    // Simulate agent response
    setTimeout(() => {
      const agentResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "Thank you for your message! I'll get back to you shortly with more information.",
        sender: "agent", 
        timestamp: new Date(),
        type: "text"
      };
      setMessages(prev => [...prev, agentResponse]);
    }, 1000);
  };

  const handlePropertyClick = (propertyId: string) => {
    setSelectedPropertyId(propertyId);
    setIsPropertyPopupOpen(true);
  };

  const handleClosePropertyPopup = () => {
    setIsPropertyPopupOpen(false);
    setSelectedPropertyId(null);
  };

  const handleRecommendationClick = () => {
    setShowRecommendations(!showRecommendations);
  };

  const handleTimeSlotClick = (time: string) => {
    const confirmationMessage: Message = {
      id: Date.now().toString(),
      text: `Perfect! I've scheduled your showing for ${time} on Friday. I'll send you the exact address and my contact details shortly. Looking forward to showing you this beautiful home!`,
      sender: "agent",
      timestamp: new Date(),
      type: "showing-confirmed"
    };
    setMessages(prev => [...prev, confirmationMessage]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      handleSendMessage(inputValue);
      setInputValue("");
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Main Sidebar */}
      <CustomSidebar activePage="messaging" />
      
      {/* Chat Interface */}
      <div className="flex-1 flex flex-col ml-16">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-background flex-shrink-0">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.history.back()}
              className="h-8 w-8 p-0"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face" alt="Sarah Johnson" className="w-full h-full object-cover" />
                <AvatarFallback>SJ</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-lg font-semibold">Sarah Johnson</h2>
                <p className="text-sm text-muted-foreground">Your Real Estate Agent</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Online
            </Badge>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex items-start space-x-3 max-w-[80%] ${message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""}`}>
                <Avatar className="w-8 h-8 flex-shrink-0">
                  {message.sender === "agent" ? (
                    <>
                      <AvatarImage src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face" alt="Sarah Johnson" className="w-full h-full object-cover" />
                      <AvatarFallback>SJ</AvatarFallback>
                    </>
                  ) : (
                    <>
                      <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" alt="User" className="w-full h-full object-cover" />
                      <AvatarFallback>U</AvatarFallback>
                    </>
                  )}
                </Avatar>
                <Card className={`${message.sender === "user" ? "bg-gray-100 text-gray-900" : "bg-background"} max-w-full !py-3 border-0`}>
                  <CardContent className="!px-4 !py-0">
                    {message.type === "thinking" ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                        <p className="text-sm italic text-muted-foreground">{message.text}</p>
                      </div>
                    ) : message.type === "recommendations" ? (
                      <div className="space-y-2">
                        <p className="text-sm break-words whitespace-pre-wrap">{message.text}</p>
                        <Card className="bg-blue-50 border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer inline-block w-auto" onClick={handleRecommendationClick}>
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
                        <p className="text-sm font-medium text-green-700">{message.text}</p>
                        <div className="flex gap-2 flex-wrap">
                          <button 
                            onClick={() => handleTimeSlotClick("10:00 AM")}
                            className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors"
                          >
                            10:00 AM
                          </button>
                          <button 
                            onClick={() => handleTimeSlotClick("2:00 PM")}
                            className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium hover:bg-green-200 transition-colors"
                          >
                            2:00 PM
                          </button>
                          <button 
                            onClick={() => handleTimeSlotClick("4:30 PM")}
                            className="px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium hover:bg-orange-200 transition-colors"
                          >
                            4:30 PM
                          </button>
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
                      <div className="text-sm break-words prose prose-sm max-w-none [&_p]:mb-3 [&_ul]:mb-3 [&_li]:mb-1 [&_table]:border-collapse [&_table]:w-full [&_th]:border [&_th]:border-gray-300 [&_th]:px-3 [&_th]:py-2 [&_th]:bg-gray-50 [&_th]:text-left [&_th]:font-semibold [&_td]:border [&_td]:border-gray-300 [&_td]:px-3 [&_td]:py-2 [&_td]:text-sm">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.text}</ReactMarkdown>
                      </div>
                    )}
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-border p-4 bg-background flex-shrink-0">
          <form onSubmit={handleSubmit} className="flex items-end space-x-3">
            <div className="flex-1">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                className="w-full min-h-[60px] max-h-32 p-3 border border-input bg-background rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-sm"
                rows={2}
              />
            </div>
            <div className="flex flex-col space-y-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsVoiceActive(!isVoiceActive)}
                className={`h-8 w-8 p-0 ${isVoiceActive ? 'bg-primary text-primary-foreground' : ''}`}
              >
                <Mic className="w-4 h-4" />
              </Button>
              <Button
                type="submit"
                size="sm"
                className="h-8 w-8 p-0"
                disabled={!inputValue.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Property Recommendations Sidebar */}
      {showRecommendations && (
        <div className="w-96 border-l border-border bg-background flex flex-col">
          <div className="p-4 border-b border-border">
            <h3 className="text-lg font-semibold">Property Recommendations</h3>
            <p className="text-sm text-muted-foreground">Properties suggested by Sarah</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {agentRecommendedProperties.map((property) => (
              <Card key={property.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-48 object-cover"
                  />
                  <Badge className="absolute top-2 right-2 bg-green-600">
                    {property.matchScore}% Match
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <h4 className="font-semibold text-lg mb-1">{property.title}</h4>
                  <p className="text-2xl font-bold text-primary mb-2">{property.price}</p>
                  <div className="flex items-center text-sm text-muted-foreground mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    {property.location}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Bed className="w-4 h-4 mr-1" />
                        {property.beds}
                      </div>
                      <div className="flex items-center">
                        <Bath className="w-4 h-4 mr-1" />
                        {property.baths}
                      </div>
                      <div className="flex items-center">
                        <Square className="w-4 h-4 mr-1" />
                        {property.sqft}
                      </div>
                      <div className="flex items-center">
                        <Car className="w-4 h-4 mr-1" />
                        {property.parking}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      className="text-xs h-7 px-2 flex-1"
                      onClick={() => handlePropertyClick(property.id)}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="h-7 px-2">
                      <Heart className="w-3 h-3" />
                    </Button>
                    <Button variant="outline" size="sm" className="h-7 px-2">
                      <Share2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Property Details Popup */}
      <PropertyDetailsPopup
        propertyId={selectedPropertyId}
        isOpen={isPropertyPopupOpen}
        onClose={handleClosePropertyPopup}
      />
    </div>
  );
}

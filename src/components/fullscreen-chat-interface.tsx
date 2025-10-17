import React, { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, User, Mic, Send, ArrowLeft, Home, Eye } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
  type?: "text" | "thinking" | "recommendations" | "price-chart" | "showing-slots" | "showing-confirmed";
  propertySet?: "default" | "richmond-detached" | "richmond-townhouses";
}

interface FullscreenChatInterfaceProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  onBackToHome: () => void;
  inputValue: string;
  onInputChange: (value: string) => void;
  isVoiceActive: boolean;
  onVoiceToggle: () => void;
  isSimulating?: boolean;
  onShowRecommendations?: () => void;
  onRecommendationClick?: (propertySet?: "default" | "richmond-detached" | "richmond-townhouses") => void;
}

export function FullscreenChatInterface({ 
  messages, 
  onSendMessage, 
  onBackToHome,
  inputValue,
  onInputChange,
  isVoiceActive,
  onVoiceToggle,
  isSimulating = false,
  onShowRecommendations,
  onRecommendationClick
}: FullscreenChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [localInput, setLocalInput] = useState("");

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      onInputChange("");
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-background flex-shrink-0">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBackToHome}
            className="h-8 w-8 p-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h2 className="text-lg font-semibold">AI Pilot</h2>
            <p className="text-sm text-muted-foreground">Your Smart Agent</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {messages.length === 0 && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-3 max-w-[80%]">
              <Avatar className="w-8 h-8 flex-shrink-0">
                <AvatarImage src="/ai_avatar.png" alt="AI Assistant" className="w-full h-full object-cover" />
              </Avatar>
              <Card className="bg-background max-w-full !py-3 border-0">
                <CardContent className="!px-4 !py-0">
                  <p className="text-sm">Hi! I'm your AI real estate agent. I can help you find the perfect property. What are you looking for?</p>
                  <p className="text-xs opacity-70 mt-1">
                    {new Date().toLocaleTimeString()}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
        
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className={`flex items-start space-x-3 max-w-[80%] ${message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""}`}>
              <Avatar className="w-8 h-8 flex-shrink-0">
                {message.sender === "ai" ? (
                  <AvatarImage src="/ai_avatar.png" alt="AI Assistant" className="w-full h-full object-cover" />
                ) : (
                  <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" alt="User" />
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
                      <Card className="bg-blue-50 border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer inline-block w-auto" onClick={() => onRecommendationClick?.(message.propertySet)}>
                        <CardContent className="px-2 py-0">
                          <div className="flex items-center gap-2">
                            <div className="flex -space-x-1">
                              <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=100&h=100&fit=crop" alt="Property" className="w-full h-full object-cover" />
                              </div>
                              <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=100&h=100&fit=crop" alt="Property" className="w-full h-full object-cover" />
                              </div>
                              <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1600596542815-ffade4c69d0a?w=100&h=100&fit=crop" alt="Property" className="w-full h-full object-cover" />
                              </div>
                            </div>
                            <span className="text-sm font-medium text-blue-900">View Property Recommendations</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ) : message.type === "price-chart" ? (
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-purple-700">📊 Comparison of the trend for Detached homes vs. Townhouses in Richmond Hill</p>
                      <div className="bg-white border border-gray-200 rounded-lg p-4 w-full max-w-5xl">
                        {/* Y-axis labels */}
                        <div className="flex">
                          <div className="flex flex-col justify-between h-48 text-xs text-gray-600 pr-2">
                            <span>$1.60M</span>
                            <span>$1.40M</span>
                            <span>$1.20M</span>
                            <span>$1.00M</span>
                            <span>$0.80M</span>
                          </div>
                          
                          {/* Chart area */}
                          <div className="flex-1 relative h-48">
                            {/* Grid lines */}
                            <div className="absolute inset-0 flex flex-col justify-between">
                              <div className="border-t border-gray-100"></div>
                              <div className="border-t border-gray-100"></div>
                              <div className="border-t border-gray-100"></div>
                              <div className="border-t border-gray-100"></div>
                              <div className="border-t border-gray-100"></div>
                            </div>
                            
                            {/* Detached homes line (blue) */}
                            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 160 192" preserveAspectRatio="none">
                              <polyline
                                points="0,96 40,84 80,54 120,30 160,12"
                                fill="none"
                                stroke="#3b82f6"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              {/* Detached data points */}
                              <circle cx="0" cy="96" r="3" fill="#3b82f6" />
                              <circle cx="40" cy="84" r="3" fill="#3b82f6" />
                              <circle cx="80" cy="54" r="3" fill="#3b82f6" />
                              <circle cx="120" cy="30" r="3" fill="#3b82f6" />
                              <circle cx="160" cy="12" r="3" fill="#3b82f6" />
                            </svg>
                            
                            {/* Townhouses line (green) */}
                            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 160 192" preserveAspectRatio="none">
                              <polyline
                                points="0,120 40,114 80,102 120,84 160,72"
                                fill="none"
                                stroke="#10b981"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              {/* Townhouse data points */}
                              <circle cx="0" cy="120" r="3" fill="#10b981" />
                              <circle cx="40" cy="114" r="3" fill="#10b981" />
                              <circle cx="80" cy="102" r="3" fill="#10b981" />
                              <circle cx="120" cy="84" r="3" fill="#10b981" />
                              <circle cx="160" cy="72" r="3" fill="#10b981" />
                            </svg>
                          </div>
                        </div>
                        
                        {/* X-axis labels */}
                        <div className="flex justify-between mt-2 text-xs text-gray-600">
                          <span>2019</span>
                          <span>2020</span>
                          <span>2021</span>
                          <span>2022</span>
                          <span>2024</span>
                        </div>
                        
                        {/* Legend */}
                        <div className="flex justify-center gap-4 mt-3 text-xs">
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <span>Detached</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span>Townhouse</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : message.type === "showing-slots" ? (
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-green-700">Available Showing Times</p>
                      <div className="flex gap-2 flex-wrap">
                        <button className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors">
                          10:00 AM
                        </button>
                        <button className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium hover:bg-green-200 transition-colors">
                          12:30 PM
                        </button>
                        <button className="px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium hover:bg-orange-200 transition-colors">
                          4:00 PM
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
              onChange={(e) => onInputChange(e.target.value)}
              placeholder="Ask me about properties..."
              className="w-full min-h-[60px] max-h-32 p-3 border border-input bg-background rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-sm"
              rows={2}
            />
          </div>
          <div className="flex flex-col space-y-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onVoiceToggle}
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
  );
}

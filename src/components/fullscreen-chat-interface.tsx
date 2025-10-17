import React, { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, User, Mic, Send, ArrowLeft, Home, Eye, X } from "lucide-react";
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
  recommendedProperties?: Property[];
  onPropertyClick?: (propertyId: string) => void;
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
  onRecommendationClick,
  recommendedProperties = [],
  onPropertyClick
}: FullscreenChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showMentionMenu, setShowMentionMenu] = useState(false);
  const [mentionSearch, setMentionSearch] = useState("");
  const [mentionMenuPosition, setMentionMenuPosition] = useState({ top: 0, left: 0 });
  const [selectedMentionIndex, setSelectedMentionIndex] = useState(0);
  const [mentionedProperties, setMentionedProperties] = useState<Set<string>>(new Set());

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle @ mentions
  const handleInputChange = (value: string) => {
    onInputChange(value);
    
    // Check if user typed @
    const cursorPosition = textareaRef.current?.selectionStart || 0;
    const textBeforeCursor = value.substring(0, cursorPosition);
    const atIndex = textBeforeCursor.lastIndexOf('@');
    
    if (atIndex !== -1 && recommendedProperties.length > 0) {
      const searchTerm = textBeforeCursor.substring(atIndex + 1);
      
      // Only show menu if @ is at start or after a space
      const charBeforeAt = atIndex > 0 ? textBeforeCursor[atIndex - 1] : ' ';
      if (charBeforeAt === ' ' || atIndex === 0) {
        setMentionSearch(searchTerm.toLowerCase());
        setShowMentionMenu(true);
        setSelectedMentionIndex(0);
        
        // Calculate menu position
        const textarea = textareaRef.current;
        if (textarea) {
          const rect = textarea.getBoundingClientRect();
          setMentionMenuPosition({
            top: rect.top - 10,
            left: rect.left
          });
        }
      }
    } else {
      setShowMentionMenu(false);
    }
  };

  // Filter properties based on search
  const filteredProperties = recommendedProperties.filter(p => 
    p.title.toLowerCase().includes(mentionSearch) || 
    p.location.toLowerCase().includes(mentionSearch)
  );

  // Handle property selection from mention menu
  const handlePropertySelect = (property: Property) => {
    const cursorPosition = textareaRef.current?.selectionStart || 0;
    const textBeforeCursor = inputValue.substring(0, cursorPosition);
    const textAfterCursor = inputValue.substring(cursorPosition);
    const atIndex = textBeforeCursor.lastIndexOf('@');
    
    const beforeMention = inputValue.substring(0, atIndex);
    const newValue = beforeMention + `@${property.title}` + textAfterCursor;
    
    onInputChange(newValue);
    setShowMentionMenu(false);
    setMentionedProperties(prev => new Set([...prev, property.id]));
    
    // Focus back on textarea
    textareaRef.current?.focus();
  };

  // Handle keyboard navigation in mention menu
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (showMentionMenu && filteredProperties.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedMentionIndex(prev => 
          prev < filteredProperties.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedMentionIndex(prev => prev > 0 ? prev - 1 : prev);
      } else if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        handlePropertySelect(filteredProperties[selectedMentionIndex]);
      } else if (e.key === 'Escape') {
        setShowMentionMenu(false);
      }
    }
  };

  // Remove a mentioned property
  const handleRemoveMention = (propertyTitle: string) => {
    const newValue = inputValue.replace(`@${propertyTitle}`, '');
    onInputChange(newValue);
  };

  // Parse message text to find mentions
  const renderMessageWithMentions = (text: string) => {
    const mentionRegex = /@([^@\s]+(?:\s+[^@\s]+)*)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = mentionRegex.exec(text)) !== null) {
      // Add text before mention
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      
      // Add mention as a clickable badge
      const mentionText = match[1];
      const property = recommendedProperties.find(p => p.title === mentionText);
      
      parts.push(
        <span
          key={match.index}
          className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-200 text-gray-800 rounded-md text-sm cursor-pointer hover:bg-gray-300"
          onClick={() => property && onPropertyClick?.(property.id)}
        >
          @{mentionText}
        </span>
      );
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }
    
    return parts.length > 0 ? parts : text;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      onInputChange("");
      setMentionedProperties(new Set());
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
                      {message.text.includes('@') && message.sender === "user" ? (
                        <div>{renderMessageWithMentions(message.text)}</div>
                      ) : (
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.text}</ReactMarkdown>
                      )}
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
      <div className="border-t border-border p-4 bg-background flex-shrink-0 relative">
        {/* Mention Menu */}
        {showMentionMenu && filteredProperties.length > 0 && (
          <div 
            className="absolute bottom-full mb-2 left-4 right-20 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto z-50"
            style={{ maxWidth: '600px' }}
          >
            <div className="p-2">
              <div className="text-xs text-gray-500 px-2 py-1 font-medium">
                Select a property to mention:
              </div>
              {filteredProperties.map((property, index) => (
                <button
                  key={property.id}
                  type="button"
                  onClick={() => handlePropertySelect(property)}
                  className={`w-full flex items-center gap-3 p-2 rounded hover:bg-gray-100 transition-colors ${
                    index === selectedMentionIndex ? 'bg-blue-50' : ''
                  }`}
                >
                  <img 
                    src={property.image} 
                    alt={property.title}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium text-gray-900">{property.title}</div>
                    <div className="text-xs text-gray-500">{property.location}</div>
                  </div>
                  <div className="text-sm font-semibold text-gray-700">{property.price}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex items-end space-x-3">
          <div className="flex-1">
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me about properties... (use @ to mention properties)"
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

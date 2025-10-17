import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mic, Send, Bot, User, X } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
  type?: "text" | "property-recommendation" | "question";
}

interface AIChatInterfaceProps {
  onClose: () => void;
  initialQuery?: string;
  onAddMessage?: (message: Message) => void;
}

export function AIChatInterface({ onClose, initialQuery }: AIChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: `ai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text: "Hi! I'm your AI real estate agent. I can help you find the perfect property. What are you looking for?",
      sender: "ai",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasProcessedInitialQuery = useRef(false);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle initial query if provided
  useEffect(() => {
    if (initialQuery && !hasProcessedInitialQuery.current) {
      hasProcessedInitialQuery.current = true;
      handleUserMessage(initialQuery);
    }
  }, [initialQuery]);

  const handleUserMessage = (text: string) => {
    const userMessage: Message = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(text);
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const generateAIResponse = (userInput: string): Message => {
    const responses = [
      "I've found some great properties that match your criteria! Let me show you the best options.",
      "Based on your preferences, I've curated a selection of properties that should interest you.",
      "I've analyzed the market and found several properties that align with what you're looking for.",
      "Great choice! I've identified some excellent properties in that area with the features you want."
    ];

    const followUpQuestions = [
      "What's your budget range?",
      "How many bedrooms do you need?",
      "Are you looking for a specific neighborhood?",
      "Do you have any must-have features?",
      "Are you a first-time buyer?",
      "What's your timeline for purchasing?"
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    const randomQuestion = followUpQuestions[Math.floor(Math.random() * followUpQuestions.length)];

    return {
      id: `ai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text: `${randomResponse}\n\n${randomQuestion}`,
      sender: "ai",
      timestamp: new Date()
    };
  };

  const isPropertyQuery = (text: string): boolean => {
    const propertyKeywords = ['house', 'home', 'property', 'apartment', 'condo', 'buy', 'purchase', 'real estate'];
    return propertyKeywords.some(keyword => text.toLowerCase().includes(keyword));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      handleUserMessage(inputValue);
    }
  };

  const handleVoiceToggle = () => {
    setIsVoiceActive(!isVoiceActive);
    // Here you would integrate with speech recognition API
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div>
          <h2 className="text-lg font-semibold">AI Pilot</h2>
          <p className="text-sm text-muted-foreground">Your Smart Agent</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-8 w-8 p-0"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 min-h-0">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className={`flex items-start space-x-2 max-w-[85%] ${message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""}`}>
              <Avatar className="w-8 h-8 flex-shrink-0">
                <AvatarFallback className="text-xs">
                  {message.sender === "ai" ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </AvatarFallback>
              </Avatar>
              <Card className={`${message.sender === "user" ? "bg-gray-100 text-gray-900" : "bg-background"} max-w-full !py-3 border-0`}>
                <CardContent className="!px-3 !py-0">
                  <p className="text-sm break-words whitespace-pre-wrap">{message.text}</p>
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
      <div className="border-t border-border p-4 bg-background">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask me about properties..."
            className="flex-1"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleVoiceToggle}
            className={`h-8 w-8 p-0 ${isVoiceActive ? 'bg-primary text-primary-foreground' : ''}`}
          >
            <Mic className="w-4 h-4" />
          </Button>
          <Button
            type="submit"
            size="sm"
            className="h-8 w-8 p-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
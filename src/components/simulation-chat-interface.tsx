import React, { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, User, X, Loader2 } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
  type?: "text" | "thinking";
}

interface SimulationChatInterfaceProps {
  onClose: () => void;
  messages: Message[];
  isSimulating?: boolean;
}

export function SimulationChatInterface({ onClose, messages, isSimulating = false }: SimulationChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
        {messages.length === 0 && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-2 max-w-[85%]">
              <Avatar className="w-8 h-8 flex-shrink-0">
                <AvatarFallback className="text-xs">
                  <Bot className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <Card className="bg-background max-w-full !py-3 border-0">
                <CardContent className="!px-3 !py-0">
                  <p className="text-sm">Hi! I&apos;m your AI real estate agent. I can help you find the perfect property. What are you looking for?</p>
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
            <div className={`flex items-start space-x-2 max-w-[85%] ${message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""}`}>
              <Avatar className="w-8 h-8 flex-shrink-0">
                <AvatarFallback className="text-xs">
                  {message.sender === "ai" ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </AvatarFallback>
              </Avatar>
              <Card className={`${message.sender === "user" ? "bg-gray-100 text-gray-900" : "bg-background"} max-w-full !py-3 border-0`}>
                <CardContent className="!px-3 !py-0">
                  {message.type === "thinking" ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <p className="text-sm italic text-muted-foreground">{message.text}</p>
                    </div>
                  ) : (
                    <p className="text-sm break-words whitespace-pre-wrap">{message.text}</p>
                  )}
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        ))}
        
        {isSimulating && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-2 max-w-[85%]">
              <Avatar className="w-8 h-8 flex-shrink-0">
                <AvatarFallback className="text-xs">
                  <Bot className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <Card className="bg-background max-w-full !py-3 border-0">
                <CardContent className="!px-3 !py-0">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <p className="text-sm italic text-muted-foreground">Thinking...</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

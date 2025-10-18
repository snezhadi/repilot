"use client";

import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Mic, 
  Home,
  Heart,
  FileText,
  BarChart3,
  ShoppingBag
} from "lucide-react";
import { Logo } from "@/components/logo";
import { CustomSidebar } from "@/components/custom-sidebar";
import { PropertyCard } from "@/components/property-card";
import { AIChatInterface } from "@/components/ai-chat-interface";
import { SimulationChatInterface } from "@/components/simulation-chat-interface";
import { FullscreenChatInterface } from "@/components/fullscreen-chat-interface";
import { RecommendationsSidebar } from "@/components/recommendations-sidebar";
import { PropertyDetailsPopup } from "@/components/property-details-popup";

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

function HomePageContent() {
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
  const [sidebarWidth, setSidebarWidth] = useState(480); // Default 30rem = 480px
  const [isResizing, setIsResizing] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [isPropertyPopupOpen, setIsPropertyPopupOpen] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  // Function to load chat from history
  const loadChatFromHistory = useCallback((chatId: string) => {
    // Mock data for different chat sessions
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
        properties: richmondHillDetachedHomes,
        propertySet: "richmond-detached"
      },
      // ... other chat data would be here
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

  // Check for chat ID from URL or existing state when component mounts
  useEffect(() => {
    const chatId = searchParams.get('chatId');
    
    if (chatId) {
      // Load chat from history
      loadChatFromHistory(chatId);
    } else {
      // Check for existing state
      const savedState = localStorage.getItem('repilot-home-state');
      if (savedState) {
        try {
          const state = JSON.parse(savedState);
          if (state.showChatSidebar) {
            setShowChatSidebar(true);
          }
          if (state.searchQuery) {
            setSearchQuery(state.searchQuery);
          }
          if (state.properties && state.properties.length > 0) {
            setProperties(state.properties);
          }
        } catch (error) {
          console.error('Error loading saved state:', error);
        }
      }
    }
  }, [searchParams, loadChatFromHistory]);

  const quickActions = [
    { 
      icon: Search, 
      label: "Search Properties", 
      color: "bg-purple-100 text-purple-700",
      conversation: [
        "Looking for a detached house in Richmond Hill, preferably in Bayview Secondary zone, and easy access to Hwy 404.",
        "Around $1.2M, 3 bedrooms.",
        "None of these work.",
        "Too expensive and not close enough to the school.",
        "Yeah, show me townhouses.",
        "Before I decide, can you compare townhouse and detached homes in terms of prices over time?",
        "Makes sense. Let's visit 88 Bantry Ave #5.",
        "12:30 works.",
        "Can you compare @Stunning Detached Home - Bayview Area to @Elegant Townhouse - Bayview Zone?"
      ]
    },
    { 
      icon: Home, 
      label: "First Time Buyer", 
      color: "bg-blue-100 text-blue-700",
      conversation: [
        "Hi! I'm a first-time homebuyer and I'm feeling overwhelmed by the whole process.",
        "My budget is around $400,000. I want to make sure I'm not overextending myself financially.",
        "I'm looking for a safe neighborhood with good schools nearby. I also work from home, so I need a quiet space for my office.",
        "What else should I be looking for in terms of location and features? Any tips for someone just starting out?"
      ]
    },
    { 
      icon: Heart, 
      label: "Investment Property", 
      color: "bg-red-100 text-red-700",
      conversation: [
        "I'm interested in buying an investment property to generate rental income.",
        "My budget is around $600,000 and I'm looking for properties in areas with high rental demand.",
        "I want something that can generate at least 6% annual return on investment.",
        "What areas would you recommend? Should I focus on condos or single-family homes?"
      ]
    },
    { 
      icon: FileText, 
      label: "Market Analysis", 
      color: "bg-green-100 text-green-700",
      conversation: [
        "Can you help me understand the current real estate market trends?",
        "I'm specifically interested in the downtown area and how prices have changed over the past year.",
        "Are we in a buyer's market or seller's market right now?",
        "What do you think about the future outlook for property values in this region?"
      ]
    },
    { 
      icon: ShoppingBag, 
      label: "Rental Income", 
      color: "bg-orange-100 text-orange-700",
      conversation: [
        "I'm looking for a property that can generate solid rental income while I live there.",
        "I'm considering a duplex or a property with an in-law suite that I could rent out.",
        "My budget is around $500,000 and I want to live in one unit and rent the other.",
        "What kind of rental income should I expect? Any advice on finding good tenants?"
      ]
    },
  ];

  const handleVoiceToggle = () => {
    setIsVoiceActive(!isVoiceActive);
    // Here you would integrate with speech recognition API
  };

  // Resize handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return;
    
    const newWidth = window.innerWidth - e.clientX;
    const minWidth = 320; // Minimum width for sidebar
    const maxWidth = window.innerWidth * 0.6; // Maximum 60% of screen width
    
    if (newWidth >= minWidth && newWidth <= maxWidth) {
      setSidebarWidth(newWidth);
    }
  }, [isResizing]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  // Add mouse event listeners
  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  const simulateConversation = async (conversation: string[]) => {
    // Clear input and reset state
    setInputValue("");
    setProperties([]);
    setSearchQuery("");
    setChatMessages([]);
    setShowRecommendations(false);
    setIsSimulating(true);
    
    // Start the conversation simulation
    for (let i = 0; i < conversation.length; i++) {
      const userMessage = conversation[i];
      
      // For the first message, show it on main page before transitioning
      if (i === 0) {
        // Type out the first message in the main input
        for (let j = 0; j <= userMessage.length; j++) {
          setInputValue(userMessage.substring(0, j));
          await new Promise(resolve => setTimeout(resolve, 30));
        }
        
        // Wait a moment, then transition to chat mode
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Start chat mode and add user message
        setIsInChatMode(true);
        const userMsg = {
          id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          text: userMessage,
          sender: "user" as const,
          timestamp: new Date()
        };
        setChatMessages([userMsg]);
        setInputValue(""); // Clear input after adding to chat
      } else {
        // For subsequent messages, type them in the chat input box
        setInputValue("");
        for (let j = 0; j <= userMessage.length; j++) {
          setInputValue(userMessage.substring(0, j));
          await new Promise(resolve => setTimeout(resolve, 30));
        }
        
        // Wait a moment to simulate user reading before pressing Enter
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Add message to chat (simulate pressing Enter)
        const userMsg = {
          id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          text: userMessage,
          sender: "user" as const,
          timestamp: new Date()
        };
        setChatMessages(prev => [...prev, userMsg]);
        
        // Clear input after adding to chat (simulate Enter being pressed)
        setInputValue("");
      }
      
      // Wait before AI response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate and simulate AI response
      await simulateAIResponse(userMessage, i);
      
      // Wait before next user message
      if (i < conversation.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
    }
    
    // End simulation and show recommendations after final response
    setIsSimulating(false);
    setTimeout(() => {
      // Only show recommendations if the last message was about tips/guidance
      const lastMessage = conversation[conversation.length - 1];
      if (lastMessage.toLowerCase().includes("tips") || lastMessage.toLowerCase().includes("starting out") || lastMessage.toLowerCase().includes("looking for")) {
        // Add recommendation message to chat
        const recommendationMsg = {
          id: `ai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          text: "Based on your $400k budget and preferences for safe neighborhoods with good schools and home office space, I've found some excellent options.",
          sender: "ai" as const,
          timestamp: new Date(),
          type: "recommendations" as const
        };
        setChatMessages(prev => [...prev, recommendationMsg]);
        
        // Automatically show recommendations sidebar when recommendation message is added
        setShowRecommendations(true);
        setProperties(mockProperties);
      }
    }, 2000);
  };

  const simulateAIResponse = async (userMessage: string, messageIndex: number) => {
    // Generate contextual AI responses based on the user message
    const aiResponses = generateAIResponses(userMessage, messageIndex);
    
    for (let i = 0; i < aiResponses.length; i++) {
      const response = aiResponses[i];
      
      // Only show thinking indicator for responses that involve searching/analyzing
      const shouldShowThinking = shouldShowThinkingIndicator(userMessage, response, i);
      
      if (shouldShowThinking) {
        await simulateAIThinking();
      }
      
      // Add AI response to chat
      const aiMsg: Message = {
        id: `ai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        text: response,
        sender: "ai" as const,
        timestamp: new Date(),
        type: response.includes("showing confirmed") ? "showing-confirmed" as const : undefined
      };
      setChatMessages(prev => [...prev, aiMsg]);
      
      // Handle property recommendations based on conversation flow
      if (response.includes("Got it. Here are some initial recommendations")) {
        // Show thinking indicator first
        setTimeout(() => {
          const thinkingMsg = {
            id: `ai-thinking-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            text: "Searching for detached homes in Richmond Hill that match your criteria...",
            sender: "ai" as const,
            timestamp: new Date(),
            type: "thinking" as const
          };
          setChatMessages(prev => [...prev, thinkingMsg]);
          
          // Remove thinking message after delay and show recommendations
          setTimeout(() => {
            setChatMessages(prev => prev.filter(msg => msg.id !== thinkingMsg.id));
            
            // Add recommendation message with blue box
            const recommendationMsg = {
              id: `ai-rec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              text: "Based on your $1.2M budget and 3-bedroom requirement, I've found some excellent detached homes in Richmond Hill.",
              sender: "ai" as const,
              timestamp: new Date(),
              type: "recommendations" as const,
              propertySet: "richmond-detached" as const
            };
            setChatMessages(prev => [...prev, recommendationMsg]);
            
            setPropertySet('richmond-detached');
            setShowRecommendations(true);
            setProperties(richmondHillDetachedHomes);
          }, 1500);
        }, 500);
      } else if (response.includes("Here are townhouse options under $1.2M")) {
        // Show thinking indicator first
        setTimeout(() => {
          const thinkingMsg = {
            id: `ai-thinking-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            text: "Searching for townhouses in Richmond Hill within your budget...",
            sender: "ai" as const,
            timestamp: new Date(),
            type: "thinking" as const
          };
          setChatMessages(prev => [...prev, thinkingMsg]);
          
          // Remove thinking message after delay and show recommendations
          setTimeout(() => {
            setChatMessages(prev => prev.filter(msg => msg.id !== thinkingMsg.id));
            
            // Add recommendation message with blue box
            const recommendationMsg = {
              id: `ai-rec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              text: "Here are townhouse options that fit your $1.2M budget perfectly, with easy access to Bayview Secondary.",
              sender: "ai" as const,
              timestamp: new Date(),
              type: "recommendations" as const,
              propertySet: "richmond-townhouses" as const
            };
            setChatMessages(prev => [...prev, recommendationMsg]);
            
            setPropertySet('richmond-townhouses');
            setShowRecommendations(true);
            setProperties(richmondHillTownhouses);
          }, 1500);
        }, 500);
      } else if (response.includes("5-year price comparison")) {
        setTimeout(() => {
          // Add chart message
          const chartMsg = {
            id: `ai-chart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            text: "📊 Price Comparison Chart",
            sender: "ai" as const,
            timestamp: new Date(),
            type: "price-chart" as const
          };
          setChatMessages(prev => [...prev, chartMsg]);
        }, 1000);
      } else if (userMessage.toLowerCase().includes("visit 88 bantry ave") || userMessage.toLowerCase().includes("bantry ave #5") || userMessage.toLowerCase().includes("let's visit")) {
        setTimeout(() => {
          // Add showing slots message
          const slotsMsg = {
            id: `ai-slots-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            text: "Available Showing Times",
            sender: "ai" as const,
            timestamp: new Date(),
            type: "showing-slots" as const
          };
          setChatMessages(prev => [...prev, slotsMsg]);
        }, 1000);
      }
      
      // Wait between responses (except for the last one)
      if (i < aiResponses.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  };

  const shouldShowThinkingIndicator = (userMessage: string, response: string, responseIndex: number): boolean => {
    // Don't show thinking for simple empathetic responses
    const empatheticResponses = [
      "I completely understand!",
      "That's a great question!",
      "Great question!",
      "Excellent question!"
    ];
    
    // Check if this is an empathetic response
    const isEmpathetic = empatheticResponses.some(phrase => response.includes(phrase));
    if (isEmpathetic) {
      return false;
    }
    
    // Show thinking for responses that mention searching, analyzing, or finding
    const searchKeywords = [
      "searching",
      "analyzing", 
      "found some",
      "found some excellent",
      "I've found",
      "I've identified",
      "Let me show you",
      "Here are my top recommendations",
      "Based on current market trends",
      "Here's what the data shows",
      "Here are some initial recommendations",
      "Here are townhouse options",
      "Based on your $1.2M budget"
    ];
    
    return searchKeywords.some(keyword => response.toLowerCase().includes(keyword));
  };

  const simulateAIThinking = async () => {
    const thinkingMessages = [
      "Analyzing your requirements...",
      "Searching property database...",
      "Evaluating market conditions...",
      "Calculating recommendations...",
      "Reviewing neighborhood data...",
      "Processing your preferences..."
    ];
    
    const thinkingMessage = thinkingMessages[Math.floor(Math.random() * thinkingMessages.length)];
    
    // Add temporary thinking message
    const thinkingMsg = {
      id: `thinking-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text: thinkingMessage,
      sender: "ai" as const,
      timestamp: new Date(),
      type: "thinking" as const
    };
    setChatMessages(prev => [...prev, thinkingMsg]);
    
    // Simulate thinking time
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));
    
    // Remove thinking message after delay
    setChatMessages(prev => prev.filter(msg => msg.id !== thinkingMsg.id));
  };

  const generateAIResponses = (userMessage: string, messageIndex: number): string[] => {
    // Generate contextual AI responses based on user message content
    const responses: string[] = [];
    
    // Richmond Hill Price Comparison conversation script
    if (userMessage.toLowerCase().includes("richmond hill") || userMessage.toLowerCase().includes("bayview secondary") || userMessage.toLowerCase().includes("hwy 404")) {
      responses.push("Nice choice. What's your approximate budget and how many rooms do you need?");
    } else if (userMessage.toLowerCase().includes("1.2m") || userMessage.toLowerCase().includes("3 bedrooms")) {
      responses.push("Got it. Here are some initial recommendations.");
    } else if (userMessage.toLowerCase().includes("none of these work")) {
      responses.push("Got it. Could you tell me what didn't work? (Too expensive, wrong area, etc.)");
    } else if (userMessage.toLowerCase().includes("too expensive") || userMessage.toLowerCase().includes("not close enough to the school")) {
      responses.push("Homes near Bayview Secondary usually start around $1.5M+. You could look north in Aurora or consider a townhouse in Richmond Hill. Want to see those?");
    } else if (userMessage.toLowerCase().includes("show me townhouses") || userMessage.toLowerCase().includes("yeah, show me townhouses")) {
      responses.push("Here are townhouse options under $1.2M.");
    } else if (userMessage.toLowerCase().includes("compare townhouse and detached homes") || userMessage.toLowerCase().includes("prices over time")) {
      responses.push("Absolutely — here's a 5-year price comparison for Richmond Hill.\n\nDetached homes grew +24% over 5 years, while townhouses rose +22%. Detached appreciate faster but need higher investment. Townhouses are steadier, lower risk, easier to rent.");
    } else if (userMessage.toLowerCase().includes("visit 88 bantry ave") || userMessage.toLowerCase().includes("bantry ave #5") || userMessage.toLowerCase().includes("let's visit")) {
      responses.push("Added to your showing list!");
    } else if (userMessage.toLowerCase().includes("12:30 works")) {
      responses.push("Perfect — showing confirmed for 12:30 PM.");
    } else if (userMessage.includes("@") && (userMessage.toLowerCase().includes("compare") || userMessage.toLowerCase().includes("comparison"))) {
      responses.push("Great question! Here's a detailed comparison of these two properties:\n\n| Feature | Stunning Detached Home - Bayview Area | Elegant Townhouse - Bayview Zone |\n|---------|---------------------------------------|-----------------------------------|\n| **Price** | $1,450,000 | $980,000 |\n| **Type** | Detached | Townhouse |\n| **Bedrooms** | 4 | 3 |\n| **Bathrooms** | 3 | 2 |\n| **Square Feet** | 3,200 sq ft | 2,100 sq ft |\n| **Lot Size** | 50' x 120' | 25' x 100' |\n| **Property Tax (Annual)** | ~$8,700 | ~$5,900 |\n| **Maintenance** | Full responsibility | Shared (condo fees: $350/mo) |\n| **Parking** | 2-car garage + driveway | 2-car garage |\n| **Outdoor Space** | Large backyard | Small patio |\n| **Price/sq ft** | $453 | $467 |\n| **School Distance** | 5-min drive | 5-min drive |\n| **Hwy 404 Access** | 5-min drive | 6-min drive |\n| **Appreciation (5yr)** | Higher potential (+24%) | Moderate (+22%) |\n| **Rental Potential** | $3,800-4,200/mo | $2,800-3,100/mo |\n| **Resale Demand** | Very High | High |\n\n**Key Takeaways:**\n• The detached home costs $470K more but offers 1,100 sq ft extra space\n• Townhouse has lower property tax and ongoing costs\n• Both have excellent school access and highway proximity\n• Detached home has stronger appreciation and rental potential\n• Townhouse requires less maintenance with condo fees included");
    }
    // Original conversation scripts
    else if (userMessage.toLowerCase().includes("first-time") || userMessage.toLowerCase().includes("overwhelmed")) {
      responses.push("I completely understand! Let me guide you through this step by step.\n\nFirst, what's your budget range? This helps me narrow down the best options for you.");
    } else if (userMessage.toLowerCase().includes("budget") || userMessage.toLowerCase().includes("400,000") || userMessage.toLowerCase().includes("financially")) {
      responses.push("Solid budget! $400,000 gives us great options in family-friendly neighborhoods. Smart to be mindful of not overextending yourself.\n\nWhat's most important to you - location, school district, or specific features?");
    } else if (userMessage.toLowerCase().includes("neighborhood") || userMessage.toLowerCase().includes("schools") || userMessage.toLowerCase().includes("work from home")) {
      responses.push("Perfect priorities! Safety, good schools, and a quiet workspace are exactly what first-time buyers should focus on.\n\nWhat else should I know about your preferences?");
    } else if (userMessage.toLowerCase().includes("tips") || userMessage.toLowerCase().includes("starting out") || userMessage.toLowerCase().includes("looking for")) {
      responses.push("Here's what I recommend for first-time buyers:\n\n| Aspect | Recommendation | Why It Matters |\n|--------|----------------|----------------|\n| **Location** | Choose location first | You can change almost everything about a house, but not its location |\n| **Property Type** | Consider your lifestyle | Different types suit different needs and budgets |\n| | • **Detached homes**: More privacy, higher maintenance | Best for families wanting space and privacy |\n| | • **Townhouses**: Good balance of space and affordability | Great middle ground with shared walls but more space than condos |\n| | • **Condos**: Lower maintenance, but HOA fees | Ideal for busy professionals who want convenience |\n| **Future Planning** | Plan for kids and growth | School districts become crucial if you're planning a family |\n| **Pre-approval** | Get mortgage pre-approved first | Shows sellers you're serious and clarifies your budget |\n| **Additional Costs** | Factor in all expenses | Property taxes, HOA fees, closing costs, and maintenance add up |");
    } else if (userMessage.toLowerCase().includes("investment") || userMessage.toLowerCase().includes("rental")) {
      responses.push("Great question! Investment properties can be excellent wealth-building tools.\n\nBased on current market trends, I'm seeing strong rental demand in several neighborhoods. Properties in the $600,000 range typically generate 6-8% annual returns here.\n\nI've identified some duplexes and properties with rental potential that should meet your ROI goals. Let me show you the numbers and rental income projections.");
    } else if (userMessage.toLowerCase().includes("market") || userMessage.toLowerCase().includes("trends")) {
      responses.push("Here's the latest market data for your area:\n\n**Current Market**: Balanced with slight favor toward buyers\n**Downtown Prices**: +8% year-over-year\n**Inventory**: Growing\n**Average Days on Market**: 28 days\n**Price per Sq Ft**: $285\n**Strong Appreciation**: Walkable neighborhoods\n\nWhat specific area interests you most?");
    } else if (userMessage.toLowerCase().includes("comparison") || userMessage.toLowerCase().includes("price")) {
      responses.push("Price comparison is crucial for informed decisions. The differences you're seeing are typically driven by:\n\n• **Location & School Districts**\n• **Walkability Scores**\n• **Local Amenities**\n• **Future Development Plans**\n\nI've created a detailed comparison showing price per square foot, neighborhood amenities, and future appreciation potential. This should help you understand which areas offer the best value.");
    } else {
      responses.push("Let me analyze your requirements and find the best options for you.");
    }
    
    return responses;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      // Start chat mode
      setIsInChatMode(true);
      setSearchQuery(inputValue);
      
      // Add initial user message
      const userMessage = {
        id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        text: inputValue,
        sender: "user" as const,
        timestamp: new Date()
      };
      setChatMessages([userMessage]);
      
      // Clear input
      setInputValue("");
      
      // Simulate AI response after delay
      setTimeout(() => {
        const aiMessage = {
          id: `ai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          text: "I've found some great properties that match your criteria! Let me show you the best options.",
          sender: "ai" as const,
          timestamp: new Date()
        };
        setChatMessages(prev => [...prev, aiMessage]);
        
        // Show recommendations after AI response
        setTimeout(() => {
          setShowRecommendations(true);
          setProperties(mockProperties);
        }, 2000);
      }, 1500);
    }
  };

  const handleChatMessage = (message: string) => {
    // Add user message
    const userMessage = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text: message,
      sender: "user" as const,
      timestamp: new Date()
    };
    setChatMessages(prev => [...prev, userMessage]);
    
    // Simulate AI response
    setTimeout(() => {
      const aiMessage = {
        id: `ai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        text: "Thanks for that information! I'm analyzing your preferences and will show you updated recommendations.",
        sender: "ai" as const,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  const handleBackToHome = () => {
    setIsInChatMode(false);
    setChatMessages([]);
    setShowRecommendations(false);
    setProperties([]);
    setSearchQuery("");
  };

  const handleRecommendationClick = (clickedPropertySet?: "default" | "richmond-detached" | "richmond-townhouses") => {
    setShowRecommendations(true);
    // Use the property set from the clicked recommendation box
    if (clickedPropertySet === 'richmond-detached') {
      setProperties(richmondHillDetachedHomes);
      setPropertySet('richmond-detached');
    } else if (clickedPropertySet === 'richmond-townhouses') {
      setProperties(richmondHillTownhouses);
      setPropertySet('richmond-townhouses');
    } else {
      setProperties(mockProperties);
      setPropertySet('default');
    }
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
    // Set the input value to include the property mention
    setInputValue(`@${propertyTitle} `);
    
    // If not in chat mode yet, enter it
    if (!isInChatMode) {
      setIsInChatMode(true);
    }
  };

  const handleWatchlistToggle = (propertyId: string) => {
    setProperties(prev => 
      prev.map(property => 
        property.id === propertyId 
          ? { ...property, isWatched: !property.isWatched }
          : property
      )
    );
  };

  const handleRemoveProperty = (propertyId: string) => {
    setProperties(prev => prev.filter(property => property.id !== propertyId));
  };

  // Save state to localStorage whenever it changes
  useEffect(() => {
    const stateToSave = {
      showChatSidebar,
      searchQuery,
      properties
    };
    localStorage.setItem('repilot-home-state', JSON.stringify(stateToSave));
  }, [showChatSidebar, searchQuery, properties]);

  const clearState = () => {
    setShowChatSidebar(false);
    setIsInChatMode(false);
    setProperties([]);
    setSearchQuery("");
    setPropertySet('default');
    localStorage.removeItem('repilot-home-state');
  };

  const mockProperties = [
    {
      id: "1",
      title: "Modern Family Home with Mountain Views",
      price: "$750,000",
      location: "Downtown District",
      bedrooms: 4,
      bathrooms: 3,
      sqft: 2800,
      image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop",
      matchScore: 92,
      aiReason: "Perfect for families with excellent schools nearby and spacious layout for growing families. The mountain views and modern amenities make this an ideal family home.",
      isWatched: false
    },
    {
      id: "2",
      title: "Luxury Condo with City Views",
      price: "$650,000",
      location: "City Center",
      bedrooms: 3,
      bathrooms: 2,
      sqft: 1800,
      image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop",
      matchScore: 85,
      aiReason: "Great investment opportunity with high rental potential. Modern amenities and prime location make this perfect for young professionals.",
      isWatched: false
    },
    {
      id: "3",
      title: "Charming Suburban House",
      price: "$520,000",
      location: "Suburban Heights",
      bedrooms: 3,
      bathrooms: 2,
      sqft: 2200,
      image: "https://images.unsplash.com/photo-1600596542815-ffade4c69d0a?w=400&h=300&fit=crop",
      matchScore: 78,
      aiReason: "Excellent value for money with a large backyard perfect for families. Quiet neighborhood with good schools nearby.",
      isWatched: false
    }
  ];

  const richmondHillDetachedHomes = [
    {
      id: "rh1",
      title: "Stunning Detached Home - Bayview Area",
      price: "$1,450,000",
      location: "Richmond Hill, Bayview Secondary Zone",
      bedrooms: 4,
      bathrooms: 3,
      sqft: 3200,
      image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop",
      matchScore: 88,
      aiReason: "Premium location within Bayview Secondary zone. 5-minute drive to Hwy 404. Modern kitchen, finished basement, and large backyard.",
      isWatched: false
    },
    {
      id: "rh2",
      title: "Elegant Family Residence",
      price: "$1,380,000",
      location: "Richmond Hill, Near Bayview Secondary",
      bedrooms: 3,
      bathrooms: 2,
      sqft: 2800,
      image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop",
      matchScore: 82,
      aiReason: "Walking distance to Bayview Secondary. Recently renovated kitchen and bathrooms. Easy access to Hwy 404.",
      isWatched: false
    },
    {
      id: "rh3",
      title: "Spacious Detached Home",
      price: "$1,520,000",
      location: "Richmond Hill, Bayview Secondary Zone",
      bedrooms: 4,
      bathrooms: 4,
      sqft: 3500,
      image: "https://images.unsplash.com/photo-1600596542815-ffade4c69d0a?w=400&h=300&fit=crop",
      matchScore: 85,
      aiReason: "Premium detached home with in-law suite. Minutes to Bayview Secondary and Hwy 404. Perfect for growing families.",
      isWatched: false
    },
    {
      id: "rh4",
      title: "Modern Detached with Pool",
      price: "$1,650,000",
      location: "Richmond Hill, Bayview Secondary Zone",
      bedrooms: 5,
      bathrooms: 4,
      sqft: 3800,
      image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop",
      matchScore: 90,
      aiReason: "Luxury home with in-ground pool and premium finishes. Within Bayview Secondary catchment area. 3-minute drive to Hwy 404.",
      isWatched: false
    }
  ];

  const richmondHillTownhouses = [
    {
      id: "th1",
      title: "Modern Townhouse - 88 Bantry Ave #5",
      price: "$950,000",
      location: "Richmond Hill, Near Bayview Secondary",
      bedrooms: 3,
      bathrooms: 3,
      sqft: 1800,
      image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop",
      matchScore: 92,
      aiReason: "Excellent townhouse option under $1.2M budget. 10-minute drive to Bayview Secondary, easy Hwy 404 access. Modern finishes throughout.",
      isWatched: false
    },
    {
      id: "th2",
      title: "End-Unit Townhouse with Garage",
      price: "$875,000",
      location: "Richmond Hill, Near Hwy 404",
      bedrooms: 3,
      bathrooms: 2,
      sqft: 1650,
      image: "https://images.unsplash.com/photo-1600596542815-ffade4c69d0a?w=400&h=300&fit=crop",
      matchScore: 88,
      aiReason: "End-unit townhouse with extra windows and privacy. Within budget, good schools nearby, 5-minute drive to Hwy 404.",
      isWatched: false
    },
    {
      id: "th3",
      title: "Spacious Townhouse Complex",
      price: "$920,000",
      location: "Richmond Hill, Family-Friendly Area",
      bedrooms: 3,
      bathrooms: 3,
      sqft: 1750,
      image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop",
      matchScore: 85,
      aiReason: "Well-maintained townhouse in established neighborhood. Good schools, parks nearby, reasonable commute to Bayview Secondary.",
      isWatched: false
    },
    {
      id: "th4",
      title: "Updated Townhouse with Patio",
      price: "$890,000",
      location: "Richmond Hill, Quiet Street",
      bedrooms: 3,
      bathrooms: 2,
      sqft: 1600,
      image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop",
      matchScore: 87,
      aiReason: "Recently updated townhouse with private patio. Under budget, good location for families, convenient to highways.",
      isWatched: false
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Custom Sidebar */}
      <CustomSidebar activePage="home" onHomeClick={clearState} />

      {/* Main Content */}
      <div 
        className="ml-16 transition-all duration-300 min-h-screen flex flex-col"
        style={{ width: showRecommendations ? `calc(100vw - ${sidebarWidth}px - 4rem)` : 'calc(100vw - 4rem)' }}
      >
        {/* Header - Only show when not in chat mode */}
        {!isInChatMode && (
          <header className="flex flex-col items-center justify-center py-8 space-y-2 mt-16">
            {/* Logo */}
            <div className="flex flex-col items-center space-y-2">
              <Logo size="lg" className="w-64 h-32" />
            </div>
            
            {/* Tagline */}
            <p className="text-lg text-muted-foreground font-medium">
              Your AI pilot for smart home buying
            </p>
          </header>
        )}

        {/* Main Content Area */}
        <main className="flex-1">
          {isInChatMode ? (
            /* Chat Interface */
            <FullscreenChatInterface
              messages={chatMessages}
              onSendMessage={handleChatMessage}
              onBackToHome={handleBackToHome}
              inputValue={inputValue}
              onInputChange={setInputValue}
              isVoiceActive={isVoiceActive}
              onVoiceToggle={handleVoiceToggle}
              isSimulating={isSimulating}
              onRecommendationClick={handleRecommendationClick}
              recommendedProperties={properties}
              onPropertyClick={handlePropertyClick}
            />
          ) : (
            /* Search Interface */
            <div className="flex flex-col items-center justify-center h-full px-4">
              <div className="w-full max-w-2xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Input Bar */}
                  <div className="relative">
                    <textarea
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Tell me what you're looking for in a home..."
                      className="w-full h-24 text-lg pr-20 p-3 border border-input bg-background rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      rows={4}
                    />

                    {/* Right Side Controls */}
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 space-x-2">
                      <Button
                        type="button"
                        size="sm"
                        variant={isVoiceActive ? "default" : "ghost"}
                        onClick={handleVoiceToggle}
                        className="h-8 w-8 p-0"
                      >
                        <Mic className="w-4 h-4" />
                      </Button>
                      <Button
                        type="submit"
                        size="sm"
                        variant="default"
                        className="h-8 w-8 p-0"
                      >
                        <Search className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex flex-wrap justify-center gap-3">
                    {quickActions.map((action, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className={`quick-action ${action.color} border-0 hover:scale-105`}
                        onClick={() => simulateConversation(action.conversation)}
                      >
                        <action.icon className="w-4 h-4 mr-2" />
                        {action.label}
                      </Button>
                    ))}
                  </div>
                </form>
              </div>
        </div>
          )}
      </main>
      </div>

      {/* Recommendations Sidebar */}
      {showRecommendations && properties.length > 0 && (
        <>
          {/* Resize Handle */}
          <div
            className="fixed right-0 top-0 h-full w-1 bg-border hover:bg-primary/50 cursor-col-resize z-10 flex items-center justify-center group"
            style={{ right: `${sidebarWidth}px` }}
            onMouseDown={handleMouseDown}
          >
            <div className="w-0.5 h-8 bg-gray-400 group-hover:bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          
          {/* Sidebar */}
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

      {/* Property Details Popup */}
      <PropertyDetailsPopup
        propertyId={selectedPropertyId}
        isOpen={isPropertyPopupOpen}
        onClose={handleClosePropertyPopup}
      />
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>}>
      <HomePageContent />
    </Suspense>
  );
}
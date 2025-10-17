import React, { useState } from 'react';
import { Home, Heart, MessageSquare, Eye, User, Settings, LogOut } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Link from "next/link";

interface CustomSidebarProps {
  className?: string;
  activePage?: 'home' | 'watchlist' | 'showings' | 'messaging' | 'profile';
  onHomeClick?: () => void;
}

export function CustomSidebar({ className = '', activePage = 'home', onHomeClick }: CustomSidebarProps) {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const menuItems = [
    { icon: Home, label: 'Home', isActive: activePage === 'home' },
    { icon: Heart, label: 'Watchlist', isActive: activePage === 'watchlist' },
    { icon: Eye, label: 'Showings', isActive: activePage === 'showings' },
    { icon: MessageSquare, label: 'Messaging', isActive: activePage === 'messaging' },
  ];

  return (
    <div className={`fixed left-0 top-0 h-full w-16 bg-background border-r border-border ${className}`}>
      {/* Menu Items */}
      <div className="flex flex-col items-center py-4 space-y-2">
        {menuItems.map((item, index) => (
          <TooltipProvider key={index}>
            <Tooltip>
              <TooltipTrigger asChild>
                {item.label === 'Home' ? (
                  <Link href="/" onClick={(e) => {
                    if (onHomeClick) {
                      onHomeClick();
                    }
                  }}>
                    <button
                      className={`
                        w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-200
                        ${item.isActive 
                          ? 'bg-primary text-primary-foreground' 
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        }
                      `}
                    >
                      <item.icon className="w-6 h-6" />
                    </button>
                  </Link>
                ) : item.label === 'Watchlist' ? (
                  <Link href="/watchlist">
                    <button
                      className={`
                        w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-200
                        ${item.isActive 
                          ? 'bg-primary text-primary-foreground' 
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        }
                      `}
                    >
                      <item.icon className="w-6 h-6" />
                    </button>
                  </Link>
                ) : item.label === 'Showings' ? (
                  <Link href="/showings">
                    <button
                      className={`
                        w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-200
                        ${item.isActive 
                          ? 'bg-primary text-primary-foreground' 
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        }
                      `}
                    >
                      <item.icon className="w-6 h-6" />
                    </button>
                  </Link>
                ) : item.label === 'Messaging' ? (
                  <Link href="/messaging">
                    <button
                      className={`
                        w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-200
                        ${item.isActive 
                          ? 'bg-primary text-primary-foreground' 
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        }
                      `}
                    >
                      <item.icon className="w-6 h-6" />
                    </button>
                  </Link>
                ) : (
                  <button
                    className={`
                      w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-200
                      ${item.isActive 
                        ? 'bg-primary text-primary-foreground' 
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }
                    `}
                  >
                    <item.icon className="w-6 h-6" />
                  </button>
                )}
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{item.label}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>

      {/* Profile Button at Bottom */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenu open={isProfileMenuOpen} onOpenChange={setIsProfileMenuOpen}>
                <DropdownMenuTrigger asChild>
                  <button className="w-12 h-12 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200 overflow-hidden">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" alt="User Profile" />
                      <AvatarFallback className="bg-muted">
                        <User className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="right" align="end" className="w-56">
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TooltipTrigger>
            <TooltipContent side="right">
              <div className="text-center">
                <p className="font-medium">Alex Johnson</p>
                <p className="text-xs text-muted-foreground">alex.johnson@email.com</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}





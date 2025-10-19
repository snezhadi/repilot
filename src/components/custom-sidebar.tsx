import React, { useState } from 'react';
import { Home, History, Heart, MessageSquare, Eye, User, Settings, LogOut } from 'lucide-react';
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
  activePage?: 'home' | 'chat-history' | 'watchlist' | 'showings' | 'messaging' | 'profile';
  onHomeClick?: () => void;
  mode?: 'client' | 'agent';
}

export function CustomSidebar({ className = '', activePage = 'home', onHomeClick, mode = 'client' }: CustomSidebarProps) {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  
  // Agent mode: only Home and Chat History
  // Client mode: all menu items
  const menuItems = mode === 'agent' 
    ? [
        { icon: Home, label: 'Home', isActive: activePage === 'home', href: '/agent' },
        { icon: History, label: 'Chat History', isActive: activePage === 'chat-history', href: '/agent/chat-history' },
      ]
    : [
        { icon: Home, label: 'Home', isActive: activePage === 'home', href: '/' },
        { icon: History, label: 'Chat History', isActive: activePage === 'chat-history', href: '/chat-history' },
        { icon: Heart, label: 'Watchlist', isActive: activePage === 'watchlist', href: '/watchlist' },
        { icon: Eye, label: 'Showings', isActive: activePage === 'showings', href: '/showings' },
        { icon: MessageSquare, label: 'Messaging', isActive: activePage === 'messaging', href: '/messaging' },
      ];
  
  // Different avatars for agent vs client
  const avatarSrc = mode === 'agent' 
    ? "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face" 
    : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face";
  
  const userName = mode === 'agent' ? 'Sarah Johnson' : 'Alex Johnson';
  const userEmail = mode === 'agent' ? 'sarah.johnson@email.com' : 'alex.johnson@email.com';

  return (
    <div className={`fixed left-0 top-0 h-full w-16 bg-background border-r border-border ${className}`}>
      {/* Menu Items */}
      <div className="flex flex-col items-center py-4 space-y-2">
        {menuItems.map((item, index) => (
          <TooltipProvider key={index}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={item.href} onClick={(e) => {
                  if (item.label === 'Home' && onHomeClick) {
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
                      <AvatarImage src={avatarSrc} alt="User Profile" />
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
                <p className="font-medium">{userName}</p>
                <p className="text-xs text-muted-foreground">{userEmail}</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}





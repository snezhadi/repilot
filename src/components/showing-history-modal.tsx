'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  X, 
  MessageSquare, 
  Mic, 
  MicOff, 
  Send, 
  Calendar, 
  Clock, 
  User, 
  Bot,
  CheckCircle,
  XCircle,
  AlertCircle,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface Comment {
  id: string;
  text: string;
  author: 'user' | 'agent';
  timestamp: Date;
  isVoice?: boolean;
}

interface Activity {
  id: string;
  type: 'showing' | 'comment' | 'reschedule' | 'cancellation';
  description: string;
  timestamp: Date;
  author: 'user' | 'agent';
}

interface Showing {
  id: string;
  propertyId: string;
  status: 'not-scheduled' | 'scheduled' | 'first-showing' | 'second-showing' | 'third-showing' | 'completed' | 'cancelled';
  scheduledDate?: string;
  scheduledTime?: string;
  showingNumber?: number;
  comments: Comment[];
  activities: Activity[];
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
  showing: Showing;
}

interface ShowingHistoryModalProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
}

export function ShowingHistoryModal({ property, isOpen, onClose }: ShowingHistoryModalProps) {
  const [newComment, setNewComment] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRescheduleForm, setShowRescheduleForm] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [property.showing.comments, property.showing.activities]);

  if (!isOpen) return null;

  // Combine comments and activities, sort by timestamp
  const allItems = [
    ...property.showing.comments.map(comment => ({
      ...comment,
      itemType: 'comment' as const
    })),
    ...property.showing.activities.map(activity => ({
      ...activity,
      itemType: 'activity' as const
    }))
  ].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;
    
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, this would update the backend
    console.log('New comment:', newComment);
    setNewComment('');
    setIsSubmitting(false);
  };

  const handleVoiceRecording = () => {
    setIsRecording(!isRecording);
    // In a real app, this would handle voice recording
    if (!isRecording) {
      // Start recording
      console.log('Starting voice recording...');
    } else {
      // Stop recording and process
      console.log('Stopping voice recording...');
    }
  };

  const handleReschedule = () => {
    if (!rescheduleDate || !rescheduleTime) return;
    
    // In a real app, this would send a reschedule request
    console.log('Reschedule request:', { date: rescheduleDate, time: rescheduleTime });
    setShowRescheduleForm(false);
    setRescheduleDate('');
    setRescheduleTime('');
  };

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'showing':
        return <Calendar className="w-4 h-4" />;
      case 'comment':
        return <MessageSquare className="w-4 h-4" />;
      case 'reschedule':
        return <RotateCcw className="w-4 h-4" />;
      case 'cancellation':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: Activity['type'], author: 'user' | 'agent') => {
    if (author === 'agent') {
      return 'bg-blue-50 border-blue-200';
    }
    
    switch (type) {
      case 'showing':
        return 'bg-green-50 border-green-200';
      case 'comment':
        return 'bg-gray-50 border-gray-200';
      case 'reschedule':
        return 'bg-yellow-50 border-yellow-200';
      case 'cancellation':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getCommentColor = (author: 'user' | 'agent') => {
    return author === 'agent' 
      ? 'bg-blue-50 border-blue-200' 
      : 'bg-gray-50 border-gray-200';
  };

  // Generate AI Summary (mock)
  const aiSummary = `Based on the showing history, you've had ${property.showing.activities.filter(a => a.type === 'showing').length} showing(s) for this property. Key points from your feedback include interest in the garden space and need to inspect the basement more thoroughly. The agent has been responsive and helpful throughout the process.`;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold">Showing History</h2>
            <p className="text-sm text-muted-foreground">{property.title}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* AI Summary */}
        <div className="p-6 border-b border-border bg-gradient-to-r from-purple-50 to-blue-50">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-medium text-sm mb-1">AI Summary</h3>
              <p className="text-sm text-muted-foreground">{aiSummary}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* History Timeline */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-4">
              {allItems.map((item, index) => (
                <div key={`${item.itemType}-${item.id}`} className="flex space-x-3">
                  {/* Timeline indicator */}
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                      item.itemType === 'comment' 
                        ? getCommentColor(item.author)
                        : getActivityColor(item.type, item.author)
                    }`}>
                      {item.itemType === 'comment' ? (
                        <MessageSquare className="w-4 h-4" />
                      ) : (
                        getActivityIcon(item.type)
                      )}
                    </div>
                    {index < allItems.length - 1 && (
                      <div className="w-0.5 h-8 bg-border mt-2" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className={`p-4 rounded-lg border ${
                      item.itemType === 'comment' 
                        ? getCommentColor(item.author)
                        : getActivityColor(item.type, item.author)
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Avatar className="w-6 h-6">
                            <AvatarImage 
                              src={item.author === 'user' 
                                ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
                                : "/ai_avatar.png"
                              } 
                              alt={item.author}
                            />
                            <AvatarFallback className="text-xs">
                              {item.author === 'user' ? 'U' : 'A'}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">
                            {item.author === 'user' ? 'You' : 'AI Agent'}
                          </span>
                          {item.itemType === 'comment' && 'isVoice' in item && item.isVoice && (
                            <Badge variant="secondary" className="text-xs">
                              <Mic className="w-3 h-3 mr-1" />
                              Voice
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(item.timestamp).toLocaleString()}
                        </span>
                      </div>
                      
                      {item.itemType === 'comment' ? (
                        <p className="text-sm">{(item as Comment).text}</p>
                      ) : (
                        <p className="text-sm">{(item as Activity).description}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div ref={messagesEndRef} />
          </div>

          {/* Action Panel */}
          <div className="w-80 border-l border-border p-6 flex flex-col">
            <h3 className="font-medium mb-4">Actions</h3>
            
            {/* Reschedule Button */}
            {property.showing.status === 'scheduled' && (
              <div className="mb-6">
                <Button 
                  variant="outline" 
                  className="w-full mb-3"
                  onClick={() => setShowRescheduleForm(!showRescheduleForm)}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Request Reschedule
                </Button>
                
                {showRescheduleForm && (
                  <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                    <div>
                      <label className="text-sm font-medium mb-1 block">New Date</label>
                      <input
                        type="date"
                        value={rescheduleDate}
                        onChange={(e) => setRescheduleDate(e.target.value)}
                        className="w-full px-3 py-2 border border-input rounded-md text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">New Time</label>
                      <input
                        type="time"
                        value={rescheduleTime}
                        onChange={(e) => setRescheduleTime(e.target.value)}
                        className="w-full px-3 py-2 border border-input rounded-md text-sm"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" onClick={handleReschedule} className="flex-1">
                        Send Request
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => setShowRescheduleForm(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Add Comment */}
            <div className="flex-1">
              <h4 className="font-medium mb-3">Add Comment</h4>
              
              <div className="space-y-3">
                <Textarea
                  placeholder="Add a comment about this property..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[100px] resize-none"
                />
                
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleVoiceRecording}
                    className={`flex-1 ${isRecording ? 'bg-red-50 border-red-200 text-red-600' : ''}`}
                  >
                    {isRecording ? (
                      <>
                        <MicOff className="w-4 h-4 mr-2" />
                        Stop Recording
                      </>
                    ) : (
                      <>
                        <Mic className="w-4 h-4 mr-2" />
                        Voice Note
                      </>
                    )}
                  </Button>
                  
                  <Button
                    size="sm"
                    onClick={handleSubmitComment}
                    disabled={!newComment.trim() || isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

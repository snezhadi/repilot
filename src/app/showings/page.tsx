'use client';

import React, { useState } from 'react';
import { CustomSidebar } from '@/components/custom-sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Grid3X3, 
  List, 
  Filter, 
  Calendar, 
  Clock, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Eye, 
  MessageSquare,
  Mic,
  MicOff,
  ChevronDown,
  CheckCircle,
  XCircle,
  X,
  AlertCircle,
  Map,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { ShowingHistoryModal } from '@/components/showing-history-modal';
import { PropertyDetailsPopup } from '@/components/property-details-popup';

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

const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Modern Family Home in Richmond Hill',
    price: '$1,250,000',
    location: 'Richmond Hill, ON',
    bedrooms: 4,
    bathrooms: 3,
    sqft: 2500,
    image: '/property1.jpg',
    showing: {
      id: 's1',
      propertyId: '1',
      status: 'scheduled',
      scheduledDate: '2024-01-15',
      scheduledTime: '2:00 PM',
      showingNumber: 1,
      comments: [
        {
          id: 'c1',
          text: 'Looking forward to seeing this property!',
          author: 'user',
          timestamp: new Date('2024-01-10T10:30:00')
        },
        {
          id: 'c2',
          text: 'Great choice! This home has excellent potential. I\'ll make sure to highlight the key features during our visit.',
          author: 'agent',
          timestamp: new Date('2024-01-10T11:15:00')
        }
      ],
      activities: [
        {
          id: 'a1',
          type: 'showing',
          description: 'First showing scheduled for January 15, 2024 at 2:00 PM',
          timestamp: new Date('2024-01-10T09:00:00'),
          author: 'agent'
        },
        {
          id: 'a2',
          type: 'comment',
          description: 'User commented: "Looking forward to seeing this property!"',
          timestamp: new Date('2024-01-10T10:30:00'),
          author: 'user'
        },
        {
          id: 'a3',
          type: 'comment',
          description: 'Agent commented: "Great choice! This home has excellent potential..."',
          timestamp: new Date('2024-01-10T11:15:00'),
          author: 'agent'
        }
      ]
    }
  },
  {
    id: '2',
    title: 'Luxury Townhouse with Garden',
    price: '$950,000',
    location: 'Richmond Hill, ON',
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1800,
    image: '/property2.jpg',
    showing: {
      id: 's2',
      propertyId: '2',
      status: 'first-showing',
      scheduledDate: '2024-01-12',
      scheduledTime: '10:00 AM',
      showingNumber: 1,
      comments: [
        {
          id: 'c3',
          text: 'The garden space is perfect for our family!',
          author: 'user',
          timestamp: new Date('2024-01-12T14:30:00'),
          isVoice: true
        }
      ],
      activities: [
        {
          id: 'a4',
          type: 'showing',
          description: 'First showing completed on January 12, 2024 at 10:00 AM',
          timestamp: new Date('2024-01-12T10:00:00'),
          author: 'agent'
        },
        {
          id: 'a5',
          type: 'comment',
          description: 'User voice comment: "The garden space is perfect for our family!"',
          timestamp: new Date('2024-01-12T14:30:00'),
          author: 'user'
        }
      ]
    }
  },
  {
    id: '3',
    title: 'Contemporary Condo Downtown',
    price: '$750,000',
    location: 'Richmond Hill, ON',
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1200,
    image: '/property3.jpg',
    showing: {
      id: 's3',
      propertyId: '3',
      status: 'not-scheduled',
      comments: [],
      activities: []
    }
  },
  {
    id: '4',
    title: 'Spacious Detached Home',
    price: '$1,450,000',
    location: 'Richmond Hill, ON',
    bedrooms: 5,
    bathrooms: 4,
    sqft: 3200,
    image: '/property4.jpg',
    showing: {
      id: 's4',
      propertyId: '4',
      status: 'second-showing',
      scheduledDate: '2024-01-18',
      scheduledTime: '3:30 PM',
      showingNumber: 2,
      comments: [
        {
          id: 'c4',
          text: 'Need to check the basement condition more thoroughly',
          author: 'user',
          timestamp: new Date('2024-01-15T16:45:00')
        }
      ],
      activities: [
        {
          id: 'a6',
          type: 'showing',
          description: 'First showing completed on January 10, 2024 at 1:00 PM',
          timestamp: new Date('2024-01-10T13:00:00'),
          author: 'agent'
        },
        {
          id: 'a7',
          type: 'showing',
          description: 'Second showing scheduled for January 18, 2024 at 3:30 PM',
          timestamp: new Date('2024-01-15T10:00:00'),
          author: 'agent'
        },
        {
          id: 'a8',
          type: 'comment',
          description: 'User commented: "Need to check the basement condition more thoroughly"',
          timestamp: new Date('2024-01-15T16:45:00'),
          author: 'user'
        }
      ]
    }
  }
];

export default function ShowingsPage() {
  const [viewMode, setViewMode] = useState<'cards' | 'table' | 'map' | 'calendar'>('cards');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [isPropertyPopupOpen, setIsPropertyPopupOpen] = useState(false);
  const [calendarMode, setCalendarMode] = useState<'week' | 'month'>('month');
  const [selectedMapProperty, setSelectedMapProperty] = useState<Property | null>(null);

  const statusOptions = [
    { value: 'all', label: 'All Showings' },
    { value: 'not-scheduled', label: 'Not Scheduled' },
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'first-showing', label: 'First Showing' },
    { value: 'second-showing', label: 'Second Showing' },
    { value: 'third-showing', label: 'Third Showing' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const filteredProperties = filterStatus === 'all' 
    ? mockProperties 
    : mockProperties.filter(property => property.showing.status === filterStatus);

  const getStatusBadge = (status: Showing['status'], scheduledDate?: string, scheduledTime?: string) => {
    const statusConfig = {
      'not-scheduled': { 
        label: 'Not Scheduled', 
        className: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: AlertCircle
      },
      'scheduled': { 
        label: `Scheduled on ${scheduledDate} at ${scheduledTime}`, 
        className: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: Calendar
      },
      'first-showing': { 
        label: `First showing on ${scheduledDate} at ${scheduledTime}`, 
        className: 'bg-green-100 text-green-800 border-green-200',
        icon: CheckCircle
      },
      'second-showing': { 
        label: `Second showing scheduled on ${scheduledDate} at ${scheduledTime}`, 
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: Clock
      },
      'third-showing': { 
        label: `Third showing scheduled on ${scheduledDate} at ${scheduledTime}`, 
        className: 'bg-orange-100 text-orange-800 border-orange-200',
        icon: Clock
      },
      'completed': { 
        label: 'Completed', 
        className: 'bg-green-100 text-green-800 border-green-200',
        icon: CheckCircle
      },
      'cancelled': { 
        label: 'Cancelled', 
        className: 'bg-red-100 text-red-800 border-red-200',
        icon: XCircle
      }
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <Badge className={`${config.className} border cursor-pointer hover:opacity-80 transition-opacity`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const handleStatusClick = (property: Property) => {
    setSelectedProperty(property);
    setIsHistoryModalOpen(true);
  };

  const handlePropertyClick = (propertyId: string) => {
    setSelectedPropertyId(propertyId);
    setIsPropertyPopupOpen(true);
  };

  const handleClosePropertyPopup = () => {
    setIsPropertyPopupOpen(false);
    setSelectedPropertyId(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <CustomSidebar activePage="showings" />
      
      <div className="ml-16 p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Property Showings</h1>
          <p className="text-muted-foreground">Manage your property viewing schedule and history</p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            {/* View Toggle */}
            <div className="flex bg-muted rounded-lg p-1">
              <Button
                variant={viewMode === 'cards' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('cards')}
                className="h-8 px-3"
              >
                <Grid3X3 className="w-4 h-4 mr-2" />
                Cards
              </Button>
              <Button
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('table')}
                className="h-8 px-3"
              >
                <List className="w-4 h-4 mr-2" />
                Table
              </Button>
              <Button
                variant={viewMode === 'map' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('map')}
                className="h-8 px-3"
              >
                <Map className="w-4 h-4 mr-2" />
                Map
              </Button>
              <Button
                variant={viewMode === 'calendar' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('calendar')}
                className="h-8 px-3"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Calendar
              </Button>
            </div>

            {/* Calendar Mode Toggle (only for calendar view) */}
            {viewMode === 'calendar' && (
              <div className="flex bg-muted rounded-lg p-1">
                <Button
                  variant={calendarMode === 'week' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setCalendarMode('week')}
                  className="h-8 px-3 text-xs"
                >
                  Week
                </Button>
                <Button
                  variant={calendarMode === 'month' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setCalendarMode('month')}
                  className="h-8 px-3 text-xs"
                >
                  Month
                </Button>
              </div>
            )}

            {/* Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            {filteredProperties.length} showing{filteredProperties.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Content */}
        {filteredProperties.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No showings found</h3>
            <p className="text-muted-foreground">
              {filterStatus === 'all' 
                ? 'You don\'t have any property showings yet.' 
                : `No showings with status "${statusOptions.find(s => s.value === filterStatus)?.label}" found.`
              }
            </p>
          </div>
        ) : (
          <>
            {viewMode === 'cards' && (
          /* Cards View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  <div className="relative">
                    <img 
                      src={property.image} 
                      alt={property.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      {getStatusBadge(
                        property.showing.status, 
                        property.showing.scheduledDate, 
                        property.showing.scheduledTime
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">{property.title}</h3>
                  <p className="text-xl font-bold text-primary mb-3">{property.price}</p>
                  
                  <div className="flex items-center text-sm text-muted-foreground mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    {property.location}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center">
                      <Bed className="w-4 h-4 mr-1" />
                      {property.bedrooms}
                    </div>
                    <div className="flex items-center">
                      <Bath className="w-4 h-4 mr-1" />
                      {property.bathrooms}
                    </div>
                    <div className="flex items-center">
                      <Square className="w-4 h-4 mr-1" />
                      {property.sqft.toLocaleString()} sqft
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusClick(property)}
                      className="text-xs"
                    >
                      <MessageSquare className="w-4 h-4 mr-1" />
                      History
                    </Button>
                    <Button 
                      size="sm" 
                      className="text-xs"
                      onClick={() => handlePropertyClick(property.id)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
            )}

            {viewMode === 'table' && (
          /* Table View */
          <div className="bg-background border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-4 font-medium">Property</th>
                    <th className="text-left p-4 font-medium">Price</th>
                    <th className="text-left p-4 font-medium">Location</th>
                    <th className="text-left p-4 font-medium">Details</th>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-left p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProperties.map((property) => (
                    <tr key={property.id} className="border-t border-border hover:bg-muted/30">
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <img 
                            src={property.image} 
                            alt={property.title}
                            className="w-16 h-12 object-cover rounded"
                          />
                          <div>
                            <h3 className="font-medium text-sm line-clamp-2">{property.title}</h3>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="font-semibold text-primary">{property.price}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4 mr-1" />
                          {property.location}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-muted-foreground">
                          {property.bedrooms} bed • {property.bathrooms} bath • {property.sqft.toLocaleString()} sqft
                        </div>
                      </td>
                      <td className="p-4">
                        <div onClick={() => handleStatusClick(property)}>
                          {getStatusBadge(
                            property.showing.status, 
                            property.showing.scheduledDate, 
                            property.showing.scheduledTime
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusClick(property)}
                            className="text-xs"
                          >
                            <MessageSquare className="w-4 h-4 mr-1" />
                            History
                          </Button>
                          <Button 
                            size="sm" 
                            className="text-xs"
                            onClick={() => handlePropertyClick(property.id)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Details
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
            )}

            {viewMode === 'map' && (
          /* Map View */
          <div className="relative h-[calc(100vh-16rem)] rounded-lg overflow-hidden border border-border">
            {/* Map Background */}
            <img 
              src="/map.png" 
              alt="Map"
              className="w-full h-full object-cover"
            />
            
            {/* Property Markers */}
            {filteredProperties.map((property, index) => (
              <button
                key={property.id}
                className="absolute w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold shadow-lg hover:bg-blue-700 hover:scale-110 transition-all border-2 border-white"
                style={{
                  top: `${20 + (index * 15) % 60}%`,
                  left: `${15 + (index * 20) % 70}%`,
                }}
                onClick={() => setSelectedMapProperty(property)}
              >
                {index + 1}
              </button>
            ))}

            {/* Selected Property Card */}
            {selectedMapProperty && (
              <div className="absolute bottom-4 left-4 right-4 z-10">
                <Card className="overflow-hidden shadow-2xl">
                  <button
                    onClick={() => setSelectedMapProperty(null)}
                    className="absolute top-2 right-2 z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors shadow-md"
                  >
                    <XCircle className="w-5 h-5 text-gray-600" />
                  </button>
                  
                  <div className="flex p-4 gap-4">
                    <img 
                      src={selectedMapProperty.image} 
                      alt={selectedMapProperty.title}
                      className="w-32 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1 line-clamp-1">{selectedMapProperty.title}</h3>
                      <p className="text-xl font-bold text-primary mb-2">{selectedMapProperty.price}</p>
                      
                      <div className="flex items-center text-sm text-muted-foreground mb-2">
                        <MapPin className="w-3 h-3 mr-1" />
                        {selectedMapProperty.location}
                      </div>
                      
                      <div className="flex items-center space-x-3 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center">
                          <Bed className="w-3 h-3 mr-1" />
                          {selectedMapProperty.bedrooms}
                        </div>
                        <div className="flex items-center">
                          <Bath className="w-3 h-3 mr-1" />
                          {selectedMapProperty.bathrooms}
                        </div>
                        <div className="flex items-center">
                          <Square className="w-3 h-3 mr-1" />
                          {selectedMapProperty.sqft.toLocaleString()} sqft
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div onClick={() => handleStatusClick(selectedMapProperty)}>
                          {getStatusBadge(
                            selectedMapProperty.showing.status, 
                            selectedMapProperty.showing.scheduledDate, 
                            selectedMapProperty.showing.scheduledTime
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusClick(selectedMapProperty)}
                            className="text-xs"
                          >
                            <MessageSquare className="w-3 h-3 mr-1" />
                            History
                          </Button>
                          <Button 
                            size="sm" 
                            className="text-xs"
                            onClick={() => handlePropertyClick(selectedMapProperty.id)}
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>
            )}

            {viewMode === 'calendar' && (
          /* Calendar View */
          <div className="bg-background border border-border rounded-lg p-4">
            {calendarMode === 'month' ? (
              /* Month View */
              <div className="relative">
                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-6">
                  <Button variant="outline" size="sm">
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <h2 className="text-xl font-semibold">January 2024</h2>
                  <Button variant="outline" size="sm">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>

                {/* Days of Week */}
                <div className="grid grid-cols-7 gap-2 mb-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center font-medium text-sm text-muted-foreground p-2">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 35 }).map((_, index) => {
                    const day = index - 2; // Start from day 1 (adjust offset)
                    const isCurrentMonth = day >= 1 && day <= 31;
                    const dayShowings = isCurrentMonth 
                      ? filteredProperties.filter(p => {
                          if (!p.showing.scheduledDate) return false;
                          const showingDay = new Date(p.showing.scheduledDate).getDate();
                          return showingDay === day;
                        })
                      : [];

                    return (
                      <div
                        key={index}
                        className={`min-h-[120px] p-2 border border-border rounded-lg ${
                          !isCurrentMonth ? 'bg-muted/30' : 'bg-background hover:bg-muted/30'
                        } transition-colors`}
                      >
                        <div className="text-sm font-medium mb-2">
                          {isCurrentMonth ? day : ''}
                        </div>
                        <div className="space-y-1">
                          {dayShowings.map(property => {
                            const statusColors = {
                              'not-scheduled': 'bg-gray-200 text-gray-800',
                              'scheduled': 'bg-blue-200 text-blue-800',
                              'first-showing': 'bg-green-200 text-green-800',
                              'second-showing': 'bg-yellow-200 text-yellow-800',
                              'third-showing': 'bg-orange-200 text-orange-800',
                              'completed': 'bg-green-200 text-green-800',
                              'cancelled': 'bg-red-200 text-red-800'
                            };
                            
                            return (
                              <button
                                key={property.id}
                                onClick={() => setSelectedMapProperty(property)}
                                className={`w-full text-left text-xs p-1.5 rounded ${statusColors[property.showing.status]} hover:opacity-80 transition-opacity line-clamp-2`}
                                title={`${property.title} - ${property.showing.scheduledDate} at ${property.showing.scheduledTime || 'TBD'}`}
                              >
                                {property.showing.scheduledTime} - {property.title.substring(0, 20)}...
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Selected Property Card in Month View */}
                {selectedMapProperty && (
                  <div className="fixed bottom-4 left-4 right-4 z-50">
                    <Card className="bg-white/95 backdrop-blur-sm border border-gray-200 shadow-xl rounded-xl overflow-hidden">
                      <button
                        onClick={() => setSelectedMapProperty(null)}
                        className="absolute top-2 right-2 z-10 w-6 h-6 hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors"
                      >
                        <X className="w-4 h-4 text-gray-600" />
                      </button>
                      <div className="flex p-2 pl-2 gap-3">
                        <img 
                          src={selectedMapProperty.image} 
                          alt={selectedMapProperty.title}
                          className="w-24 h-18 object-cover rounded-lg flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div className="min-w-0 flex-1">
                              <h3 className="font-semibold text-lg mb-1 line-clamp-1">{selectedMapProperty.title}</h3>
                              <p className="text-xl font-bold text-primary mb-2">{selectedMapProperty.price}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center text-sm text-muted-foreground mb-2">
                            <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                            <span className="truncate">{selectedMapProperty.location}</span>
                          </div>
                          
                          <div className="flex items-center space-x-3 text-xs text-muted-foreground mb-2">
                            <div className="flex items-center">
                              <Bed className="w-3 h-3 mr-1" />
                              {selectedMapProperty.bedrooms}
                            </div>
                            <div className="flex items-center">
                              <Bath className="w-3 h-3 mr-1" />
                              {selectedMapProperty.bathrooms}
                            </div>
                            <div className="flex items-center">
                              <Square className="w-3 h-3 mr-1" />
                              {selectedMapProperty.sqft.toLocaleString()} sqft
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div onClick={() => handleStatusClick(selectedMapProperty)}>
                              {getStatusBadge(
                                selectedMapProperty.showing.status, 
                                selectedMapProperty.showing.scheduledDate, 
                                selectedMapProperty.showing.scheduledTime
                              )}
                            </div>
                            <Button
                              size="sm"
                              className="text-xs h-8 px-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md transition-all hover:shadow-lg"
                              onClick={() => handlePropertyClick(selectedMapProperty.id)}
                            >
                              <Eye className="w-3 h-3 mr-1.5" />
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                )}

              </div>
            ) : (
              /* Week View */
              <div className="relative">
                {/* Week Header */}
                <div className="flex items-center justify-between mb-6">
                  <Button variant="outline" size="sm">
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <h2 className="text-xl font-semibold">Jan 15-21, 2024</h2>
                  <Button variant="outline" size="sm">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>

                {/* Week Grid */}
                <div className="grid grid-cols-7 gap-3">
                  {['Sun 14', 'Mon 15', 'Tue 16', 'Wed 17', 'Thu 18', 'Fri 19', 'Sat 20'].map((day, dayIndex) => {
                    const dayShowings = filteredProperties.filter((_, i) => i % 7 === dayIndex);
                    
                    return (
                      <div key={day} className="border border-border rounded-lg p-3">
                        <div className="text-sm font-semibold mb-3 text-center">{day}</div>
                        <div className="space-y-2">
                          {dayShowings.map(property => {
                            const statusColors = {
                              'not-scheduled': 'bg-gray-200 text-gray-800',
                              'scheduled': 'bg-blue-200 text-blue-800',
                              'first-showing': 'bg-green-200 text-green-800',
                              'second-showing': 'bg-yellow-200 text-yellow-800',
                              'third-showing': 'bg-orange-200 text-orange-800',
                              'completed': 'bg-green-200 text-green-800',
                              'cancelled': 'bg-red-200 text-red-800'
                            };
                            
                            return (
                              <button
                                key={property.id}
                                onClick={() => setSelectedMapProperty(property)}
                                className={`w-full text-left text-xs p-2 rounded ${statusColors[property.showing.status]} hover:opacity-80 transition-opacity`}
                                title={`${property.title} - ${property.showing.scheduledDate} at ${property.showing.scheduledTime || 'TBD'}`}
                              >
                                <div className="font-semibold">{property.showing.scheduledTime || 'TBD'}</div>
                                <div className="line-clamp-2 mt-1">{property.title}</div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Selected Property Card in Week View */}
                {selectedMapProperty && (
                  <div className="fixed bottom-4 left-4 right-4 z-50">
                    <Card className="bg-white/95 backdrop-blur-sm border border-gray-200 shadow-xl rounded-xl overflow-hidden">
                      <button
                        onClick={() => setSelectedMapProperty(null)}
                        className="absolute top-2 right-2 z-10 w-6 h-6 hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors"
                      >
                        <X className="w-4 h-4 text-gray-600" />
                      </button>
                      <div className="flex p-2 pl-2 gap-3">
                        <img 
                          src={selectedMapProperty.image} 
                          alt={selectedMapProperty.title}
                          className="w-24 h-18 object-cover rounded-lg flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div className="min-w-0 flex-1">
                              <h3 className="font-semibold text-lg mb-1 line-clamp-1">{selectedMapProperty.title}</h3>
                              <p className="text-xl font-bold text-primary mb-2">{selectedMapProperty.price}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center text-sm text-muted-foreground mb-2">
                            <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                            <span className="truncate">{selectedMapProperty.location}</span>
                          </div>
                          
                          <div className="flex items-center space-x-3 text-xs text-muted-foreground mb-2">
                            <div className="flex items-center">
                              <Bed className="w-3 h-3 mr-1" />
                              {selectedMapProperty.bedrooms}
                            </div>
                            <div className="flex items-center">
                              <Bath className="w-3 h-3 mr-1" />
                              {selectedMapProperty.bathrooms}
                            </div>
                            <div className="flex items-center">
                              <Square className="w-3 h-3 mr-1" />
                              {selectedMapProperty.sqft.toLocaleString()} sqft
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div onClick={() => handleStatusClick(selectedMapProperty)}>
                              {getStatusBadge(
                                selectedMapProperty.showing.status, 
                                selectedMapProperty.showing.scheduledDate, 
                                selectedMapProperty.showing.scheduledTime
                              )}
                            </div>
                            <Button
                              size="sm"
                              className="text-xs h-8 px-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md transition-all hover:shadow-lg"
                              onClick={() => handlePropertyClick(selectedMapProperty.id)}
                            >
                              <Eye className="w-3 h-3 mr-1.5" />
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                )}

              </div>
            )}
          </div>
            )}
          </>
        )}
      </div>

      {/* Showing History Modal */}
      {selectedProperty && (
        <ShowingHistoryModal
          property={selectedProperty}
          isOpen={isHistoryModalOpen}
          onClose={() => setIsHistoryModalOpen(false)}
        />
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

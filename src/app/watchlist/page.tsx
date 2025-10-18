"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, Bed, Bath, Square, Star } from "lucide-react";
import { CustomSidebar } from "@/components/custom-sidebar";
import { PropertyDetailsPopup } from "@/components/property-details-popup";

interface WatchedProperty {
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
  userFeedback: {
    rating: number;
    comment: string;
    date: Date;
  };
}

export default function WatchlistPage() {
  const [watchedProperties] = useState<WatchedProperty[]>([
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
      aiReason: "Perfect for families with excellent schools nearby and spacious layout for growing families.",
      isWatched: true,
      userFeedback: {
        rating: 5,
        comment: "Love the mountain views and the open floor plan. Great neighborhood!",
        date: new Date('2024-01-15')
      }
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
      aiReason: "Great investment opportunity with high rental potential. Modern amenities and prime location.",
      isWatched: true,
      userFeedback: {
        rating: 4,
        comment: "Good location but HOA fees are higher than expected.",
        date: new Date('2024-01-14')
      }
    }
  ]);

  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [isPropertyPopupOpen, setIsPropertyPopupOpen] = useState(false);

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
      {/* Custom Sidebar */}
      <CustomSidebar activePage="watchlist" />

      {/* Main Content */}
      <div className="ml-16">
        {/* Header */}
        <div className="border-b border-border bg-card">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">My Watchlist</h1>
                <p className="text-muted-foreground">Properties you&apos;ve saved and provided feedback on</p>
              </div>
              <Badge variant="secondary" className="text-sm">
                {watchedProperties.length} Properties
              </Badge>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 py-8">
          {watchedProperties.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Your watchlist is empty</h2>
              <p className="text-muted-foreground mb-6">
                Start exploring properties and add them to your watchlist to see them here.
              </p>
              <Button>Browse Properties</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {watchedProperties.map((property) => (
                <Card key={property.id} className="overflow-hidden">
                  <CardHeader className="p-0">
                    <div className="relative">
                      <img 
                        src={property.image} 
                        alt={property.title}
                        className="w-full h-48 object-cover"
                      />
                      <Badge 
                        className={`absolute top-2 right-2 ${
                          property.matchScore >= 80 ? 'bg-green-500' : 
                          property.matchScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                      >
                        {property.matchScore}% Match
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-lg">{property.title}</h3>
                      <Heart className="w-5 h-5 text-red-500 fill-current" />
                    </div>
                    
                    <div className="text-2xl font-bold text-primary">{property.price}</div>
                    
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-1" />
                      {property.location}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Bed className="w-4 h-4 mr-1" />
                        {property.bedrooms} beds
                      </div>
                      <div className="flex items-center">
                        <Bath className="w-4 h-4 mr-1" />
                        {property.bathrooms} baths
                      </div>
                      <div className="flex items-center">
                        <Square className="w-4 h-4 mr-1" />
                        {property.sqft.toLocaleString()} sqft
                      </div>
                    </div>
                    
                    <div className="bg-muted p-3 rounded-lg">
                      <div className="flex items-center gap-1 mb-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">AI Recommendation</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{property.aiReason}</p>
                    </div>

                    {/* User Feedback */}
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="w-4 h-4 text-blue-500 fill-current" />
                        <span className="text-sm font-medium">Your Feedback</span>
                        <div className="flex ml-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < property.userFeedback.rating 
                                  ? 'text-yellow-500 fill-current' 
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{property.userFeedback.comment}</p>
                      <p className="text-xs text-muted-foreground">
                        {property.userFeedback.date.toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handlePropertyClick(property.id)}
                      >
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        Edit Feedback
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Property Details Popup */}
      <PropertyDetailsPopup
        propertyId={selectedPropertyId}
        isOpen={isPropertyPopupOpen}
        onClose={handleClosePropertyPopup}
      />
    </div>
  );
}





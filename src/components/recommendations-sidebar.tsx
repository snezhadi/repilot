import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Heart, Eye, MapPin, Bed, Bath, Square, Grid3X3, Map, XCircle, Star, Sparkles } from "lucide-react";

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

interface RecommendationsSidebarProps {
  properties: Property[];
  onClose: () => void;
  onWatchlistToggle: (propertyId: string) => void;
  onRemoveProperty: (propertyId: string) => void;
  onPropertyClick: (propertyId: string) => void;
  onAskAI?: (propertyTitle: string) => void;
}

export function RecommendationsSidebar({ 
  properties, 
  onClose, 
  onWatchlistToggle, 
  onRemoveProperty,
  onPropertyClick,
  onAskAI
}: RecommendationsSidebarProps) {
  const [viewMode, setViewMode] = useState<'cards' | 'map'>('cards');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-background">
        <div>
          <h2 className="text-lg font-semibold">Property Recommendations</h2>
          <p className="text-sm text-muted-foreground">Based on your search</p>
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

      {/* View Mode Switcher */}
      <div className="flex items-center justify-center p-3 border-b border-border bg-muted/30">
        <div className="flex bg-background rounded-lg p-1 border">
          <Button
            variant={viewMode === 'cards' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('cards')}
            className="h-8 px-3 text-xs"
          >
            <Grid3X3 className="w-3 h-3 mr-1" />
            Cards
          </Button>
          <Button
            variant={viewMode === 'map' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('map')}
            className="h-8 px-3 text-xs"
          >
            <Map className="w-3 h-3 mr-1" />
            Map
          </Button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col">
        {viewMode === 'cards' ? (
          /* Cards View */
          <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ maxHeight: 'calc(100vh - 200px)' }}>
            {properties.map((property) => (
              <Card key={property.id} className="overflow-hidden">
                <CardHeader className="p-0">
                  <div className="relative">
                    <img 
                      src={property.image} 
                      alt={property.title}
                      className="w-full h-32 object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://images.unsplash.com/photo-${getRandomPropertyImage()}?w=400&h=300&fit=crop&crop=entropy`;
                      }}
                    />
                    <Badge className={`absolute top-2 right-2 px-2 py-1 text-xs ${
                      property.matchScore >= 90 ? 'bg-green-500' : 
                      property.matchScore >= 80 ? 'bg-blue-500' : 'bg-orange-500'
                    } text-white`}>
                      {property.matchScore}% Match
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-3">
                  <h3 className="font-semibold text-sm mb-1 line-clamp-2">{property.title}</h3>
                  <p className="text-lg font-bold text-primary mb-2">{property.price}</p>
                  
                  <div className="flex items-center text-xs text-muted-foreground mb-2">
                    <MapPin className="w-3 h-3 mr-1" />
                    {property.location}
                  </div>
                  
                  <div className="flex items-center space-x-3 text-xs text-muted-foreground mb-3">
                    <div className="flex items-center">
                      <Bed className="w-3 h-3 mr-1" />
                      {property.bedrooms}
                    </div>
                    <div className="flex items-center">
                      <Bath className="w-3 h-3 mr-1" />
                      {property.bathrooms}
                    </div>
                    <div className="flex items-center">
                      <Square className="w-3 h-3 mr-1" />
                      {property.sqft.toLocaleString()} sqft
                    </div>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{property.aiReason}</p>
                  
                  <div className="flex items-center justify-between gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onWatchlistToggle(property.id)}
                      className="text-xs h-7 px-2 flex-1"
                    >
                      <Heart className={`w-3 h-3 mr-1 ${property.isWatched ? 'fill-red-500 text-red-500' : ''}`} />
                      {property.isWatched ? 'Saved' : 'Save'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onAskAI?.(property.title)}
                      className="text-xs h-7 px-2 flex-1"
                    >
                      <Sparkles className="w-3 h-3 mr-1" />
                      Ask AI
                    </Button>
                    <Button 
                      size="sm" 
                      className="text-xs h-7 px-2 flex-1"
                      onClick={() => onPropertyClick(property.id)}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          /* Map View */
          <div className="flex-1 flex flex-col">
            <div className="flex-1 bg-muted/20 relative overflow-hidden">
              {/* Real Richmond Hill Map */}
              <div className="w-full h-full relative">
                <img 
                  src="/map.png" 
                  alt="Richmond Hill, Ontario Map"
                  className="w-full h-full object-cover"
                />
              
                {/* Property Markers */}
                <div className="absolute inset-0 pointer-events-none">
                  {properties.map((property, index) => {
                    const positions = [
                      { top: '15%', left: '20%' },
                      { top: '40%', left: '55%' },
                      { top: '75%', left: '25%' },
                      { top: '60%', left: '75%' },
                    ];
                    const position = positions[index % positions.length];
                    
                    return (
                      <div
                        key={property.id}
                        className="absolute w-6 h-6 bg-primary rounded-full border-2 border-white shadow-lg cursor-pointer pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform"
                        style={position}
                        onClick={() => setSelectedProperty(property)}
                      >
                        <div className="w-full h-full bg-primary rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">{index + 1}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Elegant Property Card (Overlay on Map) */}
                {selectedProperty && (
                  <div className="absolute bottom-4 left-4 right-4 z-10">
                    <Card className="overflow-hidden shadow-2xl border-0 bg-white/95 backdrop-blur-sm relative">
                      {/* Close Button - Top Right of Entire Card */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedProperty(null)}
                        className="absolute top-2 right-2 h-6 w-6 p-0 bg-white/90 hover:bg-white shadow-md rounded-full z-10"
                      >
                        <X className="w-3 h-3 text-gray-600" />
                      </Button>
                      
                      <div className="flex pl-2">
                        {/* Enhanced Image Section */}
                        <div className="w-24 h-18 flex-shrink-0 relative group">
                          <img 
                            src={selectedProperty.image} 
                            alt={selectedProperty.title}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = `https://images.unsplash.com/photo-${getRandomPropertyImage()}?w=400&h=300&fit=crop&crop=entropy`;
                            }}
                          />
                          {/* Elegant Match Score Badge */}
                          <div className="absolute top-2 left-2">
                            <Badge className={`px-2 py-1 text-xs font-semibold shadow-md ${
                              selectedProperty.matchScore >= 90 ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' : 
                              selectedProperty.matchScore >= 80 ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' : 
                              'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
                            } border-0`}>
                              <Star className="w-3 h-3 mr-1 fill-current" />
                              {selectedProperty.matchScore}%
                            </Badge>
                          </div>
                        </div>
                        
                        {/* Enhanced Content Section */}
                        <div className="flex-1 p-2 min-w-0">
                          {/* Title and Price */}
                          <div className="mb-2">
                            <h3 className="font-bold text-sm text-gray-900 mb-1 line-clamp-1 leading-tight">
                              {selectedProperty.title}
                            </h3>
                            <p className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                              {selectedProperty.price}
                            </p>
                          </div>
                          
                          {/* Location */}
                          <div className="flex items-center text-xs text-gray-600 mb-2">
                            <MapPin className="w-3 h-3 mr-1.5 text-gray-500 flex-shrink-0" />
                            <span className="line-clamp-1">{selectedProperty.location}</span>
                          </div>
                          
                          {/* Property Features */}
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-3 text-xs text-gray-600">
                              <div className="flex items-center bg-gray-50 px-2 py-1 rounded-md">
                                <Bed className="w-3 h-3 mr-1 text-gray-500" />
                                <span className="font-medium">{selectedProperty.bedrooms}</span>
                              </div>
                              <div className="flex items-center bg-gray-50 px-2 py-1 rounded-md">
                                <Bath className="w-3 h-3 mr-1 text-gray-500" />
                                <span className="font-medium">{selectedProperty.bathrooms}</span>
                              </div>
                              <div className="flex items-center bg-gray-50 px-2 py-1 rounded-md">
                                <Square className="w-3 h-3 mr-1 text-gray-500" />
                                <span className="font-medium">{selectedProperty.sqft.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onWatchlistToggle(selectedProperty.id)}
                              className={`text-xs h-8 px-3 rounded-full border-2 transition-all flex-1 ${
                                selectedProperty.isWatched 
                                  ? 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100' 
                                  : 'border-gray-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600'
                              }`}
                            >
                              <Heart className={`w-3 h-3 mr-1.5 ${selectedProperty.isWatched ? 'fill-current' : ''}`} />
                              {selectedProperty.isWatched ? 'Saved' : 'Save'}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onAskAI?.(selectedProperty.title)}
                              className="text-xs h-8 px-3 rounded-full border-2 border-gray-200 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 transition-all flex-1"
                            >
                              <Sparkles className="w-3 h-3 mr-1.5" />
                              Ask AI
                            </Button>
                            <Button 
                              size="sm" 
                              className="text-xs h-8 px-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md transition-all hover:shadow-lg flex-1"
                              onClick={() => onPropertyClick(selectedProperty.id)}
                            >
                              <Eye className="w-3 h-3 mr-1.5" />
                              View
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function getRandomPropertyImage(): string {
  const images = [
    '1564013799919-ab600027ffc6',
    '1570129477492-45c003edd2be',
    '1600596542815-ffade4c69d0a',
    '1582407942054-465a014f0c0a',
    '1564013799919-ab600027ffc6',
    '1570129477492-45c003edd2be'
  ];
  return images[Math.floor(Math.random() * images.length)];
}
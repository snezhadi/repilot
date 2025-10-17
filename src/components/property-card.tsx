import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MapPin, Bed, Bath, Square, Star } from "lucide-react";
import Link from "next/link";

// Helper function to get random property images from Unsplash
const getRandomPropertyImage = () => {
  const images = [
    '1564013799919-abcd0274cd55', // Modern house
    '1568605114967-8130f3a36994', // Luxury home
    '1570129477492-45c003edd2be', // Contemporary house
    '1600596542815-ffade4c69d0a', // Beautiful home
    '1600047509807-ba8f99d2cdde', // Modern architecture
    '1600607687939-ce8a6c25118c', // Luxury property
    '1600566753190-17d0d3beb06e', // Family home
    '1600607687644-71583218c972', // Modern interior
  ];
  return images[Math.floor(Math.random() * images.length)];
};

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

interface PropertyCardProps {
  property: Property;
  onWatchlistToggle: (id: string) => void;
  onRemove: (id: string) => void;
}

export function PropertyCard({ property, onWatchlistToggle, onRemove }: PropertyCardProps) {
  return (
    <Card className="w-full hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="p-0">
        <div className="relative">
          <img 
            src={property.image} 
            alt={property.title}
            className="w-full h-48 object-cover rounded-t-lg"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `https://images.unsplash.com/photo-${getRandomPropertyImage()}?w=400&h=300&fit=crop&crop=entropy`;
            }}
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
      
      <CardContent className="space-y-3">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg">{property.title}</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onWatchlistToggle(property.id)}
            className={`p-1 h-auto ${property.isWatched ? 'text-red-500' : 'text-muted-foreground'}`}
          >
            <Heart className={`w-4 h-4 ${property.isWatched ? 'fill-current' : ''}`} />
          </Button>
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
        
        <div className="flex gap-2">
          <Link href={`/property/${property.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              View Details
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onRemove(property.id)}
            className="text-red-500 hover:text-red-700"
          >
            Remove
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}





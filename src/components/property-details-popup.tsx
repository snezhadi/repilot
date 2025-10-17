"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Car, 
  Calendar,
  ChevronLeft,
  ChevronRight,
  Star,
  Users,
  Home,
  TreePine,
  Wifi,
  Shield,
  ParkingCircle
} from "lucide-react";

interface PropertyDetails {
  id: string;
  title: string;
  price: string;
  address: string;
  images: string[];
  description: string;
  features: {
    bedrooms: number;
    bathrooms: number;
    squareFeet: number;
    parking: number;
    yearBuilt: number;
    propertyType: string;
    lotSize: string;
    hoaFees: string;
  };
  isWatched: boolean;
}

interface PropertyDetailsPopupProps {
  propertyId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PropertyDetailsPopup({ propertyId, isOpen, onClose }: PropertyDetailsPopupProps) {
  const [property, setProperty] = useState<PropertyDetails | null>(null);
  const [isWatched, setIsWatched] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (propertyId && isOpen) {
      // Mock property data - in a real app, this would be fetched from an API
      const mockPropertyDetails: PropertyDetails = {
        id: propertyId,
        title: "Modern Family Home in Richmond Hill",
        price: "$1,250,000",
        address: "88 Bantry Ave #5, Richmond Hill, ON L4C 3N2",
        images: [
          "/property1.jpg",
          "/property2.jpg", 
          "/property3.jpg",
          "/property4.jpg"
        ],
        description: "This stunning modern home offers the perfect blend of contemporary design and family-friendly living. Located in the heart of Richmond Hill, this property provides easy access to top-rated schools, shopping centers, and major highways. The open-concept layout creates a spacious feel, while the premium finishes throughout add a touch of luxury to everyday living.",
        features: {
          bedrooms: 4,
          bathrooms: 3,
          squareFeet: 2500,
          parking: 2,
          yearBuilt: 2018,
          propertyType: "Detached",
          lotSize: "50x120 ft",
          hoaFees: "$0"
        },
        isWatched: false
      };
      
      setProperty(mockPropertyDetails);
      setIsWatched(mockPropertyDetails.isWatched);
      setCurrentImageIndex(0);
    }
  }, [propertyId, isOpen]);

  const handleWatchlistToggle = () => {
    setIsWatched(!isWatched);
    // Here you would also update the property in your global state
  };

  const nextImage = () => {
    if (property) {
      setCurrentImageIndex((prev) => 
        prev === property.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (property) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? property.images.length - 1 : prev - 1
      );
    }
  };

  if (!isOpen || !property) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{property.title}</h1>
              <p className="text-gray-600 flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {property.address}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleWatchlistToggle}
              className="flex items-center space-x-2"
            >
              <Heart className={`w-4 h-4 ${isWatched ? 'fill-red-500 text-red-500' : ''}`} />
              <span>{isWatched ? 'Saved' : 'Save'}</span>
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
            {/* Left Column - Images */}
            <div className="space-y-4">
              <div className="relative">
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={property.images[currentImageIndex]}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Image Navigation */}
                {property.images.length > 1 && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                      onClick={nextImage}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </>
                )}
                
                {/* Image Indicators */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {property.images.map((_, index) => (
                    <button
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              </div>

              {/* Thumbnail Images */}
              <div className="grid grid-cols-4 gap-2">
                {property.images.map((image, index) => (
                  <button
                    key={index}
                    className={`aspect-video bg-gray-100 rounded-lg overflow-hidden border-2 ${
                      index === currentImageIndex ? 'border-blue-500' : 'border-transparent'
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <img
                      src={image}
                      alt={`${property.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column - Details */}
            <div className="space-y-6">
              {/* Price */}
              <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <div className="text-4xl font-bold text-gray-900 mb-2">{property.price}</div>
                <Badge variant="secondary" className="text-sm">
                  <Star className="w-4 h-4 mr-1" />
                  95% Match
                </Badge>
              </div>

              {/* Key Features */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Property Details</h3>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <Bed className="w-5 h-5 text-blue-600" />
                      <div>
                        <div className="font-medium">{property.features.bedrooms}</div>
                        <div className="text-sm text-gray-600">Bedrooms</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Bath className="w-5 h-5 text-blue-600" />
                      <div>
                        <div className="font-medium">{property.features.bathrooms}</div>
                        <div className="text-sm text-gray-600">Bathrooms</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Square className="w-5 h-5 text-blue-600" />
                      <div>
                        <div className="font-medium">{property.features.squareFeet.toLocaleString()} sq ft</div>
                        <div className="text-sm text-gray-600">Living Area</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Car className="w-5 h-5 text-blue-600" />
                      <div>
                        <div className="font-medium">{property.features.parking}</div>
                        <div className="text-sm text-gray-600">Parking</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <div>
                        <div className="font-medium">{property.features.yearBuilt}</div>
                        <div className="text-sm text-gray-600">Year Built</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Home className="w-5 h-5 text-blue-600" />
                      <div>
                        <div className="font-medium">{property.features.propertyType}</div>
                        <div className="text-sm text-gray-600">Type</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Description */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Description</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{property.description}</p>
                </CardContent>
              </Card>

              {/* Amenities */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Amenities</h3>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center space-x-2">
                      <Wifi className="w-4 h-4 text-green-600" />
                      <span className="text-sm">High-Speed Internet</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Security System</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <TreePine className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Garden</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ParkingCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Garage</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Property ID: {property.id} • Listed by AI Pilot
            </div>
            <div className="flex space-x-3">
              <Button variant="outline">
                Schedule Tour
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Contact Agent
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

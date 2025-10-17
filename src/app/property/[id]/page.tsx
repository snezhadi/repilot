"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Heart, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Star, 
  Car, 
  Calendar,
  DollarSign,
  TrendingUp,
  Home,
  ArrowLeft
} from "lucide-react";
import { CustomSidebar } from "@/components/custom-sidebar";

interface PropertyDetails {
  id: string;
  title: string;
  price: string;
  location: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  lotSize: string;
  yearBuilt: number;
  propertyType: string;
  images: string[];
  matchScore: number;
  aiReason: string;
  description: string;
  features: string[];
  nearbySchools: Array<{
    name: string;
    rating: number;
    distance: string;
  }>;
  marketData: {
    pricePerSqft: string;
    estimatedMonthlyPayment: string;
    propertyTax: string;
    hoaFees: string;
  };
  isWatched: boolean;
}

export default function PropertyDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const propertyId = params.id as string;
  const [property, setProperty] = useState<PropertyDetails | null>(null);
  const [isWatched, setIsWatched] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    // Simulate fetching property details
    const mockPropertyDetails: PropertyDetails = {
      id: propertyId,
      title: "Modern Family Home with Mountain Views",
      price: "$750,000",
      location: "Downtown District",
      address: "1234 Mountain View Drive, Downtown District, CA 90210",
      bedrooms: 4,
      bathrooms: 3,
      sqft: 2800,
      lotSize: "0.25 acres",
      yearBuilt: 2018,
      propertyType: "Single Family Home",
      images: [
        "/property1.jpg",
        "/property2.jpg",
        "/property3.jpg",
        "/property4.jpg"
      ],
      matchScore: 92,
      aiReason: "Perfect for families with excellent schools nearby and spacious layout for growing families. The mountain views and modern amenities make this an ideal family home.",
      description: "This stunning modern family home offers the perfect blend of luxury and comfort. Featuring an open-concept design with high ceilings, premium finishes, and breathtaking mountain views. The gourmet kitchen includes stainless steel appliances and granite countertops. The master suite features a spa-like bathroom and walk-in closet. The backyard is perfect for entertaining with a covered patio and mature landscaping.",
      features: [
        "Open-concept living area",
        "Gourmet kitchen with island",
        "Master suite with walk-in closet",
        "Spa-like master bathroom",
        "Covered patio",
        "Mountain views",
        "Hardwood floors",
        "Central air conditioning",
        "Attached 2-car garage",
        "Mature landscaping"
      ],
      nearbySchools: [
        { name: "Downtown Elementary", rating: 9, distance: "0.3 miles" },
        { name: "Central Middle School", rating: 8, distance: "0.8 miles" },
        { name: "Downtown High School", rating: 9, distance: "1.2 miles" }
      ],
      marketData: {
        pricePerSqft: "$268",
        estimatedMonthlyPayment: "$3,245",
        propertyTax: "$8,750/year",
        hoaFees: "$150/month"
      },
      isWatched: false
    };

    setProperty(mockPropertyDetails);
    setIsWatched(mockPropertyDetails.isWatched);
  }, [propertyId]);

  const handleWatchlistToggle = () => {
    setIsWatched(!isWatched);
    // Here you would also update the property in your global state
  };

  const handleBackNavigation = () => {
    // Always use browser back navigation to return to the exact previous state
    router.back();
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

  if (!property) {
    return (
      <div className="min-h-screen bg-background">
        <CustomSidebar activePage="home" />
        <div className="ml-16 flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading property details...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <CustomSidebar activePage="home" />
      
      <div className="ml-16">
        {/* Header */}
        <div className="border-b border-border bg-card">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex items-center space-x-2"
                  onClick={handleBackNavigation}
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </Button>
                <Separator orientation="vertical" className="h-6" />
                <div>
                  <h1 className="text-2xl font-bold">{property.title}</h1>
                  <p className="text-muted-foreground">{property.address}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Badge 
                  className={`${
                    property.matchScore >= 80 ? 'bg-green-500' : 
                    property.matchScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                >
                  {property.matchScore}% Match
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleWatchlistToggle}
                  className={`flex items-center space-x-2 ${isWatched ? 'text-red-500 border-red-500' : ''}`}
                >
                  <Heart className={`w-4 h-4 ${isWatched ? 'fill-current' : ''}`} />
                  <span>{isWatched ? 'Watched' : 'Watch'}</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Image Gallery */}
              <Card>
                <CardHeader className="p-0">
                  <div className="relative">
                    <img 
                      src={property.images[currentImageIndex]} 
                      alt={property.title}
                      className="w-full h-96 object-cover rounded-t-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-between p-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={prevImage}
                        className="bg-white bg-opacity-80 hover:bg-opacity-100"
                      >
                        ←
                      </Button>
                      <div className="flex space-x-2">
                        {property.images.map((_, index) => (
                          <div
                            key={index}
                            className={`w-2 h-2 rounded-full ${
                              index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                            }`}
                          />
                        ))}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={nextImage}
                        className="bg-white bg-opacity-80 hover:bg-opacity-100"
                      >
                        →
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Property Details */}
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold">Property Details</h2>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <Bed className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-2xl font-bold">{property.bedrooms}</p>
                      <p className="text-sm text-muted-foreground">Bedrooms</p>
                    </div>
                    <div className="text-center">
                      <Bath className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-2xl font-bold">{property.bathrooms}</p>
                      <p className="text-sm text-muted-foreground">Bathrooms</p>
                    </div>
                    <div className="text-center">
                      <Square className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-2xl font-bold">{property.sqft.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Square Feet</p>
                    </div>
                    <div className="text-center">
                      <Car className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-2xl font-bold">2</p>
                      <p className="text-sm text-muted-foreground">Garage</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Property Type</p>
                      <p className="font-medium">{property.propertyType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Year Built</p>
                      <p className="font-medium">{property.yearBuilt}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Lot Size</p>
                      <p className="font-medium">{property.lotSize}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Price per Sq Ft</p>
                      <p className="font-medium">{property.marketData.pricePerSqft}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Description */}
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold">Description</h2>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{property.description}</p>
                </CardContent>
              </Card>

              {/* Features */}
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold">Features</h2>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {property.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* AI Recommendation */}
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    <h2 className="text-xl font-semibold">AI Recommendation</h2>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{property.aiReason}</p>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Price Card */}
              <Card>
                <CardHeader>
                  <h3 className="text-2xl font-bold text-primary">{property.price}</h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Estimated Payment</span>
                      <span className="font-medium">{property.marketData.estimatedMonthlyPayment}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Property Tax</span>
                      <span className="font-medium">{property.marketData.propertyTax}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">HOA Fees</span>
                      <span className="font-medium">{property.marketData.hoaFees}</span>
                    </div>
                  </div>
                  <Separator />
                  <Button className="w-full" size="lg">
                    Schedule Viewing
                  </Button>
                  <Button variant="outline" className="w-full">
                    Contact Agent
                  </Button>
                </CardContent>
              </Card>

              {/* Market Data */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Market Insights</h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Price per Sq Ft</span>
                    <span className="font-medium">{property.marketData.pricePerSqft}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Market Trend</span>
                    <div className="flex items-center space-x-1 text-green-600">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-sm font-medium">+2.3%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Nearby Schools */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Nearby Schools</h3>
                </CardHeader>
                <CardContent className="space-y-3">
                  {property.nearbySchools.map((school, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{school.name}</p>
                        <p className="text-xs text-muted-foreground">{school.distance}</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{school.rating}/10</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}





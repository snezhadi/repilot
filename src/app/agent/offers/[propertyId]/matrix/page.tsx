"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { CustomSidebar } from "@/components/custom-sidebar";
import { multiOfferMatrix } from "@/data/agent-offers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Download, Filter, MapPin, Sparkles } from "lucide-react";

export default function OfferMatrixPage() {
  const params = useParams<{ propertyId: string }>();
  const property = multiOfferMatrix.find((item) => item.propertyId === params.propertyId) ?? multiOfferMatrix[0];

  return (
    <div className="flex min-h-screen bg-background">
      <CustomSidebar activePage="offers" mode="agent" />

      <div className="ml-16 flex-1 px-6 py-6">
        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
          <Link href="/agent/offers" className="inline-flex items-center gap-1 text-primary hover:underline">
            <ArrowLeft className="w-4 h-4" /> Back to offers
          </Link>
          <span>/</span>
          <span>Multi-offer matrix</span>
        </div>

        <Card className="mb-6">
          <CardContent className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-start gap-4">
              <img
                src={property.image}
                alt={property.propertyTitle}
                className="w-32 h-24 object-cover rounded-lg border"
              />
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-semibold">{property.propertyTitle}</h1>
                  <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                    {property.offerDeadline}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3" /> {property.propertyAddress}
                </p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span>List price: <span className="font-semibold text-foreground">{property.listPrice}</span></span>
                  <span>· Highest offer: {property.summary.highestOffer}</span>
                  <span>· Leading buyer: {property.summary.strongestBuyer}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className="gap-1">
                <Filter className="w-4 h-4" /> Filter columns
              </Button>
              <Button variant="outline" size="sm" className="gap-1">
                <Download className="w-4 h-4" /> Export PDF
              </Button>
              <Button size="sm" className="gap-1">
                <Sparkles className="w-4 h-4" /> AI recommendation
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-[2fr,1fr] gap-6">
          <Card className="overflow-hidden">
            <CardHeader className="px-6 py-4 border-b border-border">
              <CardTitle className="text-base">Offer comparison</CardTitle>
              <p className="text-sm text-muted-foreground">
                Colour coding highlights the strongest positions per term.
              </p>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="text-left px-6 py-3">Buyer</th>
                    <th className="text-left px-4 py-3">Offer price</th>
                    <th className="text-left px-4 py-3">Deposit</th>
                    <th className="text-left px-4 py-3">Closing</th>
                    <th className="text-left px-4 py-3">Financing</th>
                    <th className="text-left px-4 py-3">Inspection</th>
                    <th className="text-left px-4 py-3">Other conditions</th>
                    <th className="text-left px-4 py-3">Notes</th>
                    <th className="text-left px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {property.offers.map((offer) => (
                    <tr key={offer.offerId} className="border-t border-border hover:bg-muted/40 transition-colors">
                      <td className="px-6 py-4 w-64 min-w-[16rem]">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-9 h-9">
                            {offer.avatar ? (
                              <AvatarImage src={offer.avatar} alt={offer.clientName} />
                            ) : (
                              <AvatarFallback>{offer.clientName.slice(0, 2).toUpperCase()}</AvatarFallback>
                            )}
                          </Avatar>
                          <div>
                            <p className="font-semibold text-sm">{offer.clientName}</p>
                            <Badge
                              variant="outline"
                              className={`text-[10px] capitalize ${
                                offer.highlight === "best"
                                  ? "bg-green-100 text-green-700 border-green-200"
                                  : offer.highlight === "consider"
                                  ? "bg-blue-100 text-blue-700 border-blue-200"
                                  : offer.highlight === "risk"
                                  ? "bg-red-100 text-red-700 border-red-200"
                                  : ""
                              }`}
                            >
                              {offer.highlight ? offer.highlight : "in review"}
                            </Badge>
                          </div>
                        </div>
                      </td>
                      <td className={`px-4 py-4 font-semibold ${offer.highlight === "best" ? "bg-green-50" : ""}`}>
                        {offer.price}
                      </td>
                      <td className="px-4 py-4">{offer.deposit}</td>
                      <td className="px-4 py-4">{offer.closing}</td>
                      <td className="px-4 py-4">{offer.financing}</td>
                      <td className="px-4 py-4">{offer.inspection}</td>
                      <td className="px-4 py-4">{offer.conditions}</td>
                      <td className="px-4 py-4 min-w-[14rem] text-muted-foreground">{offer.notes}</td>
                      <td className="px-4 py-4">
                        <Link href={`/agent/offers?offerId=${offer.offerId}`} className="text-primary text-xs hover:underline">
                          View details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">AI recommendation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="text-muted-foreground">
                  Sellers value a firm offer with flexible closing. Patel Family leads but Alex Johnsons offer could compete by boosting deposit to 7.5% and waiving appliance warranty request.
                </p>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-3 h-3 text-primary mt-1" />
                    <p>Encourage Alex to match 7.5% deposit while holding firm on price—sellers likely to prioritize certainty over extra $10K.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-3 h-3 text-primary mt-1" />
                    <p>Offer short rent-back to offset seller timeline anxiety; sellers mentioned needing overlap dates.</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="gap-1">
                  <Sparkles className="w-3 h-3" /> Send summary to buyer
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Highlights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Strongest position</span>
                  <span className="font-medium text-foreground">{property.summary.strongestBuyer}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Highest offer</span>
                  <span className="font-medium text-foreground">{property.summary.highestOffer}</span>
                </div>
                <p className="text-xs text-muted-foreground border-t border-dashed border-border pt-2">
                  {property.summary.leverageNote}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

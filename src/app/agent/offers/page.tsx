"use client";

import { useMemo, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  agentOfferSummaries,
  offerComparables,
  offerHistory,
  negotiationInsights,
  scenarioSuggestions,
} from "@/data/agent-offers";
import { CustomSidebar } from "@/components/custom-sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  FileText,
  Lightbulb,
  ListFilter,
  MapPin,
  MinusCircle,
  Sparkles,
  TrendingUp,
  Send,
  FileCheck,
  AlertCircle,
  User,
  Building,
  DollarSign,
  Calendar,
  FileText as FileTextIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PropertyDetailsPopup } from "@/components/property-details-popup";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const insightTabs = ["Comparables", "Negotiation", "History"] as const;

type InsightTab = (typeof insightTabs)[number];

const statusToneClass = (tone: "default" | "success" | "warning" | "danger" | undefined) => {
  switch (tone) {
    case "success":
      return "bg-green-100 text-green-700 border-green-200";
    case "warning":
      return "bg-red-50 text-red-700 border-red-200";
    case "danger":
      return "bg-red-100 text-red-800 border-red-300";
    default:
      return "border-border text-muted-foreground";
  }
};

function AgentOffersPageContent() {
  const searchParams = useSearchParams();
  const initialOfferId = searchParams.get("offerId") ?? agentOfferSummaries[0]?.id;
  const [selectedOfferId, setSelectedOfferId] = useState(initialOfferId ?? "");
  const [isScenarioOpen, setIsScenarioOpen] = useState(false);
  const [propertyPopupId, setPropertyPopupId] = useState<string | null>(null);
  const [isPropertyPopupOpen, setIsPropertyPopupOpen] = useState(false);
  const [insightModal, setInsightModal] = useState<InsightTab | null>(null);
  const [isReviewSendOpen, setIsReviewSendOpen] = useState(false);
  const [formData, setFormData] = useState({
    buyerName: "",
    buyerEmail: "",
    coBuyerName: "",
    coBuyerEmail: "",
    propertyAddress: "",
    purchasePrice: "",
    deposit: "",
    closingDate: "",
    financingCondition: "",
    inspectionCondition: "",
    statusCertificateCondition: "",
    additionalClauses: "",
  });
  const selectedOffer = useMemo(
    () => agentOfferSummaries.find((offer) => offer.id === selectedOfferId) ?? agentOfferSummaries[0],
    [selectedOfferId]
  );

  const comparables = selectedOffer ? offerComparables[selectedOffer.id] ?? [] : [];
  const insights = selectedOffer ? negotiationInsights[selectedOffer.id] : undefined;
  const history = selectedOffer ? offerHistory[selectedOffer.id] ?? [] : [];
  const scenarios = selectedOffer ? scenarioSuggestions[selectedOffer.id] ?? [] : [];
  const depositHighlight = selectedOffer?.termHighlights.find((term) => term.label.toLowerCase().includes("deposit"));
  const closingHighlight = selectedOffer?.termHighlights.find((term) => term.label.toLowerCase().includes("closing"));
  const conditionHighlight = selectedOffer?.termHighlights.find((term) => term.label.toLowerCase().includes("condition"));
  
  // Helper function to convert date string like "Apr 30, 2024" to "YYYY-MM-DD" format
  const parseDateForInput = (dateStr: string | undefined): string => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return "";
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    } catch {
      return "";
    }
  };
  const normalizedInsights = useMemo(() => {
    if (!insights) return undefined;
    const insightsRecord = insights as unknown as Record<string, unknown>;
    if (insightsRecord.sellerProfile) {
      return insights as unknown as { sellerProfile: { summary: string; notes: string }; strategySteps: string[]; watchItems: string[] };
    }
    return {
      sellerProfile: {
        summary: (insightsRecord.leverageScore as string) ?? "Negotiation context",
        notes: (insightsRecord.summary as string) ?? "",
      },
      strategySteps: (insightsRecord.talkingPoints as string[]) ?? [],
      watchItems: [
        ...((insightsRecord.risks as string[]) ?? []),
        ...((insightsRecord.opportunity as string[]) ?? []),
      ],
    };
  }, [insights]);

  const normalizedHistory = useMemo(() => {
    return history.map((entry, index) => {
      const base = entry as unknown as Record<string, unknown>;
      return {
        id: entry.id,
        step: String(base.step ?? `Step ${index + 1}`),
        title: String(base.title ?? base.label ?? "Update"),
        summary: String(base.summary ?? base.description ?? ""),
        timestamp: String(base.timestamp ?? ""),
      };
    });
  }, [history]);

  return (
    <div className="flex min-h-screen bg-background">
      <CustomSidebar activePage="offers" mode="agent" />

      {/* Offer list */}
      <div className="ml-16 w-80 border-r border-border flex flex-col bg-card">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">Offer Workspace</h2>
            <Badge variant="secondary" className="text-xs">
              {agentOfferSummaries.length} active
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">Monitor every offer from draft to closing.</p>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
          <span>Client / Property</span>
          <span>Status</span>
        </div>
        <div className="flex-1 overflow-y-auto">
          {agentOfferSummaries.map((offer) => {
            const isActive = selectedOffer?.id === offer.id;
            return (
              <div
                key={offer.id}
                className={`px-4 py-4 border-b border-border transition-colors ${
                  isActive ? "bg-muted/40" : "hover:bg-muted/20"
                }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    setSelectedOfferId(offer.id);
                  }}
                  className="w-full text-left"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar className="w-9 h-9">
                        {offer.clientAvatar ? (
                          <AvatarImage src={offer.clientAvatar} alt={offer.clientName} />
                        ) : (
                          <AvatarFallback>{offer.clientName.slice(0, 2).toUpperCase()}</AvatarFallback>
                        )}
                      </Avatar>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-sm truncate">{offer.clientName}</p>
                        </div>
                        <span
                          role="button"
                          tabIndex={0}
                          onClick={(event) => {
                            event.stopPropagation();
                            setPropertyPopupId(offer.propertyId);
                            setIsPropertyPopupOpen(true);
                          }}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault();
                              event.stopPropagation();
                              setPropertyPopupId(offer.propertyId);
                              setIsPropertyPopupOpen(true);
                            }
                          }}
                          className="text-xs text-primary hover:underline cursor-pointer"
                        >
                          {offer.propertyAddress}
                        </span>
                        {offer.countdownLabel && (
                          <Badge
                            variant="outline"
                            className="mt-2 text-[10px] bg-red-50 text-red-700 border-red-200"
                          >
                            {offer.countdownLabel}
                          </Badge>
                        )}
                        <Link
                          href={`/offer/${offer.id}/status`}
                          onClick={(e) => e.stopPropagation()}
                          className="mt-1 text-xs text-primary hover:underline flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3 h-3" /> Signature: 2/3
                        </Link>
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <Badge
                        variant="outline"
                        className={`text-[10px] capitalize ${statusToneClass(offer.statusTone)}`}
                      >
                        {offer.statusLabel}
                      </Badge>
                      <p className="text-sm font-semibold">{offer.offerPrice}</p>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{offer.preview}</p>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main canvas */}
      <div className="flex-1 flex flex-col">
        {selectedOffer ? (
          <div className="px-6 py-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-4">
                <img
                  src={selectedOffer.propertyImage}
                  alt={selectedOffer.propertyTitle}
                  className="w-32 h-24 object-cover rounded-lg border"
                />
                <div className="space-y-3">
                  <div>
                    <button
                      type="button"
                      onClick={() => {
                        setPropertyPopupId(selectedOffer.propertyId);
                        setIsPropertyPopupOpen(true);
                      }}
                      className="text-left text-2xl font-semibold text-foreground hover:underline"
                    >
                      {selectedOffer.propertyAddress}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 text-sm">
                    {depositHighlight && (
                      <Badge variant="outline" className="rounded-full px-3 py-1 text-xs border-blue-200 text-blue-700">
                        <span className="font-medium mr-1">Deposit:</span> {depositHighlight.value}
                      </Badge>
                    )}
                    {closingHighlight && (
                      <Badge variant="outline" className="rounded-full px-3 py-1 text-xs border-purple-200 text-purple-700">
                        <span className="font-medium mr-1">Closing:</span> {closingHighlight.value}
                      </Badge>
                    )}
                    {conditionHighlight && (
                      <button
                        type="button"
                        onClick={() => setInsightModal("Negotiation")}
                        className="rounded-full border border-blue-200 text-blue-700 px-3 py-1 text-xs font-medium hover:bg-blue-50"
                      >
                        Conditions: <span className="ml-1 font-normal">{conditionHighlight.value}</span>
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Badge
                      variant="outline"
                      className={`capitalize ${statusToneClass(selectedOffer.statusTone)} rounded-full px-3 py-1 text-xs`}
                    >
                      {selectedOffer.statusLabel}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-3 text-sm text-muted-foreground min-w-[280px]">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Last updated {selectedOffer.lastUpdated}
                </span>
                <div className="grid grid-cols-2 gap-2 w-full">
                  {insightTabs.map((tab) => (
                    <Button
                      key={tab}
                      size="sm"
                      variant="outline"
                      className="rounded-full"
                      onClick={() => setInsightModal(tab)}
                    >
                      {tab}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    onClick={() => setIsScenarioOpen(true)}
                  >
                    Simulate counter
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Offer Form Builder */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">Prepare Offer Form (OREA)</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Fill out the official offer form. AI will validate and highlight risks.
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => {
                        setFormData({
                          buyerName: selectedOffer.clientName,
                          buyerEmail: "",
                          coBuyerName: "",
                          coBuyerEmail: "",
                          propertyAddress: selectedOffer.propertyAddress,
                          purchasePrice: selectedOffer.offerPrice.replace(/[^0-9]/g, ""),
                          deposit: depositHighlight?.value || "",
                          closingDate: parseDateForInput(closingHighlight?.value),
                          financingCondition: "3 days",
                          inspectionCondition: "2 days",
                          statusCertificateCondition: "",
                          additionalClauses: "",
                        });
                        setIsReviewSendOpen(true);
                      }}
                      className="gap-1"
                    >
                      <FileCheck className="w-3 h-3" /> Review & Send
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Parties Section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-border">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <h3 className="font-semibold text-sm">Parties</h3>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="buyer-name">Buyer Name</Label>
                        <Input
                          id="buyer-name"
                          value={formData.buyerName || selectedOffer.clientName}
                          onChange={(e) => setFormData({ ...formData, buyerName: e.target.value })}
                          placeholder="Full legal name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="buyer-email">Buyer Email</Label>
                        <Input
                          id="buyer-email"
                          type="email"
                          value={formData.buyerEmail}
                          onChange={(e) => setFormData({ ...formData, buyerEmail: e.target.value })}
                          placeholder="email@example.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="co-buyer-name">Co-Buyer Name (Optional)</Label>
                        <Input
                          id="co-buyer-name"
                          value={formData.coBuyerName}
                          onChange={(e) => setFormData({ ...formData, coBuyerName: e.target.value })}
                          placeholder="Full legal name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="co-buyer-email">Co-Buyer Email (Optional)</Label>
                        <Input
                          id="co-buyer-email"
                          type="email"
                          value={formData.coBuyerEmail}
                          onChange={(e) => setFormData({ ...formData, coBuyerEmail: e.target.value })}
                          placeholder="email@example.com"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Property Section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-border">
                      <Building className="w-4 h-4 text-muted-foreground" />
                      <h3 className="font-semibold text-sm">Property</h3>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="property-address">Property Address</Label>
                      <Input
                        id="property-address"
                        value={formData.propertyAddress || selectedOffer.propertyAddress}
                        onChange={(e) => setFormData({ ...formData, propertyAddress: e.target.value })}
                        placeholder="Full property address"
                      />
                    </div>
                  </div>

                  {/* Price & Deposit Section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-border">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      <h3 className="font-semibold text-sm">Price & Deposit</h3>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="purchase-price">Purchase Price</Label>
                        <Input
                          id="purchase-price"
                          type="number"
                          value={formData.purchasePrice || selectedOffer.offerPrice.replace(/[^0-9]/g, "")}
                          onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                          placeholder="1,200,000"
                        />
                        <p className="text-xs text-muted-foreground">Current: {selectedOffer.offerPrice}</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="deposit">Deposit Amount</Label>
                        <Input
                          id="deposit"
                          value={formData.deposit || depositHighlight?.value || ""}
                          onChange={(e) => setFormData({ ...formData, deposit: e.target.value })}
                          placeholder="$50,000"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Closing Section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-border">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <h3 className="font-semibold text-sm">Closing</h3>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="closing-date">Closing Date</Label>
                      <Input
                        id="closing-date"
                        type="date"
                        value={formData.closingDate || parseDateForInput(closingHighlight?.value) || ""}
                        onChange={(e) => setFormData({ ...formData, closingDate: e.target.value })}
                      />
                      <p className="text-xs text-muted-foreground">Flex window: Apr 25 – May 10. Sellers prefer earlier.</p>
                    </div>
                  </div>

                  {/* Conditions Section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-border">
                      <FileTextIcon className="w-4 h-4 text-muted-foreground" />
                      <h3 className="font-semibold text-sm">Conditions</h3>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor="financing">Financing Condition</Label>
                        <Input
                          id="financing"
                          value={formData.financingCondition || "3 days"}
                          onChange={(e) => setFormData({ ...formData, financingCondition: e.target.value })}
                          placeholder="3 days"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="inspection">Inspection Condition</Label>
                        <Input
                          id="inspection"
                          value={formData.inspectionCondition || "2 days"}
                          onChange={(e) => setFormData({ ...formData, inspectionCondition: e.target.value })}
                          placeholder="2 days"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="status-cert">Status Certificate</Label>
                        <Input
                          id="status-cert"
                          value={formData.statusCertificateCondition}
                          onChange={(e) => setFormData({ ...formData, statusCertificateCondition: e.target.value })}
                          placeholder="N/A or days"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Additional Clauses */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-border">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <h3 className="font-semibold text-sm">Additional Clauses</h3>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="clauses">Special Terms & Conditions</Label>
                      <Textarea
                        id="clauses"
                        value={formData.additionalClauses}
                        onChange={(e) => setFormData({ ...formData, additionalClauses: e.target.value })}
                        placeholder="Enter any additional clauses or special conditions..."
                        className="min-h-[100px]"
                      />
                    </div>
                  </div>

                  {/* AI Helper Section */}
                  <Card className="bg-blue-50/50 border-blue-200">
                    <CardContent className="p-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-blue-600" />
                        <span className="font-semibold text-sm text-blue-900">AI Validation</span>
                      </div>
                      <div className="space-y-1 text-xs text-blue-800">
                        <p>✓ All required fields are complete</p>
                        <p>✓ Financing condition expires 2 days before closing (recommended)</p>
                        <p className="flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span className="text-yellow-700">Review: Closing date may conflict with seller timeline</span>
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>

              {/* Bottom Cards - Full Width */}
              <div className="grid gap-4 sm:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Signature Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                      2/3 Signed
                    </Badge>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3 text-green-600" />
                      <span>Alex Johnson (Buyer)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3 text-yellow-600" />
                      <span>Sarah Williams (Co-Buyer) - Pending</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3 text-green-600" />
                      <span>Agent</span>
                    </div>
                  </div>
                  <Link href={`/offer/${selectedOffer.id}/status`} className="text-xs text-primary hover:underline mt-2 block">
                    View full status →
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-yellow-500" />
                    <CardTitle className="text-sm">Todays action items</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <Badge variant="outline" className="mt-0.5 text-[10px] bg-blue-50 text-blue-700">
                      Due 6h
                    </Badge>
                    <p>Confirm lender letter before counter expires at 9:00 PM.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge variant="outline" className="mt-0.5 text-[10px] bg-green-50 text-green-700">
                      Optional
                    </Badge>
                    <p>Draft buyer love-letter template – AI can assist.</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-purple-500" />
                    <CardTitle className="text-sm">Deal momentum</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Momentum</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Favorable
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-xs">
                    Sellers motivated to close by April end. Competitor offer booked tomorrow morning—respond tonight to stay in pole position.
                  </p>
                </CardContent>
              </Card>
            </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center text-muted-foreground">
            Select an offer to get started.
          </div>
        )}
      </div>

      <Dialog open={isScenarioOpen} onOpenChange={setIsScenarioOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Simulate counter strategy</DialogTitle>
            <DialogDescription>
              Preview AI-recommended counter scenarios. Apply one to update the offer instantly.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 overflow-y-auto pr-2 max-h-[60vh]">
            {scenarios.length === 0 && <p className="text-sm text-muted-foreground">No scenarios available yet.</p>}
            {scenarios.map((scenario) => (
              <Card key={scenario.id}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm">{scenario.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{scenario.summary}</p>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-[10px] uppercase ${
                        scenario.riskLevel === "low"
                          ? "bg-green-100 text-green-700 border-green-200"
                          : scenario.riskLevel === "medium"
                          ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                          : "bg-red-100 text-red-700 border-red-200"
                      }`}
                    >
                      {scenario.riskLevel} risk
                    </Badge>
                  </div>
                  <div className="grid gap-2 text-sm md:grid-cols-2">
                    {scenario.diff.price && (
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px]">Price</Badge>
                        <span>{scenario.diff.price}</span>
                      </div>
                    )}
                    {scenario.diff.deposit && (
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px]">Deposit</Badge>
                        <span>{scenario.diff.deposit}</span>
                      </div>
                    )}
                    {scenario.diff.closing && (
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px]">Closing</Badge>
                        <span>{scenario.diff.closing}</span>
                      </div>
                    )}
                    {scenario.diff.conditions && (
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px]">Conditions</Badge>
                        <span>{scenario.diff.conditions}</span>
                      </div>
                    )}
                  </div>
                  <Button size="sm" className="gap-1">
                    <ArrowRight className="w-3 h-3" /> Apply scenario
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsScenarioOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!insightModal} onOpenChange={(open) => !open && setInsightModal(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{insightModal}</DialogTitle>
            <DialogDescription>
              {insightModal === "Comparables" && "Recent neighborhood performance to calibrate your offer."}
              {insightModal === "Negotiation" && "Strategy cues and seller signals to navigate your next move."}
              {insightModal === "History" && "Milestones captured since this offer was created."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-[70vh] overflow-y-auto">
            {insightModal === "Comparables" && (
              <div className="space-y-3">
                {comparables.length === 0 && (
                  <p className="text-sm text-muted-foreground">No comps available yet for this area.</p>
                )}
                {comparables.map((comp) => (
                  <Card key={comp.id}>
                    <CardContent className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold">{comp.address}</p>
                          <p className="text-xs text-muted-foreground">Sold {comp.soldDate} · {comp.distance} away</p>
                        </div>
                        <Badge
                          variant="outline"
                          className={`text-[10px] ${
                            comp.deltaTone === "positive"
                              ? "bg-green-100 text-green-700 border-green-200"
                              : comp.deltaTone === "warning"
                              ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                              : "bg-muted"
                          }`}
                        >
                          {comp.deltaLabel}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{comp.price}</span>
                        <span>{comp.beds} bed</span>
                        <span>{comp.baths} bath</span>
                        <span>{comp.sqft.toLocaleString()} sqft</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            {insightModal === "Negotiation" && normalizedInsights && (
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-200 text-[10px]">
                        Seller profile
                      </Badge>
                      <span className="text-sm font-medium">{normalizedInsights.sellerProfile.summary}</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{normalizedInsights.sellerProfile.notes}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200 text-[10px]">
                        Strategy
                      </Badge>
                      <span className="text-sm font-medium">Recommended approach</span>
                    </div>
                    <ul className="list-disc pl-4 text-sm space-y-2 text-muted-foreground">
                      {normalizedInsights.strategySteps.map((step: string) => (
                        <li key={step}>{step}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200 text-[10px]">
                        Signals
                      </Badge>
                      <span className="text-sm font-medium">Things to watch</span>
                    </div>
                    <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">
                      {normalizedInsights.watchItems.map((item: string) => (
                        <li key={item} className="flex items-start gap-2">
                          <ArrowRight className="w-3 h-3 mt-1 text-muted-foreground" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            )}
            {insightModal === "History" && (
              <div className="space-y-3">
                {normalizedHistory.map((entry) => (
                  <Card key={entry.id}>
                    <CardContent className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[10px] bg-muted">
                            {entry.step}
                          </Badge>
                          <span className="text-sm font-medium">{entry.title}</span>
                        </div>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {entry.timestamp}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{entry.summary}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInsightModal(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <PropertyDetailsPopup
        propertyId={propertyPopupId}
        isOpen={isPropertyPopupOpen}
        onClose={() => setIsPropertyPopupOpen(false)}
      />

      {/* Review & Send Dialog */}
      <Dialog open={isReviewSendOpen} onOpenChange={setIsReviewSendOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Review & Send Offer for Signature</DialogTitle>
            <DialogDescription>
              Review the offer form and send it for e-signature using DocuSign or Authentisign.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 overflow-y-auto pr-2 max-h-[70vh]">
            {/* Form Preview */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm">Offer Summary</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <Card>
                  <CardContent className="p-4 space-y-2">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">Buyer</p>
                    <p className="text-sm font-semibold">{formData.buyerName || selectedOffer.clientName}</p>
                    {formData.buyerEmail && <p className="text-xs text-muted-foreground">{formData.buyerEmail}</p>}
                    {formData.coBuyerName && (
                      <>
                        <p className="text-xs text-muted-foreground mt-2">Co-Buyer:</p>
                        <p className="text-sm font-semibold">{formData.coBuyerName}</p>
                      </>
                    )}
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 space-y-2">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">Property</p>
                    <p className="text-sm font-semibold">{formData.propertyAddress || selectedOffer.propertyAddress}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 space-y-2">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">Purchase Price</p>
                    <p className="text-sm font-semibold">
                      ${formData.purchasePrice ? parseInt(formData.purchasePrice).toLocaleString() : selectedOffer.offerPrice}
                    </p>
                    <p className="text-xs text-muted-foreground">Deposit: {formData.deposit || depositHighlight?.value || "Not specified"}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 space-y-2">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">Closing Date</p>
                    <p className="text-sm font-semibold">
                      {formData.closingDate 
                        ? new Date(formData.closingDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
                        : closingHighlight?.value || "Not specified"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Financing: {formData.financingCondition || "3 days"} • Inspection: {formData.inspectionCondition || "2 days"}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* E-Sign Provider Selection */}
            <div className="space-y-4 border-t border-border pt-4">
              <h3 className="font-semibold text-sm">E-Signature Provider</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <Card className="cursor-pointer hover:border-primary transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-blue-100 flex items-center justify-center">
                        <FileCheck className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">DocuSign</p>
                        <p className="text-xs text-muted-foreground">Industry standard e-signature</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:border-primary transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-purple-100 flex items-center justify-center">
                        <FileCheck className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">Authentisign</p>
                        <p className="text-xs text-muted-foreground">Real estate focused platform</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Recipients */}
            <div className="space-y-3 border-t border-border pt-4">
              <h3 className="font-semibold text-sm">Recipients</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span className="text-sm">{formData.buyerName || selectedOffer.clientName}</span>
                  <Badge variant="outline" className="text-xs">Buyer</Badge>
                </div>
                {formData.coBuyerName && (
                  <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="text-sm">{formData.coBuyerName}</span>
                    <Badge variant="outline" className="text-xs">Co-Buyer</Badge>
                  </div>
                )}
              </div>
            </div>

            {/* AI Risk Highlights */}
            <Card className="bg-yellow-50/50 border-yellow-200">
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                  <span className="font-semibold text-sm text-yellow-900">Important Terms to Review</span>
                </div>
                <div className="space-y-1 text-xs text-yellow-800">
                  <p>• Financing condition expires 2 days before closing — ensure lender approval timeline aligns</p>
                  <p>• Inspection window is 2 days — coordinate inspector availability</p>
                  {formData.additionalClauses && (
                    <p>• Additional clauses included — client should review carefully</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          <DialogFooter className="flex-col gap-2">
            <div className="flex items-center gap-2 w-full">
              <Button variant="outline" onClick={() => setIsReviewSendOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button
                onClick={() => {
                  // In production, this would integrate with DocuSign/Authentisign API
                  // For now, show a success message and link to status page
                  alert("Offer sent for signature! You can track the signature status from the offer workspace.");
                  setIsReviewSendOpen(false);
                }}
                className="gap-1 flex-1"
              >
                <Send className="w-3 h-3" /> Send for Signature
              </Button>
            </div>
            <div className="text-xs text-muted-foreground text-center w-full">
              <Link href={`/offer/${selectedOffer.id}/status`} className="text-primary hover:underline">
                View signature status →
              </Link>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function AgentOffersPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>}>
      <AgentOffersPageContent />
    </Suspense>
  );
}

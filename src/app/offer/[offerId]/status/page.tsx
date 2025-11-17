"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { CustomSidebar } from "@/components/custom-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  Clock, 
  Mail, 
  XCircle, 
  Send,
  ArrowLeft,
  FileText,
  User
} from "lucide-react";
import { agentOfferSummaries } from "@/data/agent-offers";

type SignatureStatus = "pending" | "sent" | "viewed" | "signed" | "completed" | "cancelled";

interface Signer {
  id: string;
  name: string;
  email: string;
  role: "buyer" | "co-buyer" | "agent";
  status: SignatureStatus;
  signedAt?: Date;
  viewedAt?: Date;
}

export default function OfferSignatureStatusPage() {
  const params = useParams<{ offerId: string }>();
  const offerId = Array.isArray(params?.offerId) ? params.offerId[0] : params?.offerId;
  const offer = agentOfferSummaries.find((o) => o.id === offerId);

  const [signers, setSigners] = useState<Signer[]>([
    {
      id: "1",
      name: offer?.clientName || "Alex Johnson",
      email: "alex.johnson@email.com",
      role: "buyer",
      status: "signed",
      signedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      viewedAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    },
    {
      id: "2",
      name: "Sarah Williams",
      email: "sarah.williams@email.com",
      role: "co-buyer",
      status: "viewed",
      viewedAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    },
    {
      id: "3",
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      role: "agent",
      status: "signed",
      signedAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    },
  ]);

  const getStatusIcon = (status: SignatureStatus) => {
    switch (status) {
      case "completed":
      case "signed":
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case "viewed":
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case "sent":
        return <Mail className="w-5 h-5 text-blue-600" />;
      case "cancelled":
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: SignatureStatus) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Completed</Badge>;
      case "signed":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Signed</Badge>;
      case "viewed":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Viewed</Badge>;
      case "sent":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Sent</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  };

  const timelineSteps = [
    { id: "sent", label: "Sent", timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000) },
    { id: "viewed", label: "Viewed", timestamp: signers.find((s) => s.viewedAt)?.viewedAt },
    { id: "signed-buyer", label: "Signed by Buyer", timestamp: signers.find((s) => s.role === "buyer" && s.signedAt)?.signedAt },
    { id: "signed-co-buyer", label: "Signed by Co-Buyer", timestamp: signers.find((s) => s.role === "co-buyer" && s.signedAt)?.signedAt },
    { id: "completed", label: "Completed", timestamp: signers.every((s) => s.status === "signed" || s.status === "completed") ? new Date() : undefined },
  ].filter((step) => step.timestamp);

  const allSigned = signers.every((s) => s.status === "signed" || s.status === "completed");
  const isAgent = false; // This would be determined by auth in production

  if (!offer) {
    return (
      <div className="flex min-h-screen bg-background">
        <CustomSidebar activePage="home" mode={isAgent ? "agent" : "client"} />
        <div className="flex-1 ml-16 flex items-center justify-center">
          <Card className="max-w-md">
            <CardContent className="p-6 text-center">
              <XCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Offer Not Found</h2>
              <p className="text-muted-foreground">This offer link may be invalid or expired.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <CustomSidebar activePage="home" mode={isAgent ? "agent" : "client"} />

      <div className="flex-1 ml-16 flex flex-col">
        <div className="border-b border-border bg-card">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={isAgent ? `/agent/offers?offerId=${offerId}` : "/"}>
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                  </Link>
                </Button>
                <div>
                  <h1 className="text-2xl font-bold">Signature Status</h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    {offer.propertyAddress}
                  </p>
                </div>
              </div>
              {allSigned ? (
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> All Signed
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                  <Clock className="w-3 h-3 mr-1" /> In Progress
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Signature Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative pl-6">
                  <div className="absolute left-2 top-0 bottom-0 w-px bg-border" />
                  <div className="space-y-6">
                    {timelineSteps.map((step, index) => {
                      const isCompleted = step.timestamp !== undefined;
                      const isLast = index === timelineSteps.length - 1;
                      return (
                        <div key={step.id} className="relative">
                          <span
                            className={`absolute left-[-2px] top-2 w-3 h-3 rounded-full ${
                              isCompleted ? "bg-green-600" : "bg-border"
                            }`}
                          />
                          <div className="ml-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-semibold text-sm">{step.label}</p>
                                {step.timestamp && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {formatTime(step.timestamp)}
                                  </p>
                                )}
                              </div>
                              {isCompleted && (
                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                              )}
                            </div>
                          </div>
                          {!isLast && (
                            <div className="ml-4 mt-6 border-t border-border/60" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Signers List */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Signers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {signers.map((signer) => (
                  <div
                    key={signer.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        <User className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{signer.name}</p>
                          <Badge variant="outline" className="text-xs">
                            {signer.role === "buyer" ? "Buyer" : signer.role === "co-buyer" ? "Co-Buyer" : "Agent"}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{signer.email}</p>
                        {signer.viewedAt && signer.status !== "signed" && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Viewed {formatTime(signer.viewedAt)}
                          </p>
                        )}
                        {signer.signedAt && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Signed {formatTime(signer.signedAt)}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusIcon(signer.status)}
                      {getStatusBadge(signer.status)}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Actions (for agents) */}
            {isAgent && !allSigned && (
              <Card className="border-2 border-border">
                <CardHeader>
                  <CardTitle className="text-lg">Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full gap-2">
                    <Send className="w-4 h-4" /> Resend Signature Link
                  </Button>
                  <Button variant="outline" className="w-full gap-2 text-red-600 border-red-200 hover:bg-red-50">
                    <XCircle className="w-4 h-4" /> Cancel Envelope
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Offer Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Offer Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Property:</span>
                  <span className="font-medium">{offer.propertyAddress}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Purchase Price:</span>
                  <span className="font-medium">{offer.offerPrice}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant="outline" className="capitalize">
                    {offer.statusLabel}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}


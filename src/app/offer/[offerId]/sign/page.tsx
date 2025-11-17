"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { CustomSidebar } from "@/components/custom-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  AlertCircle, 
  CheckCircle2, 
  FileText, 
  MessageSquare, 
  TrendingUp, 
  DollarSign, 
  Calendar,
  Shield,
  HelpCircle,
  XCircle,
  Send,
  Download,
  PenTool
} from "lucide-react";
import { agentOfferSummaries } from "@/data/agent-offers";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

export default function OfferSigningPage() {
  const params = useParams<{ offerId: string }>();
  const offerId = Array.isArray(params?.offerId) ? params.offerId[0] : params?.offerId;
  const offer = agentOfferSummaries.find((o) => o.id === offerId);
  
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "I'm here to help you understand this offer. What would you like to know?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [isSigning, setIsSigning] = useState(false);

  const depositHighlight = offer?.termHighlights.find((term) => term.label.toLowerCase().includes("deposit"));
  const closingHighlight = offer?.termHighlights.find((term) => term.label.toLowerCase().includes("closing"));
  const conditionHighlight = offer?.termHighlights.find((term) => term.label.toLowerCase().includes("condition"));

  const riskAreas = [
    { type: "financing", label: "Financing Risk", severity: "medium", description: "Financing condition expires 2 days before closing" },
    { type: "inspection", label: "Inspection Waived", severity: "low", description: "Standard inspection condition included" },
  ];

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: chatInput,
      sender: "user",
      timestamp: new Date(),
    };

    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      text: "I understand your question. Let me explain: This is a standard offer with typical conditions. The financing condition gives you time to secure your mortgage, and the inspection allows you to verify the property's condition. Would you like more details on any specific clause?",
      sender: "ai",
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage, aiResponse]);
    setChatInput("");
  };

  if (!offer) {
    return (
      <div className="flex min-h-screen bg-background">
        <CustomSidebar activePage="home" mode="client" />
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
      <CustomSidebar activePage="home" mode="client" />

      <div className="flex-1 ml-16 flex flex-col">
        <div className="border-b border-border bg-card">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Review Your Offer</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {offer.propertyAddress}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // In production, this would open/download the actual PDF
                    alert("Opening offer document... (In production, this would open the PDF from DocuSign/Authentisign)");
                  }}
                  className="gap-1"
                >
                  <Download className="w-4 h-4" /> View Document
                </Button>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  <Shield className="w-3 h-3 mr-1" /> Ready to Sign
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 flex overflow-hidden">
            {/* Left: Key Terms Summary */}
            <div className="flex-1 overflow-y-auto p-6 border-r border-border">
            <div className="max-w-2xl mx-auto space-y-6">
              {/* Risk Meter */}
              <Card className="bg-gradient-to-r from-green-50 to-yellow-50 border-yellow-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-yellow-600" />
                      <span className="font-semibold text-sm">Overall Risk Level</span>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                      Medium
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    This offer includes standard conditions. Review financing and inspection timelines carefully.
                  </p>
                </CardContent>
              </Card>

              {/* Key Terms */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Key Terms</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Purchase Price</span>
                      </div>
                      <p className="text-lg font-semibold">{offer.offerPrice}</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Deposit</span>
                      </div>
                      <p className="text-lg font-semibold">{depositHighlight?.value || "Not specified"}</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Closing Date</span>
                      </div>
                      <p className="text-lg font-semibold">{closingHighlight?.value || "Not specified"}</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Conditions</span>
                      </div>
                      <p className="text-sm">{conditionHighlight?.value || "Standard conditions"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Risk Areas */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                    Areas to Review
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {riskAreas.map((area) => (
                    <div
                      key={area.type}
                      className="p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-sm">{area.label}</span>
                        <Badge
                          variant="outline"
                          className={
                            area.severity === "high"
                              ? "bg-red-50 text-red-700 border-red-200"
                              : area.severity === "medium"
                              ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                              : "bg-green-50 text-green-700 border-green-200"
                          }
                        >
                          {area.severity}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{area.description}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Major Clauses */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Important Clauses</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-sm">Financing Condition</span>
                      <Badge variant="outline" className="text-xs">3 days</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      You have 3 business days to secure financing approval. If you cannot obtain financing, you can withdraw without penalty.
                    </p>
                  </div>
                  <div className="p-3 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-sm">Inspection Condition</span>
                      <Badge variant="outline" className="text-xs">2 days</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      You have 2 business days to complete a home inspection. Any major defects found can be used to renegotiate or withdraw.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

            {/* Right: Q&A Assistant */}
            <div className="w-96 border-l border-border bg-card flex flex-col">
            <div className="p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                <h2 className="font-semibold">Ask Questions</h2>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Get instant answers about this offer
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 ${
                      msg.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <Input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Ask a question about this offer..."
                  className="flex-1"
                />
                <Button size="sm" onClick={handleSendMessage} className="gap-1">
                  <Send className="w-3 h-3" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                <HelpCircle className="w-3 h-3" />
                Try: &quot;What happens if I can&apos;t get financing?&quot; or &quot;Can I extend the inspection period?&quot;
              </p>
            </div>
          </div>
          </div>

          {/* Sticky Sign Button Bar */}
          <div className="bg-card border-t border-border p-4 shadow-lg">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                <p className="font-medium">Ready to proceed?</p>
                <p className="text-xs">Review all terms and ask any questions before signing.</p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    // In production, this would open/download the actual PDF
                    alert("Opening offer document... (In production, this would open the PDF from DocuSign/Authentisign)");
                  }}
                  className="gap-1"
                >
                  <FileText className="w-4 h-4" /> View Full Document
                </Button>
                <Button
                  size="lg"
                  onClick={() => {
                    setIsSigning(true);
                    // In production, this would redirect to DocuSign/Authentisign signing interface
                    setTimeout(() => {
                      alert("Redirecting to signing interface... (In production, this would open DocuSign/Authentisign signing page)");
                      setIsSigning(false);
                    }, 1000);
                  }}
                  disabled={isSigning}
                  className="gap-2"
                >
                  <PenTool className="w-4 h-4" />
                  {isSigning ? "Preparing..." : "Sign Document"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


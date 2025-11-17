"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CustomSidebar } from "@/components/custom-sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  agentClientTimelines,
  INITIAL_AGENT_CLIENTS,
  TimelineEvent,
  AgentClient,
  KYCStatus,
  CRMAutomation
} from "@/data/agent-clients";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Mail,
  Pause,
  CheckCircle,
  AlertCircle,
  XCircle,
  Shield,
  FileCheck,
  AlertTriangle,
  CheckCircle2,
  X,
  Bell,
  BellOff,
  TrendingUp,
  Gift,
  Mail as MailIcon,
  MessageSquare,
  Send,
  Copy
} from "lucide-react";

const getStatusBadge = (status: AgentClient["status"]) => {
  switch (status) {
    case "active":
      return <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>;
    case "paused":
      return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Paused</Badge>;
    case "expired":
      return <Badge className="bg-red-100 text-red-800 border-red-200">Expired</Badge>;
    default:
      return <Badge variant="secondary">Unknown</Badge>;
  }
};

const getStatusIcon = (status: AgentClient["status"]) => {
  switch (status) {
    case "active":
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    case "paused":
      return <Pause className="w-4 h-4 text-yellow-500" />;
    case "expired":
      return <XCircle className="w-4 h-4 text-red-500" />;
    default:
      return <AlertCircle className="w-4 h-4 text-gray-500" />;
  }
};

const formatDate = (date: Date) =>
  date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const formatTimeAgo = (date: Date) => {
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diffInDays < 1) return "Today";
  if (diffInDays < 2) return "Yesterday";
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  return `${Math.floor(diffInDays / 30)} months ago`;
};

const formatVisitLabel = (visitNumber?: number) => {
  if (!visitNumber) return null;
  if (visitNumber === 1) return "First visit";
  if (visitNumber === 2) return "Second visit";
  if (visitNumber === 3) return "Third visit";
  return `${visitNumber}th visit`;
};

const getTimelineAccent = (event: TimelineEvent) => {
  switch (event.type) {
    case "criteria-change":
      return {
        dot: "bg-blue-600",
        badge: "bg-blue-100 text-blue-900",
        label: "Criteria Update",
      };
    case "showing":
      return {
        dot: "bg-green-600",
        badge: "bg-green-100 text-green-900",
        label: "Showing",
      };
    default:
      return {
        dot: "bg-purple-600",
        badge: "bg-purple-100 text-purple-900",
        label: "Insight",
      };
  }
};

export default function AgentClientTimelinePage() {
  const params = useParams<{ clientId: string }>();
  const clientId = Array.isArray(params?.clientId) ? params.clientId[0] : params?.clientId;

  const [clients, setClients] = useState<AgentClient[]>(INITIAL_AGENT_CLIENTS);
  const client = clients.find((item) => item.id === clientId) ?? null;
  const timelineEvents = clientId ? agentClientTimelines[clientId] ?? [] : [];
  const [isKYCReportOpen, setIsKYCReportOpen] = useState(false);
  const [isCRMDialogOpen, setIsCRMDialogOpen] = useState(false);
  const [isRunningKYC, setIsRunningKYC] = useState(false);
  const [isKYCInviteOpen, setIsKYCInviteOpen] = useState(false);
  const [kycInviteLink, setKycInviteLink] = useState("");

  return (
    <div className="flex min-h-screen bg-background">
      <CustomSidebar activePage="clients" mode="agent" />

      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300 px-3 py-1">
          Agent Portal
        </Badge>
      </div>

      <div className="flex-1 ml-16 flex flex-col">
        <div className="border-b border-border bg-card">
          <div className="px-6 py-4 flex items-center justify-between gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/agent/clients" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Clients
              </Link>
            </Button>

            {client && (
              <div className="flex items-center gap-2">
                {getStatusIcon(client.status)}
                {getStatusBadge(client.status)}
              </div>
            )}
          </div>
        </div>

        <div className="px-6 py-6 space-y-6">
          {client ? (
            <>
              <Card className="border-border/80">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-14 h-14">
                        {client.avatar ? (
                          <AvatarImage src={client.avatar} alt={client.name} />
                        ) : (
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {client.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <h1 className="text-2xl font-semibold flex items-center gap-3">
                          {client.name}
                        </h1>
                        <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {client.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Access until {formatDate(client.accessExpiry)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Last active {formatTimeAgo(client.lastActive)}
                          </span>
                        </div>
                        {client.latestCriteria && (
                          <div className="mt-4 space-y-2">
                            <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
                              Most Recent Criteria
                            </div>
                            <div className="flex flex-wrap gap-2 text-sm">
                              {client.latestCriteria.priceRange && (
                                <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                                  Budget {client.latestCriteria.priceRange}
                                </Badge>
                              )}
                              {client.latestCriteria.propertyTypes && client.latestCriteria.propertyTypes.length > 0 && (
                                <Badge variant="secondary" className="bg-purple-50 text-purple-700 border-purple-200">
                                  {client.latestCriteria.propertyTypes.join(", ")}
                                </Badge>
                              )}
                              {client.latestCriteria.preferredAreas && client.latestCriteria.preferredAreas.length > 0 && (
                                <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                                  {client.latestCriteria.preferredAreas.join(", ")}
                                </Badge>
                              )}
                            </div>
                            {client.latestCriteria.notes && (
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {client.latestCriteria.notes}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-sm">
                      <div className="text-left sm:text-right">
                        <p className="text-muted-foreground">Properties Viewed</p>
                        <p className="text-xl font-semibold text-foreground">{client.propertiesViewed}</p>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-muted-foreground">AI Chat Sessions</p>
                        <p className="text-xl font-semibold text-foreground">{client.chatSessions}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex items-center gap-2 mt-2">
                <Button size="sm" className="bg-primary text-primary-foreground" asChild>
                  <Link href={`/agent/clients/${client.id}`}>Overview</Link>
                </Button>
                <Button variant="outline" size="sm" className="gap-1" asChild>
                  <Link href={`/agent/offers?clientId=${client.id}`}>Offers workspace</Link>
                </Button>
              </div>

              {/* KYC Section */}
              <Card className="border-border/80">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-muted-foreground" />
                      <h2 className="text-lg font-semibold">KYC Verification</h2>
                    </div>
                    {client.kycReport?.status === 'not-started' && (
                      <Button
                        size="sm"
                        onClick={async () => {
                          setIsRunningKYC(true);
                          await new Promise(resolve => setTimeout(resolve, 2000));
                          setClients(prev => prev.map(c => 
                            c.id === client.id 
                              ? {
                                  ...c,
                                  kycReport: {
                                    id: `kyc-${c.id}-${Date.now()}`,
                                    status: 'in-progress',
                                    lastChecked: new Date(),
                                    provider: 'GlobalWatchlist v1.2'
                                  }
                                }
                              : c
                          ));
                          setIsRunningKYC(false);
                        }}
                        disabled={isRunningKYC}
                      >
                        {isRunningKYC ? "Running check..." : "Run KYC Check"}
                      </Button>
                    )}
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const token = `kyc-${client.id}-${Date.now()}`;
                          const link = `${typeof window !== 'undefined' ? window.location.origin : ''}/kyc-invite/${token}`;
                          setKycInviteLink(link);
                          setIsKYCInviteOpen(true);
                        }}
                        className="gap-1"
                      >
                        <Send className="w-3 h-3" /> Send Invite
                      </Button>
                      {client.kycReport && client.kycReport.status !== 'not-started' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setIsKYCReportOpen(true)}
                        >
                          View Report
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {!client.kycReport || client.kycReport.status === 'not-started' ? (
                    <div className="text-sm text-muted-foreground">
                      <p>KYC verification has not been performed for this client.</p>
                      <p className="mt-1">Run a check to verify identity, address, and screen for risk flags.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Status:</span>
                        <Badge
                          className={
                            client.kycReport.status === 'completed'
                              ? "bg-green-100 text-green-800 border-green-200"
                              : client.kycReport.status === 'requires-review'
                              ? "bg-red-100 text-red-800 border-red-200"
                              : "bg-yellow-100 text-yellow-800 border-yellow-200"
                          }
                        >
                          {client.kycReport.status === 'completed' ? 'Completed' :
                           client.kycReport.status === 'requires-review' ? 'Requires Review' :
                           'In Progress'}
                        </Badge>
                        {client.kycReport.riskLevel && (
                          <Badge
                            variant="outline"
                            className={
                              client.kycReport.riskLevel === 'low'
                                ? "bg-green-50 text-green-700 border-green-200"
                                : client.kycReport.riskLevel === 'high'
                                ? "bg-red-50 text-red-700 border-red-200"
                                : "bg-yellow-50 text-yellow-700 border-yellow-200"
                            }
                          >
                            Risk: {client.kycReport.riskLevel}
                          </Badge>
                        )}
                      </div>
                      {client.kycReport.lastChecked && (
                        <div className="text-sm text-muted-foreground">
                          Last checked: {formatDate(client.kycReport.lastChecked)}
                          {client.kycReport.provider && ` • ${client.kycReport.provider}`}
                        </div>
                      )}
                      {client.kycReport.identityVerified !== undefined && (
                        <div className="flex items-center gap-2 text-sm">
                          {client.kycReport.identityVerified ? (
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-600" />
                          )}
                          <span>Identity {client.kycReport.identityVerified ? 'Verified' : 'Not Verified'}</span>
                        </div>
                      )}
                      {client.kycReport.addressVerified !== undefined && (
                        <div className="flex items-center gap-2 text-sm">
                          {client.kycReport.addressVerified ? (
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-600" />
                          )}
                          <span>Address {client.kycReport.addressVerified ? 'Verified' : 'Not Verified'}</span>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* CRM Automation Section */}
              <Card className="border-border/80">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Bell className="w-5 h-5 text-muted-foreground" />
                      <h2 className="text-lg font-semibold">CRM Automation</h2>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        asChild
                      >
                        <Link href={`/preferences?from=agent&clientId=${client.id}`}>
                          Client Preferences
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setIsCRMDialogOpen(true)}
                      >
                        Configure
                      </Button>
                    </div>
                  </div>
                  
                  {client.crmAutomation ? (
                    <div className="space-y-3">
                      <div className="grid gap-2 sm:grid-cols-2">
                        <div className="flex items-center gap-2 text-sm">
                          {client.crmAutomation.birthdayReminders ? (
                            <Gift className="w-4 h-4 text-green-600" />
                          ) : (
                            <BellOff className="w-4 h-4 text-muted-foreground" />
                          )}
                          <span>Birthday reminders</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          {client.crmAutomation.purchaseAnniversary ? (
                            <Calendar className="w-4 h-4 text-green-600" />
                          ) : (
                            <BellOff className="w-4 h-4 text-muted-foreground" />
                          )}
                          <span>Purchase anniversary</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          {client.crmAutomation.marketValueAlerts ? (
                            <TrendingUp className="w-4 h-4 text-green-600" />
                          ) : (
                            <BellOff className="w-4 h-4 text-muted-foreground" />
                          )}
                          <span>Market value alerts {client.crmAutomation.marketValueThreshold && `(${client.crmAutomation.marketValueThreshold}% threshold)`}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          {client.crmAutomation.quarterlyInsights ? (
                            <FileCheck className="w-4 h-4 text-green-600" />
                          ) : (
                            <BellOff className="w-4 h-4 text-muted-foreground" />
                          )}
                          <span>Quarterly insights</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t border-border/60">
                        <div className="flex items-center gap-1">
                          {client.crmAutomation.emailEnabled ? (
                            <MailIcon className="w-3 h-3" />
                          ) : (
                            <X className="w-3 h-3" />
                          )}
                          <span>Email</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {client.crmAutomation.smsEnabled ? (
                            <MessageSquare className="w-3 h-3" />
                          ) : (
                            <X className="w-3 h-3" />
                          )}
                          <span>SMS</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      <p>No automation configured. Set up automated touchpoints to maintain client relationships.</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-border/80">
                <CardContent className="p-6">
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold">Client Journey Timeline</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Highlights how {client.name.split(" ")[0]}&apos;s preferences, conversations, and showings evolved over time.
                    </p>
                  </div>

                  {timelineEvents.length > 0 ? (
                    <div className="relative pl-6">
                      <div className="absolute left-2 top-0 bottom-0 w-px bg-border" />
                      <div className="space-y-6">
                        {timelineEvents.map((event, index) => {
                          const { dot, badge, label } = getTimelineAccent(event);
                          const isShowing = event.type === "showing";
                          const visitLabel = formatVisitLabel(event.propertyLink?.visitNumber);
                          const displayTitle = isShowing && event.propertyLink?.address ? event.propertyLink.address : event.title;

                          return (
                            <div key={event.id} className="relative">
                              <span className={`absolute left-[-2px] top-2 w-3 h-3 rounded-full ${dot}`} />
                              <div className="ml-4">
                                <div className="flex items-center justify-between flex-wrap gap-2">
                                  <div className="flex items-center gap-2">
                                    <Badge className={badge}>{label}</Badge>
                                    <span className="text-xs text-muted-foreground">{event.date}</span>
                                  </div>
                                  {event.propertyLink && (
                                    <Button variant="ghost" size="sm" className="text-xs" asChild>
                                      <Link href={event.propertyLink.url}>
                                        View Property
                                      </Link>
                                    </Button>
                                  )}
                                </div>
                                <h3 className="text-base font-semibold mt-2 flex items-center gap-3 flex-wrap">
                                  {displayTitle}
                                  {isShowing && visitLabel && (
                                    <Badge variant="outline" className="text-xs font-medium bg-green-50 text-green-700 border-green-200">
                                      {visitLabel}
                                    </Badge>
                                  )}
                                  {isShowing && event.propertyLink?.time && (
                                    <Badge variant="outline" className="text-xs font-medium bg-green-50 text-green-700 border-green-200">
                                      {event.propertyLink.time}
                                    </Badge>
                                  )}
                                </h3>
                                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                                  {event.summary}
                                </p>

                                {event.highlights && event.highlights.length > 0 && (
                                  <div className="mt-3">
                                    <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground mb-2">
                                      Highlights
                                    </div>
                                    <div className="grid gap-2 sm:grid-cols-2">
                                      {event.highlights.map((item, idx) => (
                                        <div
                                          key={idx}
                                          className="flex items-start gap-2 bg-muted/40 border border-border/60 rounded-md px-3 py-2 text-sm"
                                        >
                                          <span className="mt-1 h-2 w-2 rounded-full bg-muted-foreground/60 flex-shrink-0" />
                                          <span>{item}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                              {index < timelineEvents.length - 1 && (
                                <div className="ml-4 mt-6 border-t border-border/60" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="py-12 text-center">
                      <h3 className="text-lg font-semibold mb-2">No timeline entries yet</h3>
                      <p className="text-muted-foreground text-sm max-w-lg mx-auto">
                        Once {client.name.split(" ")[0]} engages with the AI assistant or attends showings, their evolving preferences and feedback will appear here automatically.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="border-dashed border-2 border-border/80">
              <CardContent className="py-16 text-center space-y-4">
                <h2 className="text-xl font-semibold">Client Not Found</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  We couldn&apos;t find details for this client. They may have been removed or their invite hasn&apos;t been accepted yet.
                </p>
                <Button asChild variant="secondary">
                  <Link href="/agent/clients">Back to client list</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* KYC Report Dialog */}
      <Dialog open={isKYCReportOpen} onOpenChange={setIsKYCReportOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>KYC Verification Report</DialogTitle>
            <DialogDescription>
              Complete verification details for {client?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 overflow-y-auto pr-2 max-h-[60vh]">
            {client?.kycReport && (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Card>
                    <CardContent className="p-4 space-y-2">
                      <p className="text-xs uppercase tracking-wider text-muted-foreground">Identity Verification</p>
                      <div className="flex items-center gap-2">
                        {client.kycReport.identityVerified ? (
                          <>
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                            <span className="font-semibold text-green-700">Verified</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-5 h-5 text-red-600" />
                            <span className="font-semibold text-red-700">Not Verified</span>
                          </>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">Government-issued ID confirmed</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 space-y-2">
                      <p className="text-xs uppercase tracking-wider text-muted-foreground">Address Verification</p>
                      <div className="flex items-center gap-2">
                        {client.kycReport.addressVerified ? (
                          <>
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                            <span className="font-semibold text-green-700">Verified</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-5 h-5 text-red-600" />
                            <span className="font-semibold text-red-700">Not Verified</span>
                          </>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">Residential address confirmed</p>
                    </CardContent>
                  </Card>
                </div>

                {client.kycReport.riskFlags && client.kycReport.riskFlags.length > 0 ? (
                  <Card>
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-600" />
                        <p className="font-semibold">Risk Flags</p>
                      </div>
                      <div className="space-y-2">
                        {client.kycReport.riskFlags.map((flag, idx) => (
                          <div key={idx} className="flex items-start gap-2 p-2 bg-muted/50 rounded-md">
                            <Badge
                              variant="outline"
                              className={
                                flag.severity === 'high'
                                  ? "bg-red-50 text-red-700 border-red-200"
                                  : flag.severity === 'medium'
                                  ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                  : "bg-blue-50 text-blue-700 border-blue-200"
                              }
                            >
                              {flag.type}
                            </Badge>
                            <span className="text-sm flex-1">{flag.description}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 text-green-700">
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="font-semibold">No risk flags detected</span>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {client.kycReport.lastChecked && (
                  <div className="text-sm text-muted-foreground">
                    <p>Last checked: {formatDate(client.kycReport.lastChecked)}</p>
                    {client.kycReport.provider && <p>Provider: {client.kycReport.provider}</p>}
                  </div>
                )}
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsKYCReportOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CRM Configuration Dialog */}
      <Dialog open={isCRMDialogOpen} onOpenChange={setIsCRMDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Configure CRM Automation</DialogTitle>
            <DialogDescription>
              Set up automated touchpoints for {client?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="birthday">Birthday Reminders</Label>
                  <p className="text-xs text-muted-foreground">Send birthday greetings automatically</p>
                </div>
                <Switch
                  id="birthday"
                  checked={client?.crmAutomation?.birthdayReminders ?? false}
                  onCheckedChange={(checked) => {
                    setClients(prev => prev.map(c =>
                      c.id === client?.id
                        ? {
                            ...c,
                            crmAutomation: {
                              ...(c.crmAutomation || {
                                birthdayReminders: false,
                                purchaseAnniversary: false,
                                marketValueAlerts: false,
                                quarterlyInsights: false,
                                emailEnabled: true,
                                smsEnabled: false
                              }),
                              birthdayReminders: checked
                            }
                          }
                        : c
                    ));
                  }}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="anniversary">Purchase Anniversary</Label>
                  <p className="text-xs text-muted-foreground">Celebrate purchase milestones</p>
                </div>
                <Switch
                  id="anniversary"
                  checked={client?.crmAutomation?.purchaseAnniversary ?? false}
                  onCheckedChange={(checked) => {
                    setClients(prev => prev.map(c =>
                      c.id === client?.id
                        ? {
                            ...c,
                            crmAutomation: {
                              ...(c.crmAutomation || {
                                birthdayReminders: false,
                                purchaseAnniversary: false,
                                marketValueAlerts: false,
                                quarterlyInsights: false,
                                emailEnabled: true,
                                smsEnabled: false
                              }),
                              purchaseAnniversary: checked
                            }
                          }
                        : c
                    ));
                  }}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="market-alerts">Market Value Alerts</Label>
                    <p className="text-xs text-muted-foreground">Notify when property value changes significantly</p>
                  </div>
                  <Switch
                    id="market-alerts"
                    checked={client?.crmAutomation?.marketValueAlerts ?? false}
                    onCheckedChange={(checked) => {
                      setClients(prev => prev.map(c =>
                        c.id === client?.id
                          ? {
                              ...c,
                              crmAutomation: {
                                ...(c.crmAutomation || {
                                  birthdayReminders: false,
                                  purchaseAnniversary: false,
                                  marketValueAlerts: false,
                                  quarterlyInsights: false,
                                  emailEnabled: true,
                                  smsEnabled: false
                                }),
                                marketValueAlerts: checked
                              }
                            }
                          : c
                      ));
                    }}
                  />
                </div>
                {client?.crmAutomation?.marketValueAlerts && (
                  <div className="pl-4">
                    <Label htmlFor="threshold" className="text-xs">Alert Threshold (%)</Label>
                    <Input
                      id="threshold"
                      type="number"
                      min="1"
                      max="50"
                      value={client.crmAutomation.marketValueThreshold || 10}
                      onChange={(e) => {
                        setClients(prev => prev.map(c =>
                          c.id === client?.id
                            ? {
                                ...c,
                                crmAutomation: {
                                  ...(c.crmAutomation || {
                                    birthdayReminders: false,
                                    purchaseAnniversary: false,
                                    marketValueAlerts: false,
                                    quarterlyInsights: false,
                                    emailEnabled: true,
                                    smsEnabled: false
                                  }),
                                  marketValueThreshold: parseInt(e.target.value) || 10
                                }
                              }
                            : c
                        ));
                      }}
                      className="mt-1 w-24"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="insights">Quarterly Market Insights</Label>
                  <p className="text-xs text-muted-foreground">Send quarterly market analysis</p>
                </div>
                <Switch
                  id="insights"
                  checked={client?.crmAutomation?.quarterlyInsights ?? false}
                  onCheckedChange={(checked) => {
                    setClients(prev => prev.map(c =>
                      c.id === client?.id
                        ? {
                            ...c,
                            crmAutomation: {
                              ...(c.crmAutomation || {
                                birthdayReminders: false,
                                purchaseAnniversary: false,
                                marketValueAlerts: false,
                                quarterlyInsights: false,
                                emailEnabled: true,
                                smsEnabled: false
                              }),
                              quarterlyInsights: checked
                            }
                          }
                        : c
                    ));
                  }}
                />
              </div>
            </div>

            <div className="border-t border-border pt-4 space-y-3">
              <p className="text-sm font-medium">Notification Channels</p>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email">Email</Label>
                  <Switch
                    id="email"
                    checked={client?.crmAutomation?.emailEnabled ?? true}
                    onCheckedChange={(checked) => {
                      setClients(prev => prev.map(c =>
                        c.id === client?.id
                          ? {
                              ...c,
                              crmAutomation: {
                                ...(c.crmAutomation || {
                                  birthdayReminders: false,
                                  purchaseAnniversary: false,
                                  marketValueAlerts: false,
                                  quarterlyInsights: false,
                                  emailEnabled: true,
                                  smsEnabled: false
                                }),
                                emailEnabled: checked
                              }
                            }
                          : c
                      ));
                    }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="sms">SMS</Label>
                  <Switch
                    id="sms"
                    checked={client?.crmAutomation?.smsEnabled ?? false}
                    onCheckedChange={(checked) => {
                      setClients(prev => prev.map(c =>
                        c.id === client?.id
                          ? {
                              ...c,
                              crmAutomation: {
                                ...(c.crmAutomation || {
                                  birthdayReminders: false,
                                  purchaseAnniversary: false,
                                  marketValueAlerts: false,
                                  quarterlyInsights: false,
                                  emailEnabled: true,
                                  smsEnabled: false
                                }),
                                smsEnabled: checked
                              }
                            }
                          : c
                      ));
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCRMDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* KYC Invite Dialog */}
      <Dialog open={isKYCInviteOpen} onOpenChange={setIsKYCInviteOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Send KYC Invite</DialogTitle>
            <DialogDescription>
              Send an invite link to {client?.name} to complete their identity verification.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Invite Link</Label>
              <div className="flex gap-2">
                <Input value={kycInviteLink} readOnly className="flex-1" />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(kycInviteLink);
                    alert("Link copied to clipboard!");
                  }}
                  className="gap-1"
                >
                  <Copy className="w-3 h-3" /> Copy
                </Button>
              </div>
            </div>
            <Card className="bg-blue-50/50 border-blue-200">
              <CardContent className="p-4">
                <p className="text-sm text-blue-900">
                  <strong>Next steps:</strong> Copy this link and send it to the client via email or messaging. They can complete the verification process at their convenience.
                </p>
              </CardContent>
            </Card>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsKYCInviteOpen(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                alert("Invite sent via email! (In production, this would send an email with the link)");
                setIsKYCInviteOpen(false);
              }}
              className="gap-1"
            >
              <MailIcon className="w-3 h-3" /> Send via Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}



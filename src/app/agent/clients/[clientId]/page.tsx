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
  AgentClient
} from "@/data/agent-clients";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Mail,
  Pause,
  CheckCircle,
  AlertCircle,
  XCircle
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

  const client = INITIAL_AGENT_CLIENTS.find((item) => item.id === clientId) ?? null;
  const timelineEvents = clientId ? agentClientTimelines[clientId] ?? [] : [];

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
    </div>
  );
}



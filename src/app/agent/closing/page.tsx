import React from "react";
import { CustomSidebar } from "@/components/custom-sidebar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  CalendarCheck,
  Clock,
  DollarSign,
  FileCheck,
  Home,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  MessageSquare,
  ClipboardList,
} from "lucide-react";

const closingMilestones = [
  {
    id: "ms-1",
    date: "Apr 12",
    title: "Offer Firmed",
    description: "All conditions waived. Lawyer instructed to prepare closing documents.",
    owner: "Agent",
    status: "completed" as const,
  },
  {
    id: "ms-2",
    date: "Apr 15",
    title: "Deposit Received",
    description: "Buyer wired $85,000 deposit. Holding acknowledgement filed.",
    owner: "Brokerage",
    status: "completed" as const,
  },
  {
    id: "ms-3",
    date: "Apr 22",
    title: "Status Certificate Review",
    description: "Condo lawyer to confirm no special assessments or arrears.",
    owner: "Lawyer",
    status: "in-progress" as const,
  },
  {
    id: "ms-4",
    date: "Apr 28",
    title: "Mortgage Approval",
    description: "Lender to finalize appraisal and issue commitment.",
    owner: "Mortgage Broker",
    status: "upcoming" as const,
  },
  {
    id: "ms-5",
    date: "May 10",
    title: "Closing Day",
    description: "Keys released after funds transfer. Final walkthrough morning of closing.",
    owner: "Agent",
    status: "upcoming" as const,
  },
];

const checklistItems = [
  {
    id: "cl-1",
    label: "Finalize mortgage commitment",
    due: "Apr 28",
    owner: "Mortgage Broker",
    status: "pending" as const,
  },
  {
    id: "cl-2",
    label: "Insurance binder uploaded",
    due: "Apr 30",
    owner: "Client",
    status: "pending" as const,
  },
  {
    id: "cl-3",
    label: "Schedule final walkthrough",
    due: "May 9",
    owner: "Agent",
    status: "scheduled" as const,
  },
  {
    id: "cl-4",
    label: "Lawyer closing package",
    due: "May 5",
    owner: "Lawyer",
    status: "in-review" as const,
  },
];

const alerts = [
  {
    id: "al-1",
    title: "Insurance binder missing",
    message: "Buyers must submit proof of home insurance at least 7 days before closing.",
    due: "Due in 4 days",
  },
  {
    id: "al-2",
    title: "Appraisal follow-up",
    message: "Lender requested comparables for appraisal variance of $15K.",
    due: "Update needed by tomorrow",
  },
];

const aiSuggestions = [
  "Share a digestible closing calendar with the client—helps reduce last-minute questions.",
  "Prompt the lawyer to send wire instructions early to avoid transfer delays.",
  "Recommend movers and utility setup concierge to reinforce white-glove service.",
];

const clientNotes = [
  {
    id: "note-1",
    timestamp: "Apr 18 · 3:45 PM",
    author: "Sarah Johnson",
    content:
      "Client confirmed lender will cover appraisal variance if comp package delivered by Friday.",
  },
  {
    id: "note-2",
    timestamp: "Apr 16 · 10:12 AM",
    author: "AI Copilot",
    content: "Suggested welcome email template with move-in checklist—agent to personalize before sending.",
  },
];

const depositStatus = {
  total: 85000,
  received: 85000,
  schedule: [
    { label: "Initial deposit", amount: 50000, status: "received" as const },
    { label: "Balance", amount: 35000, status: "received" as const },
  ],
};

export default function AgentClosingCenterPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <CustomSidebar activePage="closing" mode="agent" />

      <div className="flex-1 ml-16 relative">
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-40">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-3 py-1">
            Agent Portal
          </Badge>
        </div>

        <main className="max-w-7xl mx-auto px-6 py-10 space-y-8">
          <header className="flex flex-col gap-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h1 className="text-3xl font-semibold text-foreground">Closing Command Center</h1>
                <p className="text-muted-foreground">Track every step from firm deal to handover day.</p>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Home className="w-4 h-4 text-primary" />
                  88 Bayview Heights Dr · Closing May 10, 2024
                </div>
                <Separator orientation="vertical" className="h-6" />
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  Lawyer: Chen & Associates
                </div>
              </div>
            </div>
          </header>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Card>
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium">Closing countdown</CardTitle>
                <Clock className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold">22 days</p>
                <p className="text-sm text-muted-foreground">Scheduled for May 10, 2024</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium">Deposit tracker</CardTitle>
                <DollarSign className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-2xl font-semibold">${depositStatus.received.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Fully received · Held in trust</div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary" style={{ width: "100%" }} />
                </div>
                <ul className="text-xs text-muted-foreground space-y-1">
                  {depositStatus.schedule.map((item) => (
                    <li key={item.label} className="flex justify-between">
                      <span>{item.label}</span>
                      <span className="text-foreground">${item.amount.toLocaleString()}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium">Next legal step</CardTitle>
                <FileCheck className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-base font-semibold">Status certificate review</p>
                <p className="text-sm text-muted-foreground">Awaiting lawyer feedback · expected Apr 22</p>
                <Button variant="outline" size="sm" className="mt-3">Follow up</Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium">Client satisfaction pulse</CardTitle>
                <MessageSquare className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold">👍 Positive</p>
                <p className="text-sm text-muted-foreground">Last touchpoint Apr 18 · low risk of churn</p>
                <Button size="sm" className="mt-3 w-full">Send reassurance update</Button>
              </CardContent>
            </Card>
          </section>

          <section className="grid gap-6 xl:grid-cols-[2.2fr_1fr]">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <CalendarCheck className="w-4 h-4 text-primary" />
                  <CardTitle className="text-base">Closing timeline</CardTitle>
                </div>
                <p className="text-sm text-muted-foreground">Stay aligned with partners and flag blockers early.</p>
              </CardHeader>
              <CardContent>
                <div className="relative pl-6">
                  <div className="absolute left-2 top-2 bottom-2 w-px bg-border" />
                  <div className="space-y-6">
                    {closingMilestones.map((milestone, index) => (
                      <div key={milestone.id} className="relative">
                        <span
                          className={`absolute left-[-3px] top-1 w-3 h-3 rounded-full border-2 ${
                            milestone.status === "completed"
                              ? "bg-green-500 border-green-500"
                              : milestone.status === "in-progress"
                              ? "bg-amber-400 border-amber-400"
                              : "bg-muted border-border"
                          }`}
                        />
                        <div className="ml-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Badge variant="outline" className="text-xs px-2 py-0.5">
                                {milestone.date}
                              </Badge>
                              <h3 className="text-sm font-semibold">{milestone.title}</h3>
                            </div>
                            <span className="text-xs text-muted-foreground">Owner: {milestone.owner}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                            {milestone.description}
                          </p>
                        </div>
                        {index < closingMilestones.length - 1 && <Separator className="my-4" />}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <CardTitle className="text-base">Action alerts</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {alerts.map((alert) => (
                    <div key={alert.id} className="rounded-md border border-amber-100 bg-amber-50 p-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-amber-800">{alert.title}</p>
                        <span className="text-xs text-amber-700">{alert.due}</span>
                      </div>
                      <p className="text-sm text-amber-800/90 mt-1">{alert.message}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <ClipboardList className="w-4 h-4 text-primary" />
                    <CardTitle className="text-base">Closing checklist</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {checklistItems.map((item) => (
                    <div key={item.id} className="border border-border/60 rounded-md px-3 py-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle2
                            className={`w-4 h-4 ${
                              item.status === "pending"
                                ? "text-muted-foreground"
                                : item.status === "in-review"
                                ? "text-amber-500"
                                : "text-green-600"
                            }`}
                          />
                          <span className="text-sm font-medium">{item.label}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">Due {item.due}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Owner: {item.owner}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Client & partner notes</CardTitle>
                <p className="text-sm text-muted-foreground">Centralize updates so the whole team stays aligned.</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {clientNotes.map((note) => (
                  <div key={note.id} className="rounded-md border border-border/60 bg-muted/40 p-3">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{note.author}</span>
                      <span>{note.timestamp}</span>
                    </div>
                    <p className="text-sm text-foreground mt-2 leading-relaxed">{note.content}</p>
                  </div>
                ))}
                <Button variant="outline" size="sm">Add update</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">AI guidance</CardTitle>
                <p className="text-sm text-muted-foreground">Copilot insights to keep the closing on track.</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  {aiSuggestions.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-primary" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </section>
        </main>
      </div>
    </div>
  );
}




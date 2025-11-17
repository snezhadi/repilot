"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CustomSidebar } from "@/components/custom-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell, Mail, MessageSquare, Gift, Calendar, TrendingUp, FileText, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";

export default function CommunicationPreferencesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const fromAgent = searchParams.get("from") === "agent";
  const clientId = searchParams.get("clientId");

  const [preferences, setPreferences] = useState({
    birthdayReminders: true,
    purchaseAnniversary: true,
    marketValueAlerts: true,
    quarterlyInsights: true,
    emailEnabled: true,
    smsEnabled: false,
  });

  const [isPaused, setIsPaused] = useState(false);
  const [pauseDuration, setPauseDuration] = useState<"3" | "6" | "12" | null>(null);

  const handleToggle = (key: keyof typeof preferences) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePauseAll = (months: "3" | "6" | "12") => {
    setPauseDuration(months);
    setIsPaused(true);
    setPreferences({
      birthdayReminders: false,
      purchaseAnniversary: false,
      marketValueAlerts: false,
      quarterlyInsights: false,
      emailEnabled: false,
      smsEnabled: false,
    });
  };

  const handleUnsubscribeAll = () => {
    setIsPaused(false);
    setPauseDuration(null);
    setPreferences({
      birthdayReminders: false,
      purchaseAnniversary: false,
      marketValueAlerts: false,
      quarterlyInsights: false,
      emailEnabled: false,
      smsEnabled: false,
    });
  };

  const handleResume = () => {
    setIsPaused(false);
    setPauseDuration(null);
    setPreferences({
      birthdayReminders: true,
      purchaseAnniversary: true,
      marketValueAlerts: true,
      quarterlyInsights: true,
      emailEnabled: true,
      smsEnabled: false,
    });
  };

  return (
    <div className="flex min-h-screen bg-background">
      <CustomSidebar activePage="home" mode={fromAgent ? "agent" : "client"} />

      <div className="flex-1 ml-16 flex flex-col">
        <div className="border-b border-border bg-card">
          <div className="px-6 py-4">
            <div className="flex items-center gap-4">
              {fromAgent && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push(clientId ? `/agent/clients/${clientId}` : "/agent/clients")}
                  className="gap-2"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </Button>
              )}
              <div>
                <h1 className="text-2xl font-bold">Communication Preferences</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {fromAgent ? "View client communication preferences" : "Manage how and when you receive updates from your agent"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Status Alert */}
            {isPaused && (
              <Card className="bg-yellow-50/50 border-yellow-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-yellow-600" />
                      <div>
                        <p className="font-semibold text-sm text-yellow-900">
                          All communications paused
                        </p>
                        <p className="text-xs text-yellow-800">
                          {pauseDuration && `Paused for ${pauseDuration} months`}
                        </p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" onClick={handleResume}>
                      Resume Communications
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Communication Topics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Communication Topics</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Choose which types of messages you&apos;d like to receive
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
                      <Gift className="w-5 h-5 text-pink-600" />
                    </div>
                    <div>
                      <Label htmlFor="birthday" className="font-semibold cursor-pointer">
                        Birthday Reminders
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Receive birthday greetings from your agent
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="birthday"
                    checked={preferences.birthdayReminders && !isPaused}
                    onCheckedChange={() => handleToggle("birthdayReminders")}
                    disabled={isPaused}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <Label htmlFor="anniversary" className="font-semibold cursor-pointer">
                        Purchase Anniversary
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Celebrate milestones like your purchase anniversary
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="anniversary"
                    checked={preferences.purchaseAnniversary && !isPaused}
                    onCheckedChange={() => handleToggle("purchaseAnniversary")}
                    disabled={isPaused}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <Label htmlFor="market-alerts" className="font-semibold cursor-pointer">
                        Market Value Alerts
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Get notified when your property value changes significantly
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="market-alerts"
                    checked={preferences.marketValueAlerts && !isPaused}
                    onCheckedChange={() => handleToggle("marketValueAlerts")}
                    disabled={isPaused}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <Label htmlFor="insights" className="font-semibold cursor-pointer">
                        Quarterly Market Insights
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Receive quarterly market analysis and trends
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="insights"
                    checked={preferences.quarterlyInsights && !isPaused}
                    onCheckedChange={() => handleToggle("quarterlyInsights")}
                    disabled={isPaused}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Notification Channels */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Notification Channels</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Choose how you&apos;d like to receive communications
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <Label htmlFor="email" className="font-semibold cursor-pointer">
                        Email
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Receive updates via email
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="email"
                    checked={preferences.emailEnabled && !isPaused}
                    onCheckedChange={() => handleToggle("emailEnabled")}
                    disabled={isPaused}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <Label htmlFor="sms" className="font-semibold cursor-pointer">
                        SMS
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Receive text message notifications
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="sms"
                    checked={preferences.smsEnabled && !isPaused}
                    onCheckedChange={() => handleToggle("smsEnabled")}
                    disabled={isPaused}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Bulk Actions */}
            <Card className="border-2 border-border">
              <CardHeader>
                <CardTitle className="text-lg">Bulk Actions</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Temporarily pause or permanently unsubscribe from all communications
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-3">
                  <Button
                    variant="outline"
                    onClick={() => handlePauseAll("3")}
                    className="gap-1"
                    disabled={isPaused}
                  >
                    <Bell className="w-4 h-4" /> Pause 3 Months
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handlePauseAll("6")}
                    className="gap-1"
                    disabled={isPaused}
                  >
                    <Bell className="w-4 h-4" /> Pause 6 Months
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handlePauseAll("12")}
                    className="gap-1"
                    disabled={isPaused}
                  >
                    <Bell className="w-4 h-4" /> Pause 12 Months
                  </Button>
                </div>
                <Button
                  variant="outline"
                  onClick={handleUnsubscribeAll}
                  className="w-full gap-1 text-red-600 border-red-200 hover:bg-red-50"
                >
                  <AlertCircle className="w-4 h-4" /> Unsubscribe from All Communications
                </Button>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  if (fromAgent) {
                    router.push(clientId ? `/agent/clients/${clientId}` : "/agent/clients");
                  } else {
                    router.push("/");
                  }
                }}
              >
                {fromAgent ? "Back" : "Cancel"}
              </Button>
              {!fromAgent && (
                <Button className="gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Save Preferences
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


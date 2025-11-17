"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { CustomSidebar } from "@/components/custom-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Shield, FileText, MapPin, CheckCircle, ArrowRight, ArrowLeft, Lock } from "lucide-react";

type Step = "identity" | "address" | "declarations" | "review";

export default function KYCInvitePage() {
  const params = useParams<{ token: string }>();
  const [currentStep, setCurrentStep] = useState<Step>("identity");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    idType: "",
    idNumber: "",
    address: "",
    city: "",
    province: "",
    postalCode: "",
    addressProof: "",
    declaration1: false,
    declaration2: false,
    declaration3: false,
  });

  const steps: { id: Step; label: string; icon: typeof Shield }[] = [
    { id: "identity", label: "Identity", icon: FileText },
    { id: "address", label: "Address", icon: MapPin },
    { id: "declarations", label: "Declarations", icon: CheckCircle },
    { id: "review", label: "Review", icon: Shield },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const handleNext = () => {
    const stepOrder: Step[] = ["identity", "address", "declarations", "review"];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const stepOrder: Step[] = ["identity", "address", "declarations", "review"];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    }
  };

  const handleSubmit = () => {
    // In production, this would submit to the backend
    alert("KYC information submitted successfully! Your agent will review and confirm your verification.");
  };

  return (
    <div className="flex min-h-screen bg-background">
      <CustomSidebar activePage="home" mode="client" />

      <div className="flex-1 ml-16 flex flex-col">
        <div className="flex-1 flex items-center justify-center p-6">
          <Card className="w-full max-w-3xl">
            <CardHeader className="border-b border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Identity Verification</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your agent has requested identity verification. This helps ensure compliance and security.
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  {steps.map((step, index) => {
                    const Icon = step.icon;
                    const isActive = index === currentStepIndex;
                    const isCompleted = index < currentStepIndex;
                    return (
                      <div key={step.id} className="flex items-center flex-1">
                        <div className="flex flex-col items-center flex-1">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                              isCompleted
                                ? "bg-green-100 border-green-500 text-green-700"
                                : isActive
                                ? "bg-blue-100 border-blue-500 text-blue-700"
                                : "bg-muted border-border text-muted-foreground"
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="w-5 h-5" />
                            ) : (
                              <Icon className="w-5 h-5" />
                            )}
                          </div>
                          <span className={`text-xs mt-2 ${isActive ? "font-semibold" : "text-muted-foreground"}`}>
                            {step.label}
                          </span>
                        </div>
                        {index < steps.length - 1 && (
                          <div
                            className={`h-0.5 flex-1 mx-2 -mt-6 ${
                              isCompleted ? "bg-green-500" : "bg-border"
                            }`}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="w-full bg-muted rounded-full h-2 mt-4">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              {/* Step 1: Identity */}
              {currentStep === "identity" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Identity Information</h3>
                    <p className="text-sm text-muted-foreground">
                      Please provide your government-issued identification details.
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        placeholder="John"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="idType">ID Type</Label>
                    <select
                      id="idType"
                      value={formData.idType}
                      onChange={(e) => setFormData({ ...formData, idType: e.target.value })}
                      className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
                    >
                      <option value="">Select ID type</option>
                      <option value="drivers-license">Driver&apos;s License</option>
                      <option value="passport">Passport</option>
                      <option value="health-card">Health Card</option>
                      <option value="other">Other Government ID</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="idNumber">ID Number</Label>
                    <Input
                      id="idNumber"
                      value={formData.idNumber}
                      onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                      placeholder="Enter your ID number"
                    />
                  </div>

                  <Card className="bg-blue-50/50 border-blue-200">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Lock className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div className="space-y-1 text-sm text-blue-900">
                          <p className="font-semibold">Your privacy is protected</p>
                          <p className="text-blue-800">
                            All information is encrypted and stored securely. Your agent will only see verification status, not your ID details.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Step 2: Address */}
              {currentStep === "address" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Address Verification</h3>
                    <p className="text-sm text-muted-foreground">
                      Please provide your current residential address for verification.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="123 Main Street"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder="Toronto"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="province">Province</Label>
                      <Input
                        id="province"
                        value={formData.province}
                        onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                        placeholder="Ontario"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      placeholder="M5H 2N2"
                      className="uppercase"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="addressProof">Address Proof Document</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                      <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Upload utility bill, bank statement, or government document
                      </p>
                      <Button variant="outline" size="sm">
                        Choose File
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Declarations */}
              {currentStep === "declarations" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Declarations</h3>
                    <p className="text-sm text-muted-foreground">
                      Please confirm the following statements are true and accurate.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <Card className="border-2">
                      <CardContent className="p-4">
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.declaration1}
                            onChange={(e) => setFormData({ ...formData, declaration1: e.target.checked })}
                            className="mt-1 w-4 h-4"
                          />
                          <div>
                            <p className="font-semibold text-sm">
                              I am acting on my own behalf and not on behalf of another person or entity.
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              All information provided is for my personal use only.
                            </p>
                          </div>
                        </label>
                      </CardContent>
                    </Card>

                    <Card className="border-2">
                      <CardContent className="p-4">
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.declaration2}
                            onChange={(e) => setFormData({ ...formData, declaration2: e.target.checked })}
                            className="mt-1 w-4 h-4"
                          />
                          <div>
                            <p className="font-semibold text-sm">
                              I am not subject to any sanctions, restrictions, or legal prohibitions that would prevent this transaction.
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              I am legally permitted to engage in real estate transactions.
                            </p>
                          </div>
                        </label>
                      </CardContent>
                    </Card>

                    <Card className="border-2">
                      <CardContent className="p-4">
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.declaration3}
                            onChange={(e) => setFormData({ ...formData, declaration3: e.target.checked })}
                            className="mt-1 w-4 h-4"
                          />
                          <div>
                            <p className="font-semibold text-sm">
                              All information provided is accurate and complete to the best of my knowledge.
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              I understand that providing false information may result in legal consequences.
                            </p>
                          </div>
                        </label>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {/* Step 4: Review */}
              {currentStep === "review" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Review & Submit</h3>
                    <p className="text-sm text-muted-foreground">
                      Please review your information before submitting. Your agent will review and confirm your verification.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Identity Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Name:</span>
                          <span className="font-medium">
                            {formData.firstName} {formData.lastName}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">ID Type:</span>
                          <span className="font-medium">{formData.idType || "Not provided"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">ID Number:</span>
                          <span className="font-medium">
                            {formData.idNumber ? "••••••••" : "Not provided"}
                          </span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Address</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <div className="text-muted-foreground">
                          {formData.address || "Not provided"}
                          {formData.city && `, ${formData.city}`}
                          {formData.province && `, ${formData.province}`}
                          {formData.postalCode && ` ${formData.postalCode}`}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Declarations</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          {formData.declaration1 ? (
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                          ) : (
                            <Badge variant="outline" className="text-xs">Not confirmed</Badge>
                          )}
                          <span>Acting on own behalf</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          {formData.declaration2 ? (
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                          ) : (
                            <Badge variant="outline" className="text-xs">Not confirmed</Badge>
                          )}
                          <span>No sanctions or restrictions</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          {formData.declaration3 ? (
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                          ) : (
                            <Badge variant="outline" className="text-xs">Not confirmed</Badge>
                          )}
                          <span>Information is accurate</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStep === "identity"}
                  className="gap-1"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </Button>
                {currentStep !== "review" ? (
                  <Button onClick={handleNext} className="gap-1">
                    Next <ArrowRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} className="gap-1">
                    <Shield className="w-4 h-4" /> Submit Verification
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


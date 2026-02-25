import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  ArrowLeft, 
  Shield, 
  CheckCircle, 
  Phone, 
  Linkedin, 
  CreditCard, 
  Camera,
  AlertTriangle,
  Users,
  MapPin,
  MessageCircle,
  Flag,
  LogOut
} from "lucide-react";

interface VerificationSafetyProps {
  onBack: () => void;
  onSignOut: () => void;
}

export function VerificationSafety({ onBack, onSignOut }: VerificationSafetyProps) {
  const [verificationStatus, setVerificationStatus] = useState({
    phone: false,
    linkedin: false,
    id: false,
    photo: true // Assuming they have photos from profile setup
  });

  const completedVerifications = Object.values(verificationStatus).filter(Boolean).length;
  const totalVerifications = Object.keys(verificationStatus).length;
  const progress = (completedVerifications / totalVerifications) * 100;

  const handleVerificationClick = (type: keyof typeof verificationStatus) => {
    // Mock verification process
    setVerificationStatus(prev => ({ ...prev, [type]: true }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-black sticky top-0 z-50 shadow-sm">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3 flex items-center">
          <Button variant="ghost" onClick={onBack} className="p-0 h-auto text-white hover:bg-white/20 text-sm sm:text-base">
            <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
            Back
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <Shield className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl mb-2">Verification & Safety</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Build trust and stay safe in the [şere] community 🛡️
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile" className="text-xs sm:text-sm">Profile</TabsTrigger>
            <TabsTrigger value="verification" className="text-xs sm:text-sm">Verification</TabsTrigger>
            <TabsTrigger value="safety" className="text-xs sm:text-sm">Safety Tips</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            {/* Profile Information */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Your profile details and interests
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Basic Info */}
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium mb-1">Name</h4>
                    <p className="text-sm text-muted-foreground">Alex Johnson</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Location</h4>
                    <p className="text-sm text-muted-foreground">San Francisco, CA</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Interests</h4>
                    <div className="flex flex-wrap gap-2">
                      {["Music", "Movies", "Coffee", "Travel", "Photography"].map((interest) => (
                        <Badge key={interest} variant="secondary" className="text-xs">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sports & Fitness Section */}
            <Card>
              <CardHeader>
                <CardTitle>Sports & Fitness</CardTitle>
                <CardDescription>
                  Your sports interests and skill levels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {/* Mock user sports data */}
                  {[
                    { sport: "Tennis", level: "Intermediate" },
                    { sport: "Running", level: "Advanced" },
                    { sport: "Basketball", level: "Beginner" }
                  ].map((sportInfo) => (
                    <div key={sportInfo.sport} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <h4 className="font-medium">{sportInfo.sport}</h4>
                        <p className="text-sm text-muted-foreground">Skill Level</p>
                      </div>
                      <Badge variant="outline" className="capitalize">
                        {sportInfo.level}
                      </Badge>
                    </div>
                  ))}
                </div>
                
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Pro tip:</strong> Including skill levels helps you find teammates at your level and makes your activity posts more targeted!
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="verification" className="space-y-6">
            {/* Verification Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Your Verification Progress
                </CardTitle>
                <CardDescription>
                  Complete verifications to get a verified badge and more visibility
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{completedVerifications}/{totalVerifications} completed</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm">Current Status</p>
                    <Badge variant={progress >= 75 ? "default" : "secondary"} className="mt-1">
                      {progress >= 75 ? "Verified" : "Unverified"}
                    </Badge>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm">Trust Score</p>
                    <Badge variant="outline" className="mt-1 bg-amber-100 text-amber-700 border-amber-300">
                      New User
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Verification Options */}
            <div className="grid gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-muted rounded-full">
                        <Phone className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium">Phone Number</h3>
                        <p className="text-sm text-muted-foreground">Verify via SMS code</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {verificationStatus.phone && (
                        <CheckCircle className="h-5 w-5 text-emerald-600" />
                      )}
                      <Button 
                        variant={verificationStatus.phone ? "outline" : "default"}
                        size="sm"
                        onClick={() => handleVerificationClick('phone')}
                        disabled={verificationStatus.phone}
                      >
                        {verificationStatus.phone ? "Verified" : "Verify"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-muted rounded-full">
                        <Linkedin className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium">LinkedIn Profile</h3>
                        <p className="text-sm text-muted-foreground">Connect your professional profile</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {verificationStatus.linkedin && (
                        <CheckCircle className="h-5 w-5 text-emerald-600" />
                      )}
                      <Button 
                        variant={verificationStatus.linkedin ? "outline" : "default"}
                        size="sm"
                        onClick={() => handleVerificationClick('linkedin')}
                        disabled={verificationStatus.linkedin}
                      >
                        {verificationStatus.linkedin ? "Connected" : "Connect"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-muted rounded-full">
                        <CreditCard className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium">ID Verification</h3>
                        <p className="text-sm text-muted-foreground">Upload government-issued ID</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {verificationStatus.id && (
                        <CheckCircle className="h-5 w-5 text-emerald-600" />
                      )}
                      <Button 
                        variant={verificationStatus.id ? "outline" : "default"}
                        size="sm"
                        onClick={() => handleVerificationClick('id')}
                        disabled={verificationStatus.id}
                      >
                        {verificationStatus.id ? "Verified" : "Upload"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-muted rounded-full">
                        <Camera className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium">Profile Photos</h3>
                        <p className="text-sm text-muted-foreground">Clear photos of yourself</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-emerald-600" />
                      <Badge variant="outline" className="text-xs">Complete</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Benefits */}
            <Card className="bg-muted border">
              <CardHeader>
                <CardTitle className="text-lg">Verification Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    <span>Get a verified badge on your profile</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    <span>Appear higher in activity searches</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    <span>Get more responses to your activities</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    <span>Build trust with other members</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="safety" className="space-y-6">
            {/* Safety Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  Safety Guidelines
                </CardTitle>
                <CardDescription>
                  Follow these guidelines to stay safe while meeting new people
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-muted rounded-full">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">Meet in Public Places</h3>
                      <p className="text-sm text-muted-foreground">
                        Always choose busy, well-lit public locations for meetups. Avoid private residences or isolated areas.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-muted rounded-full">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">Share Your Plans</h3>
                      <p className="text-sm text-muted-foreground">
                        Tell a friend or family member where you're going, who you're meeting, and when you expect to return.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-muted rounded-full">
                      <MessageCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">Use In-App Communication</h3>
                      <p className="text-sm text-muted-foreground">
                        Keep conversations on SERE until you feel comfortable. Don't share personal contact info too quickly.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-muted rounded-full">
                      <Shield className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">Trust Your Instincts</h3>
                      <p className="text-sm text-muted-foreground">
                        If something feels off, don't ignore it. It's okay to cancel or leave if you feel uncomfortable.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Red Flags */}
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-800">
                  <AlertTriangle className="h-5 w-5" />
                  Red Flags to Watch For
                </CardTitle>
              </CardHeader>
              <CardContent className="text-red-800">
                <div className="space-y-2 text-sm">
                  <p>• Asking to meet in private or isolated locations</p>
                  <p>• Pressuring you to share personal information</p>
                  <p>• Inconsistent stories or profile information</p>
                  <p>• Aggressive or inappropriate messages</p>
                  <p>• Refusing to meet in public places</p>
                  <p>• No verification badges or very low trust score</p>
                </div>
              </CardContent>
            </Card>

            {/* Reporting */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flag className="h-5 w-5 text-red-600" />
                  Report Suspicious Users
                </CardTitle>
                <CardDescription>
                  Help keep the community safe by reporting concerning behavior
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  If someone makes you feel unsafe or violates community guidelines, report them immediately. 
                  We review all reports and take appropriate action.
                </p>
                <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                  <Flag className="h-4 w-4 mr-2" />
                  Report a User
                </Button>
              </CardContent>
            </Card>

            {/* Emergency */}
            <Card className="border-amber-200 bg-amber-50">
              <CardContent className="p-4">
                <div className="text-amber-800">
                  <h3 className="font-medium mb-2">In Case of Emergency</h3>
                  <p className="text-sm">
                    If you feel you're in immediate danger, call local emergency services (911 in the US) right away. 
                    Your safety is the top priority.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Account Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Manage your account settings</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="destructive" 
              onClick={onSignOut}
              className="w-full"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
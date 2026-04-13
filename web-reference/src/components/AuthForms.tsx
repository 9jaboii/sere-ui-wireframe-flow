import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { ArrowLeft, Copy, Check } from "lucide-react";

interface AuthFormsProps {
  isLogin: boolean;
  onBack: () => void;
  onAuthSuccess: () => void;
  onToggleMode: () => void;
}

export function AuthForms({ isLogin, onBack, onAuthSuccess, onToggleMode }: AuthFormsProps) {
  const [step, setStep] = useState<"form" | "verification">("form");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationType, setVerificationType] = useState<"email" | "sms">("email");
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [passwordCopied, setPasswordCopied] = useState(false);
  
  // Generate initials for display
  const getInitials = () => {
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }
    return "";
  };
  
  // Generate random background color
  const getRandomColor = () => {
    const colors = [
      "bg-blue-500", "bg-purple-500", "bg-green-500", "bg-pink-500",
      "bg-orange-500", "bg-teal-500", "bg-red-500", "bg-indigo-500"
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };
  
  const [avatarColor, setAvatarColor] = useState(getRandomColor());

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLogin) {
      // Generate secure password for email signup
      const genPass = Array.from({length: 16}, () => 
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
        .charAt(Math.floor(Math.random() * 70))
      ).join('');
      setGeneratedPassword(genPass);
    }
    
    // Move to verification step
    setStep("verification");
  };
  
  const handleVerification = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock verification - in real app would validate code
    onAuthSuccess();
  };
  
  const handleSocialLogin = () => {
    // Social login bypasses verification for this demo
    onAuthSuccess();
  };
  
  const copyPassword = () => {
    navigator.clipboard.writeText(generatedPassword);
    setPasswordCopied(true);
    setTimeout(() => setPasswordCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-md">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-4 sm:mb-6 p-0 h-auto text-sm sm:text-base"
        >
          <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
          Back to Home
        </Button>

        {step === "form" && (
          <Card>
            <CardHeader className="text-center space-y-2 sm:space-y-3 p-4 sm:p-6">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-black rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl sm:text-3xl">👋</span>
              </div>
              <CardTitle className="text-xl sm:text-2xl">{isLogin ? "Welcome Back!" : <span className="flex items-center justify-center gap-2">Join <img src="/sere_black.png" alt="şere" className="h-6 sm:h-7 inline" /></span>}</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                {isLogin 
                  ? "Sign in to your account" 
                  : "Create your account - close friends only"
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
              <form onSubmit={handleFormSubmit} className="space-y-3 sm:space-y-4">
                {!isLogin && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5 sm:space-y-2">
                        <Label htmlFor="firstName" className="text-sm sm:text-base">First Name *</Label>
                        <Input
                          id="firstName"
                          type="text"
                          placeholder="First"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          required
                          className="border-2 h-9 sm:h-10 text-sm sm:text-base"
                        />
                      </div>
                      <div className="space-y-1.5 sm:space-y-2">
                        <Label htmlFor="lastName" className="text-sm sm:text-base">Last Name *</Label>
                        <Input
                          id="lastName"
                          type="text"
                          placeholder="Last"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          required
                          className="border-2 h-9 sm:h-10 text-sm sm:text-base"
                        />
                      </div>
                    </div>
                    
                    {getInitials() && (
                      <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                        <div className={`w-12 h-12 ${avatarColor} rounded-full flex items-center justify-center text-white font-semibold`}>
                          {getInitials()}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Your Avatar</p>
                          <p className="text-xs text-muted-foreground">You can change the color later</p>
                        </div>
                      </div>
                    )}
                  </>
                )}
                
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="email" className="text-sm sm:text-base">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border-2 h-9 sm:h-10 text-sm sm:text-base"
                  />
                </div>
                
                {!isLogin && (
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="phone" className="text-sm sm:text-base">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="border-2 h-9 sm:h-10 text-sm sm:text-base"
                    />
                  </div>
                )}
                
                {isLogin && (
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="password" className="text-sm sm:text-base">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="border-2 h-9 sm:h-10 text-sm sm:text-base"
                    />
                  </div>
                )}

                <Button type="submit" className="w-full bg-black border-0 text-white hover:bg-black/90 h-10 sm:h-11 text-sm sm:text-base">
                  {isLogin ? "Sign In" : "Continue"}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-background px-2 text-muted-foreground">OR</span>
                </div>
              </div>

              <div className="space-y-2">
                <Button variant="outline" className="w-full" onClick={handleSocialLogin}>
                  Continue with Google
                </Button>
                <Button variant="outline" className="w-full" onClick={handleSocialLogin}>
                  Continue with Apple
                </Button>
              </div>

              <div className="text-center">
                <Button 
                  variant="link" 
                  onClick={onToggleMode}
                  className="text-sm"
                >
                  {isLogin 
                    ? "Don't have an account? Sign up" 
                    : "Already have an account? Sign in"
                  }
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        {step === "verification" && (
          <Card>
            <CardHeader className="text-center space-y-2 sm:space-y-3 p-4 sm:p-6">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-black rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl sm:text-3xl">✅</span>
              </div>
              <CardTitle className="text-xl sm:text-2xl">Verify You're Real</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                We sent a code to {verificationType === "email" ? email : phone}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-4 sm:p-6">
              {generatedPassword && (
                <div className="p-4 bg-muted border-2 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Your Generated Password</p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={copyPassword}
                      className="h-7 px-2"
                    >
                      {passwordCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="text-xs font-mono bg-white p-2 rounded border break-all">{generatedPassword}</p>
                  <p className="text-xs text-muted-foreground">Copy this password or change it after verification</p>
                </div>
              )}
              
              <form onSubmit={handleVerification} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Verification Code</Label>
                  <Input
                    id="code"
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    required
                    maxLength={6}
                    className="border-2 text-center text-2xl tracking-widest"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    type="button"
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setVerificationType(verificationType === "email" ? "sms" : "email")}
                  >
                    Send via {verificationType === "email" ? "SMS" : "Email"}
                  </Button>
                  <Button 
                    type="button"
                    variant="ghost"
                  >
                    Resend Code
                  </Button>
                </div>

                <Button type="submit" className="w-full bg-black text-white hover:bg-black/90">
                  Verify & Complete
                </Button>
              </form>
              
              <Button 
                variant="link" 
                onClick={() => setStep("form")}
                className="w-full text-sm"
              >
                ← Back to form
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Shield, Users, Calendar } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface LandingPageProps {
  onSignUp: () => void;
  onLogin: () => void;
}

export function LandingPage({ onSignUp, onLogin }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-black border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 md:py-24 relative">
          <div className="text-center">
            <img src="/sere_black.png" alt="şere" className="h-12 sm:h-16 md:h-20 mx-auto mb-6 sm:mb-8 invert" />
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-3 sm:px-4 py-2 rounded-full mb-4 sm:mb-6">
              <span>✨</span>
              <span className="text-xs sm:text-sm">Join thousands finding their squad</span>
            </div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 sm:mb-6 max-w-4xl mx-auto text-white px-2">
              Skip the small talk. Find people ready to play, hang out, or attend events together — today.
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
              Connect with locals who share your interests and are ready to meet up right now. 🎾 ☕ 🎵
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <Button onClick={onSignUp} size="lg" className="px-6 sm:px-8 bg-white text-black hover:bg-white/90 transition-all">
                Sign Up
              </Button>
              <Button onClick={onLogin} variant="outline" size="lg" className="px-6 sm:px-8 border-2 border-white bg-transparent text-white hover:bg-white/20 transition-all">
                Login
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-12 sm:py-20 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl mb-3 sm:mb-4 flex items-center justify-center gap-2">How <img src="/sere_black.png" alt="şere" className="h-7 sm:h-8 inline" /> Works</h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
              Get connected in 3 simple steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center group">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl mb-3 sm:mb-4">1. Create Profile</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Set up your profile with interests, location, and verification for better matches.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl mb-3 sm:mb-4">2. Post or Join</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Create activities or join existing ones from verified members in your area.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl mb-3 sm:mb-4">3. Meet Up</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Meet safely in public spaces and build your trust score with each successful meetup.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Image */}
      <div className="py-12 sm:py-16 bg-muted">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1758275557296-0340762a4ab3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncm91cCUyMGZyaWVuZHMlMjBzb2NpYWwlMjBhY3Rpdml0eXxlbnwxfHx8fDE3NTkyNDg2MDZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="People socializing and having fun together"
            className="w-full h-60 sm:h-80 object-cover rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
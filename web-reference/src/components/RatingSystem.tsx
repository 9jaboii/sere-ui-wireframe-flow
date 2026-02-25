import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { ArrowLeft, Star, ThumbsUp, ThumbsDown, CheckCircle } from "lucide-react";

interface RatingSystemProps {
  activityId: string;
  onBack: () => void;
  onRatingComplete: () => void;
}

const mockActivity = {
  title: "Tennis at Rock Creek Park",
  date: "Yesterday, Oct 15",
  host: {
    name: "Alex Chen",
    avatar: "AC"
  },
  attendees: [
    { name: "Alex Chen", avatar: "AC" },
    { name: "Jamie Smith", avatar: "JS" },
    { name: "You", avatar: "ME" }
  ]
};

export function RatingSystem({ activityId, onBack, onRatingComplete }: RatingSystemProps) {
  const [ratings, setRatings] = useState<Record<string, string>>({});
  const [reviews, setReviews] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleRatingChange = (person: string, rating: string) => {
    setRatings(prev => ({ ...prev, [person]: rating }));
  };

  const handleReviewChange = (person: string, review: string) => {
    setReviews(prev => ({ ...prev, [person]: review }));
  };

  const handleSubmit = () => {
    // In real app, would submit to API
    setSubmitted(true);
    setTimeout(() => {
      onRatingComplete();
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-3 sm:p-4">
        <div className="text-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-black rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <CheckCircle className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
          </div>
          <h2 className="text-xl sm:text-2xl mb-2">Thanks for your feedback! 🎉</h2>
          <p className="text-muted-foreground mb-4 text-sm sm:text-base">
            Your ratings help build a trusted community ⭐
          </p>
          <div className="space-y-2 text-sm sm:text-base">
            <p className="text-emerald-600">✓ Trust scores updated</p>
            <p className="text-emerald-600">✓ Your reliability score increased</p>
          </div>
        </div>
      </div>
    );
  }

  const attendeesToRate = mockActivity.attendees.filter(a => a.name !== "You");

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

      <div className="max-w-2xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl mb-2">Rate Your Experience</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Help us build a trusted community by rating your recent activity
          </p>
        </div>

        {/* Activity Summary */}
        <Card className="mb-6 sm:mb-8">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg">{mockActivity.title}</CardTitle>
            <CardDescription className="text-sm">{mockActivity.date}</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="flex items-center gap-2 text-sm sm:text-base">
              <span className="text-muted-foreground">Hosted by:</span>
              <Avatar className="h-6 w-6 bg-blue-500">
                <AvatarFallback className="text-xs bg-transparent text-white">{mockActivity.host.avatar}</AvatarFallback>
              </Avatar>
              <span>{mockActivity.host.name}</span>
            </div>
          </CardContent>
        </Card>

        {/* Rate Each Attendee */}
        <div className="space-y-6">
          {attendeesToRate.map((attendee) => (
            <Card key={attendee.name}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Avatar className={`${
                    attendee.avatar === "AC" ? "bg-blue-500" :
                    attendee.avatar === "JS" ? "bg-purple-500" :
                    "bg-gray-500"
                  }`}>
                    <AvatarFallback className="bg-transparent text-white">{attendee.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{attendee.name}</CardTitle>
                    <CardDescription>Rate this person's reliability</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Show Up Rating */}
                <div className="space-y-3">
                  <Label className="text-base">Did they show up?</Label>
                  <RadioGroup 
                    value={ratings[attendee.name] || ""} 
                    onValueChange={(value) => handleRatingChange(attendee.name, value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id={`${attendee.name}-yes`} />
                      <Label htmlFor={`${attendee.name}-yes`} className="flex items-center gap-2">
                        <ThumbsUp className="h-4 w-4 text-green-600" />
                        Yes (+1 Trust)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id={`${attendee.name}-no`} />
                      <Label htmlFor={`${attendee.name}-no`} className="flex items-center gap-2">
                        <ThumbsDown className="h-4 w-4 text-red-600" />
                        No (-1 Trust)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="late" id={`${attendee.name}-late`} />
                      <Label htmlFor={`${attendee.name}-late`} className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-600" />
                        Late but showed up (No change)
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Optional Review */}
                <div className="space-y-2">
                  <Label htmlFor={`review-${attendee.name}`}>
                    Optional Review (Like Uber - keep it short)
                  </Label>
                  <Textarea
                    id={`review-${attendee.name}`}
                    placeholder="Great teammate, very punctual, fun to hang out with..."
                    value={reviews[attendee.name] || ""}
                    onChange={(e) => handleReviewChange(attendee.name, e.target.value)}
                    className="resize-none"
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">
                    Keep reviews constructive and helpful for future activity partners
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Score Info */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="text-blue-800 space-y-2">
              <h3 className="font-medium">How Trust Scores Work</h3>
              <div className="text-sm space-y-1">
                <p>• <Badge variant="secondary" className="text-xs">New</Badge> → Starting level for all users</p>
                <p>• <Badge variant="secondary" className="text-xs">Reliable</Badge> → 5+ successful activities</p>
                <p>• <Badge variant="default" className="text-xs">Super Reliable</Badge> → 15+ successful activities</p>
              </div>
              <p className="text-xs">
                Trust scores help others know they can count on you to show up!
              </p>
            </div>
          </CardContent>
        </Card>

        <Button 
          onClick={handleSubmit}
          className="w-full mt-8" 
          size="lg"
          disabled={attendeesToRate.some(a => !ratings[a.name])}
        >
          Submit Ratings
        </Button>
      </div>
    </div>
  );
}
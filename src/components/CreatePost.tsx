import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { ArrowLeft, MapPin, Calendar, Clock, Link as LinkIcon, Users, Shield, HelpCircle, Camera, X } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface CreatePostProps {
  onBack: () => void;
  onPostCreated: () => void;
}

export function CreatePost({ onBack, onPostCreated }: CreatePostProps) {
  const [activityCategory, setActivityCategory] = useState("");
  const [activityName, setActivityName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [maxAttendees, setMaxAttendees] = useState("");
  const [eventLink, setEventLink] = useState("");
  const [skillLevel, setSkillLevel] = useState("");
  const [activityPhoto, setActivityPhoto] = useState<string | null>(null);

  const activityCategories = [
    "Sport / Gym",
    "Casual Hangout",
    "Party",
    "Other"
  ];

  const isSportsActivity = activityCategory === "Sport / Gym";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate Sport/Gym activities must have skill level
    if (isSportsActivity && !skillLevel) {
      alert("Please select a skill level for Sport / Gym activities");
      return;
    }
    // Mock post creation - in real app would call API
    onPostCreated();
  };

  const handlePhotoUpload = () => {
    // Mock photo upload - in real app would handle file upload
    const mockPhotoUrl = "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080";
    setActivityPhoto(mockPhotoUrl);
  };

  const handleRemovePhoto = () => {
    setActivityPhoto(null);
  };

  const currentActivityDisplay = activityCategory === "Other" && activityName ? activityName : activityCategory;

  return (
    <div className="min-h-screen bg-background p-3 sm:p-4 relative overflow-hidden">
      {/* Gradient background overlay */}
      <div className="fixed inset-0 pointer-events-none gradient-bg opacity-5 z-0" />
      
      <div className="max-w-2xl mx-auto py-4 sm:py-6 relative z-10">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-4 sm:mb-6 p-0 h-auto text-sm sm:text-base"
        >
          <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
          Back to Feed
        </Button>

        <div className="mb-6 sm:mb-8 text-center">
          <div className="inline-block bg-black text-white px-3 sm:px-4 py-1 rounded-full mb-3 sm:mb-4 shadow-lg text-sm sm:text-base">
            ✨ New Activity
          </div>
          <h1 className="text-2xl sm:text-3xl mb-2">Create Activity</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Post an activity and find people ready to join you today! 🎉
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Activity Type */}
          <Card className="border-l-4 border-l-black">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl">Activity Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
              <div className="space-y-2">
                <Label htmlFor="activity">Activity Category *</Label>
                <Select value={activityCategory} onValueChange={setActivityCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="What do you want to do?" />
                  </SelectTrigger>
                  <SelectContent>
                    {activityCategories.map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {activityCategory === "Other" && (
                <div className="space-y-2">
                  <Label htmlFor="custom-activity">Custom Activity *</Label>
                  <Input
                    id="custom-activity"
                    placeholder="Describe your activity"
                    value={activityName}
                    onChange={(e) => setActivityName(e.target.value)}
                    required
                  />
                </div>
              )}

              {/* Skill Level Selection for Sports */}
              {isSportsActivity && (
                <div className="space-y-2">
                  <Label htmlFor="skill-level">Skill Level Preference</Label>
                  <Select value={skillLevel} onValueChange={setSkillLevel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Who can join? (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All skill levels welcome</SelectItem>
                      <SelectItem value="beginner">Beginners only</SelectItem>
                      <SelectItem value="intermediate">Intermediate players</SelectItem>
                      <SelectItem value="advanced">Advanced players</SelectItem>
                      <SelectItem value="casual">Just for fun (any level)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Setting a skill level helps the right people find your activity
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Give more details about what you want to do..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="min-h-[100px]"
                />
              </div>

              {/* Photo Upload */}
              <div className="space-y-2">
                <Label>Activity Photo (Optional)</Label>
                <p className="text-xs text-muted-foreground mb-2">
                  Add a photo to make your activity more attractive
                </p>
                {activityPhoto ? (
                  <div className="relative">
                    <ImageWithFallback
                      src={activityPhoto}
                      alt="Activity photo"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={handleRemovePhoto}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div
                    className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={handlePhotoUpload}
                  >
                    <Camera className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Click to upload a photo</p>
                    <p className="text-xs text-muted-foreground mt-1">JPG, PNG up to 10MB</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Location & Time */}
          <Card className="border-l-4 border-l-pink-400">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl">When & Where</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="location">Location *</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Pick a safe, public place for everyone's safety</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  id="location"
                  placeholder="Where should everyone meet?"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time *</Label>
                  <Input
                    id="time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="max-attendees">Number of People Needed (max 12) *</Label>
                <Select value={maxAttendees} onValueChange={setMaxAttendees}>
                  <SelectTrigger>
                    <SelectValue placeholder="How many people can join?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Just 1 person (one-on-one)</SelectItem>
                    {[2,3,4,5,6,7,8,9,10,11,12].map((num) => (
                      <SelectItem key={num} value={num.toString()}>{num} people</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="event-link">Link (Optional)</Label>
                <Input
                  id="event-link"
                  type="url"
                  placeholder="https://..."
                  value={eventLink}
                  onChange={(e) => setEventLink(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Upload any link to give viewers an understanding of the activity e.g restaurant vibe/menu, movie thriller, concert to purchase their own tickets etc.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          {currentActivityDisplay && description && location && (
            <Card className="border-2">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">Preview</CardTitle>
                <CardDescription>This is how your post will appear to others</CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="p-4 border-2 border-white bg-white rounded-lg space-y-3 shadow-sm">
                  {activityPhoto && (
                    <ImageWithFallback
                      src={activityPhoto}
                      alt="Activity preview"
                      className="w-full h-32 object-cover rounded-lg -mx-4 -mt-4 mb-3"
                    />
                  )}
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{currentActivityDisplay}</Badge>
                    {skillLevel && isSportsActivity && (
                      <Badge variant="secondary" className="text-xs">
                        {skillLevel === "all" ? "All levels" : skillLevel}
                      </Badge>
                    )}
                  </div>
                  <p>{description}</p>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    {location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{location}</span>
                      </div>
                    )}
                    {date && time && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{new Date(date + 'T' + time).toLocaleDateString()} at {time}</span>
                      </div>
                    )}
                    {maxAttendees && (
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>0/{maxAttendees} people going</span>
                      </div>
                    )}
                    {eventLink && (
                      <div className="flex items-center gap-2">
                        <LinkIcon className="h-4 w-4" />
                        <span className="text-blue-600 hover:underline cursor-pointer">Event Link</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Button 
            type="submit" 
            className="w-full bg-black text-white hover:bg-black/90" 
            size="lg"
            disabled={!activityCategory || !description || !location || !date || !time}
          >
            Post Activity
          </Button>
        </form>
      </div>
    </div>
  );
}
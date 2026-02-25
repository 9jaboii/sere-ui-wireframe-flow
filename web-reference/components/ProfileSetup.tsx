import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Separator } from "./ui/separator";
import { Camera, Shield, CheckCircle } from "lucide-react";

interface ProfileSetupProps {
  onComplete: () => void;
}

export function ProfileSetup({ onComplete }: ProfileSetupProps) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [newInterest, setNewInterest] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  
  // Sports-specific state
  const [interestedInSports, setInterestedInSports] = useState<boolean | null>(null);
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [sportSkillLevels, setSportSkillLevels] = useState<Record<string, string>>({});

  const availableSports = [
    "Tennis", "Basketball", "Soccer", "Football", "Running", "Swimming", 
    "Cycling", "Hiking", "Volleyball", "Baseball", "Golf", "Yoga", 
    "Gym/Fitness", "Rock Climbing", "Badminton", "Table Tennis"
  ];

  const predefinedInterests = [
    "Music", "Movies", "Reading", "Cooking", "Travel", "Photography", 
    "Art", "Gaming", "Technology", "Fashion", "Food", "Coffee", 
    "Concerts", "Theater", "Museums", "Networking", "Study Groups",
    "Language Exchange", "Board Games", "Karaoke", "Dancing"
  ];

  const addInterest = () => {
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      setInterests([...interests, newInterest.trim()]);
      setNewInterest("");
    }
  };

  const removeInterest = (interest: string) => {
    setInterests(interests.filter(i => i !== interest));
  };

  const togglePredefinedInterest = (interest: string) => {
    if (interests.includes(interest)) {
      removeInterest(interest);
    } else {
      setInterests([...interests, interest]);
    }
  };

  const toggleSport = (sport: string) => {
    if (selectedSports.includes(sport)) {
      setSelectedSports(selectedSports.filter(s => s !== sport));
      const newSkillLevels = { ...sportSkillLevels };
      delete newSkillLevels[sport];
      setSportSkillLevels(newSkillLevels);
    } else {
      setSelectedSports([...selectedSports, sport]);
    }
  };

  const setSportSkillLevel = (sport: string, level: string) => {
    setSportSkillLevels({
      ...sportSkillLevels,
      [sport]: level
    });
  };

  const handlePhotoUpload = (index: number) => {
    // Mock photo upload - in real app would handle file upload
    const mockPhotoUrl = `https://images.unsplash.com/photo-1494790108755-2616b36906d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=150&h=150`;
    const newPhotos = [...uploadedPhotos];
    newPhotos[index] = mockPhotoUrl;
    setUploadedPhotos(newPhotos);
    
    // Set first photo as profile photo
    if (index === 0) {
      setProfilePhoto(mockPhotoUrl);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete();
  };

  return (
    <div className="min-h-screen bg-background p-3 sm:p-4">
      <div className="max-w-2xl mx-auto py-4 sm:py-8">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl mb-2">Set Up Your Profile</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Tell us about yourself to find the perfect activity partners
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl">Basic Information</CardTitle>
              <CardDescription className="text-sm">Required fields to get started</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="name" className="text-sm sm:text-base">Name *</Label>
                <Input
                  id="name"
                  placeholder="Your first name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="location" className="text-sm sm:text-base">Location *</Label>
                <Input
                  id="location"
                  placeholder="City, State"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label className="text-sm sm:text-base">Interests *</Label>
                <p className="text-sm text-muted-foreground">Select from common interests or add your own</p>
                
                {/* Predefined interests */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {predefinedInterests.map((interest) => (
                    <Badge
                      key={interest}
                      variant={interests.includes(interest) ? "default" : "outline"}
                      className="cursor-pointer hover:bg-primary/10"
                      onClick={() => togglePredefinedInterest(interest)}
                    >
                      {interest}
                    </Badge>
                  ))}
                </div>

                {/* Custom interest input */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a custom interest"
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
                  />
                  <Button type="button" onClick={addInterest}>Add</Button>
                </div>

                {/* Selected interests */}
                {interests.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm">Selected Interests:</Label>
                    <div className="flex flex-wrap gap-2">
                      {interests.map((interest) => (
                        <Badge key={interest} variant="secondary" className="cursor-pointer">
                          {interest}
                          <button
                            type="button"
                            onClick={() => removeInterest(interest)}
                            className="ml-2 hover:text-destructive"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label className="text-sm sm:text-base">Profile Photo *</Label>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-24 h-24 rounded-full border-2 border-dashed border-muted-foreground/25 flex items-center justify-center cursor-pointer hover:border-muted-foreground/50 overflow-hidden"
                       onClick={() => handlePhotoUpload(0)}>
                    {profilePhoto ? (
                      <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center">
                        <Camera className="h-6 w-6 mx-auto mb-1 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">Profile</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm">Upload your profile photo</p>
                    <p className="text-xs text-muted-foreground">This will be your main display photo</p>
                  </div>
                </div>
                
                <Label className="text-sm sm:text-base">Additional Photos (Optional - up to 2 more)</Label>
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2].map((index) => (
                    <div key={index} 
                         className="aspect-square border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center cursor-pointer hover:border-muted-foreground/50 overflow-hidden"
                         onClick={() => handlePhotoUpload(index)}>
                      {uploadedPhotos[index] ? (
                        <img src={uploadedPhotos[index]} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center">
                          <Camera className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground">Add Photo</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sports Section */}
          <Card>
            <CardHeader>
              <CardTitle>Sports & Fitness</CardTitle>
              <CardDescription>Tell us about your sports interests (optional)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label>Are you interested in sports or fitness activities?</Label>
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant={interestedInSports === true ? "default" : "outline"}
                    onClick={() => setInterestedInSports(true)}
                  >
                    Yes
                  </Button>
                  <Button
                    type="button"
                    variant={interestedInSports === false ? "default" : "outline"}
                    onClick={() => {
                      setInterestedInSports(false);
                      setSelectedSports([]);
                      setSportSkillLevels({});
                    }}
                  >
                    No
                  </Button>
                </div>
              </div>

              {interestedInSports === true && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Select Sports/Activities *</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {availableSports.map((sport) => (
                        <Button
                          key={sport}
                          type="button"
                          variant={selectedSports.includes(sport) ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleSport(sport)}
                          className="text-left justify-start"
                        >
                          {sport}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {selectedSports.length > 0 && (
                    <div className="space-y-3">
                      <Label>Skill Levels *</Label>
                      <p className="text-sm text-muted-foreground">
                        Set your skill level for each sport you selected
                      </p>
                      {selectedSports.map((sport) => (
                        <div key={sport} className="flex items-center gap-3">
                          <div className="w-32 text-sm">{sport}:</div>
                          <Select 
                            value={sportSkillLevels[sport] || ""} 
                            onValueChange={(value) => setSportSkillLevel(sport, value)}
                          >
                            <SelectTrigger className="flex-1">
                              <SelectValue placeholder="Select skill level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="beginner">Beginner</SelectItem>
                              <SelectItem value="intermediate">Intermediate</SelectItem>
                              <SelectItem value="advanced">Advanced</SelectItem>
                              <SelectItem value="casual">Just for fun</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Verification */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Optional Verification
              </CardTitle>
              <CardDescription>
                Increase your trust score and get more responses by verifying your profile
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p>Phone Number</p>
                    <p className="text-sm text-muted-foreground">Verify via SMS</p>
                  </div>
                  <Button variant="outline" size="sm">Verify</Button>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p>LinkedIn Profile</p>
                    <p className="text-sm text-muted-foreground">Connect your professional profile</p>
                  </div>
                  <Button variant="outline" size="sm">Connect</Button>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p>ID Verification</p>
                    <p className="text-sm text-muted-foreground">Upload government ID</p>
                  </div>
                  <Button variant="outline" size="sm">Upload</Button>
                </div>
              </div>

              <div className="p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Trust Score: New</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Complete verifications and participate in activities to improve your trust score
                </p>
              </div>
            </CardContent>
          </Card>

          <Button 
            type="submit" 
            className="w-full" 
            size="lg"
            disabled={
              !name || 
              !location || 
              interests.length === 0 || 
              !profilePhoto || 
              interestedInSports === null ||
              (interestedInSports === true && (
                selectedSports.length === 0 || 
                selectedSports.some(sport => !sportSkillLevels[sport])
              ))
            }
          >
            Complete Profile Setup
          </Button>
        </form>
      </div>
    </div>
  );
}
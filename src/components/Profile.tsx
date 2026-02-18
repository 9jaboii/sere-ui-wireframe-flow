import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  ArrowLeft, 
  Mail, 
  LogOut, 
  MessageCircle, 
  Settings,
  Star,
  Calendar,
  MapPin,
  Clock,
  Users,
  Trash2,
  AlertTriangle
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

interface ProfileProps {
  onBack: () => void;
  onSignOut: () => void;
}

const mockUser = {
  firstName: "Alex",
  lastName: "Chen",
  initials: "AC",
  avatarColor: "bg-blue-500",
  email: "alex.chen@email.com",
  phone: "+1 (555) 123-4567"
};

const availableColors = [
  "bg-blue-500",
  "bg-purple-500",
  "bg-green-500",
  "bg-pink-500",
  "bg-orange-500",
  "bg-teal-500",
  "bg-red-500",
  "bg-indigo-500"
];

// Mock favorite hosts with their upcoming events
const mockFavoriteHosts = [
  {
    id: "1",
    name: "Sarah Johnson",
    initials: "SJ",
    avatarColor: "bg-purple-500",
    upcomingEvents: [
      {
        id: "e1",
        title: "Morning Yoga Session",
        category: "Sport / Gym",
        date: "Tomorrow",
        time: "8:00 AM",
        location: "Central Park, NYC",
        attendees: 5,
        maxAttendees: 10
      },
      {
        id: "e2",
        title: "Weekend Hiking Trip",
        category: "Sport / Gym",
        date: "Saturday",
        time: "9:00 AM",
        location: "Bear Mountain State Park",
        attendees: 8,
        maxAttendees: 12
      }
    ]
  },
  {
    id: "2",
    name: "Mike Rodriguez",
    initials: "MR",
    avatarColor: "bg-green-500",
    upcomingEvents: [
      {
        id: "e3",
        title: "Basketball Pickup Game",
        category: "Sport / Gym",
        date: "Friday",
        time: "6:00 PM",
        location: "Rucker Park",
        attendees: 7,
        maxAttendees: 10
      }
    ]
  },
  {
    id: "3",
    name: "Emma Chen",
    initials: "EC",
    avatarColor: "bg-pink-500",
    upcomingEvents: [
      {
        id: "e4",
        title: "Coffee & Networking",
        category: "Casual Hangout",
        date: "Today",
        time: "3:00 PM",
        location: "Blue Bottle Coffee, Manhattan",
        attendees: 3,
        maxAttendees: 6
      },
      {
        id: "e5",
        title: "Art Gallery Opening",
        category: "Party",
        date: "Next Week",
        time: "7:00 PM",
        location: "Chelsea Art District",
        attendees: 12,
        maxAttendees: 12
      }
    ]
  }
];

export function Profile({ onBack, onSignOut }: ProfileProps) {
  const [avatarColor, setAvatarColor] = useState(mockUser.avatarColor);
  const [favorites, setFavorites] = useState(mockFavoriteHosts);
  const [activeTab, setActiveTab] = useState("profile");

  const handleRemoveFavorite = (hostId: string) => {
    setFavorites(favorites.filter(host => host.id !== hostId));
  };

  const handleDeleteAccount = () => {
    // In a real app, this would call an API to delete the account
    alert("Account deletion would be processed here. You would be signed out and all data removed.");
    onSignOut();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-black sticky top-0 z-50 shadow-sm">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={onBack} 
            className="p-0 h-auto text-white hover:bg-white/20 text-sm sm:text-base"
          >
            <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
            <span>Back</span>
          </Button>
          <h1 className="text-lg sm:text-xl text-white">Profile</h1>
          <div className="w-16"></div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Profile Avatar */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className={`w-24 h-24 ${avatarColor} rounded-full flex items-center justify-center`}>
                <span className="text-white text-3xl font-semibold">{mockUser.initials}</span>
              </div>
              <div>
                <h2 className="text-2xl mb-1">{mockUser.firstName} {mockUser.lastName}</h2>
                <p className="text-sm text-muted-foreground">{mockUser.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for Profile Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-4">
            {/* Change Avatar Color */}
            <Card>
              <CardHeader>
                <CardTitle>Avatar Color</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Choose a color for your avatar
                </p>
                <div className="flex flex-wrap gap-3">
                  {availableColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setAvatarColor(color)}
                      className={`w-12 h-12 ${color} rounded-full hover:scale-110 transition-transform ${
                        avatarColor === color ? "ring-4 ring-offset-2 ring-black" : ""
                      }`}
                      aria-label={`Select ${color} color`}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p>{mockUser.email}</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center gap-3">
                  <MessageCircle className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p>{mockUser.phone}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Favorites Tab */}
          <TabsContent value="favorites" className="space-y-4">
            {favorites.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Star className="h-12 w-12 mx-auto mb-4 opacity-50 text-muted-foreground" />
                  <p className="text-muted-foreground">No favorite hosts yet</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Favorite hosts to quickly see their upcoming events
                  </p>
                </CardContent>
              </Card>
            ) : (
              favorites.map((host) => (
                <Card key={host.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 ${host.avatarColor} rounded-full flex items-center justify-center`}>
                          <span className="text-white font-semibold">{host.initials}</span>
                        </div>
                        <div>
                          <CardTitle className="text-lg">{host.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {host.upcomingEvents.length} upcoming {host.upcomingEvents.length === 1 ? 'event' : 'events'}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveFavorite(host.id)}
                      >
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {host.upcomingEvents.map((event) => (
                      <div key={event.id} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-medium mb-1">{event.title}</h4>
                            <Badge variant="outline" className="text-xs mb-2">
                              {event.category}
                            </Badge>
                          </div>
                        </div>
                        <div className="space-y-1 text-xs text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3" />
                            <span>{event.date} at {event.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3 w-3" />
                            <span>{event.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-3 w-3" />
                            <span>{event.attendees}/{event.maxAttendees} going</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Account Tab */}
          <TabsContent value="account" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => window.location.href = "mailto:support@sere.app"}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Us
                </Button>
                <Separator />
                <Button 
                  variant="destructive" 
                  className="w-full justify-start"
                  onClick={onSignOut}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </CardContent>
            </Card>

            {/* Delete Account */}
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-red-600 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Danger Zone
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Once you delete your account, there is no going back. This action cannot be undone.
                </p>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your account
                        and remove all your data from our servers, including:
                        <ul className="list-disc list-inside mt-2 space-y-1">
                          <li>Your profile and personal information</li>
                          <li>All your activities and posts</li>
                          <li>Your chat history</li>
                          <li>Your favorites and connections</li>
                        </ul>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteAccount}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Yes, delete my account
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
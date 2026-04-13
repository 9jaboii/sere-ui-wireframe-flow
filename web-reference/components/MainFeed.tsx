import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { 
  Plus, 
  MapPin, 
  Clock, 
  Users, 
  MessageCircle, 
  Shield, 
  Bell,
  User,
  Settings,
  Filter,
  Search
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface MainFeedProps {
  onCreatePost: () => void;
  onViewActivity: (id: string) => void;
  onViewProfile: () => void;
  onViewNotifications: () => void;
  onViewChats: () => void;
}

// Move these outside the component to prevent recreation on every render
const categories = [
  "all", 
  "Sports - Beginner", 
  "Sports - Intermediate", 
  "Sports - Advanced", 
  "Sports - Just for fun", 
  "Sports - Competitive",
  "Social", 
  "Events", 
  "Food & Drink", 
  "Study", 
  "Outdoors"
];
const sportsActivities = ["Tennis", "Basketball", "Soccer", "Running", "Hiking", "Gym Workout", "Swimming", "Cycling", "Volleyball", "Baseball", "Golf", "Yoga"];

const mockPosts = [
  {
    id: "1",
    user: {
      name: "Alex Chen",
      initials: "AC",
      avatarColor: "bg-blue-500"
    },
    category: "Sport / Gym",
    activityName: "Tennis",
    skillLevel: "Intermediate",
    description: "Who wants to play tennis at Rock Creek Park at 6pm?",
    location: "Rock Creek Park, DC",
    date: "Today",
    time: "6:00 PM",
    spotsNeeded: 1,
    maxAttendees: 4,
    image: "https://images.unsplash.com/photo-1564769353575-73f33a36d84f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZW5uaXMlMjBjb3VydCUyMHNwb3J0c3xlbnwxfHx8fDE3NTkxNTI2ODR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    id: "2",
    user: {
      name: "Maya Rodriguez",
      initials: "MR",
      avatarColor: "bg-purple-500"
    },
    category: "Party",
    activityName: "Concert Pregame",
    description: "Drake's performing tonight, who's going? Let's pregame in Silver Spring at 6pm.",
    location: "Silver Spring, MD",
    date: "Tonight",
    time: "6:00 PM",
    spotsNeeded: 3,
    maxAttendees: 10,
    image: "https://images.unsplash.com/photo-1743791022256-40413c5f019b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25jZXJ0JTIwbXVzaWMlMjBldmVudHxlbnwxfHx8fDE3NTkyMzkwNjh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    id: "3",
    user: {
      name: "Jordan Kim",
      initials: "JK",
      avatarColor: "bg-green-500"
    },
    category: "Casual Hangout",
    activityName: "Coffee & Work",
    description: "Anyone want to grab coffee and work at a cafe in Capitol Hill?",
    location: "Capitol Hill, DC",
    date: "Tomorrow",
    time: "10:00 AM",
    spotsNeeded: 2,
    maxAttendees: 3
  },
  {
    id: "4",
    user: {
      name: "Sarah Williams",
      initials: "SW",
      avatarColor: "bg-pink-500"
    },
    category: "Sport / Gym",
    activityName: "Running",
    skillLevel: "Advanced",
    description: "Looking for a running buddy for a 5K around the National Mall. Good pace, let's motivate each other!",
    location: "National Mall, DC",
    date: "Tomorrow",
    time: "7:00 AM",
    spotsNeeded: 1,
    maxAttendees: 1
  },
  {
    id: "5",
    user: {
      name: "Mike Davis",
      initials: "MD",
      avatarColor: "bg-orange-500"
    },
    category: "Sport / Gym",
    activityName: "Basketball",
    skillLevel: "Just for fun",
    description: "Need players for pickup basketball at the community center. All skill levels welcome!",
    location: "Takoma Park, MD",
    date: "Saturday",
    time: "2:00 PM",
    spotsNeeded: 4,
    maxAttendees: 8
  },
  {
    id: "6",
    user: {
      name: "Emily Zhang",
      initials: "EZ",
      avatarColor: "bg-teal-500"
    },
    category: "Sport / Gym",
    activityName: "Soccer",
    skillLevel: "Beginner",
    description: "Friendly soccer game for beginners. Come learn and have fun!",
    location: "Arlington, VA",
    date: "Sunday",
    time: "11:00 AM",
    spotsNeeded: 6,
    maxAttendees: 12
  }
];

export function MainFeed({ onCreatePost, onViewActivity, onViewProfile, onViewNotifications, onViewChats }: MainFeedProps) {
  const [activeTab, setActiveTab] = useState("feed");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  
  // Handle scroll for gradient effect
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    setScrollPosition(target.scrollTop);
  };
  
  const filteredPosts = mockPosts.filter(post => {
    // Category filter
    let matchesCategory = true;
    if (categoryFilter !== "all") {
      if (categoryFilter.startsWith("Sports - ")) {
        const skillLevel = categoryFilter.replace("Sports - ", "");
        const isSportsActivity = sportsActivities.some(sport => post.activityName.includes(sport));
        matchesCategory = isSportsActivity && post.skillLevel === skillLevel;
      } else if (categoryFilter === "Social") {
        matchesCategory = ["Coffee", "Drinks", "Hangout"].some(social => post.activityName.includes(social));
      } else if (categoryFilter === "Events") {
        matchesCategory = ["Concert", "Movie", "Festival"].some(event => post.activityName.includes(event));
      } else if (categoryFilter === "Food & Drink") {
        matchesCategory = ["Coffee", "Drinks", "Dinner", "Lunch"].some(food => post.activityName.includes(food));
      } else {
        matchesCategory = post.activityName.toLowerCase().includes(categoryFilter.toLowerCase());
      }
    }
    
    // Location filter
    const matchesLocation = !locationFilter || 
      post.location.toLowerCase().includes(locationFilter.toLowerCase());
    
    return matchesCategory && matchesLocation;
  });

  return (
    <div className="h-screen bg-background relative overflow-hidden flex flex-col">      
      {/* Header */}
      <div className="border-b bg-black z-50 shadow-sm flex-shrink-0">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between">
          <img src="/sere_black.png" alt="şere" className="h-7 sm:h-8 invert" />
          <div className="flex items-center gap-1 sm:gap-2">
            <Button variant="ghost" size="icon" onClick={onCreatePost} className="text-white hover:bg-white/20 h-8 w-8 sm:h-10 sm:w-10">
              <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onViewChats} className="text-white hover:bg-white/20 h-8 w-8 sm:h-10 sm:w-10">
              <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onViewNotifications} className="text-white hover:bg-white/20 h-8 w-8 sm:h-10 sm:w-10">
              <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onViewProfile} className="text-white hover:bg-white/20 h-8 w-8 sm:h-10 sm:w-10">
              <User className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 h-8 w-8 sm:h-10 sm:w-10 hidden sm:flex">
              <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Feed Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="feed">Nearby</TabsTrigger>
            <TabsTrigger value="my-posts">My Posts</TabsTrigger>
            <TabsTrigger value="joined">Joined</TabsTrigger>
          </TabsList>

          <TabsContent value="feed" className="space-y-3">
            {filteredPosts.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Filter className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No activities found matching your filters.</p>
                <p className="text-sm">Try adjusting your search criteria.</p>
              </div>
            ) : (
              filteredPosts.map((post) => (
              <Card key={post.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="pb-2 px-3 pt-3">
                  <div className="flex items-start gap-2">
                    <div className={`h-8 w-8 ${post.user.avatarColor} rounded-full flex items-center justify-center flex-shrink-0`}>
                      <span className="text-white text-xs font-semibold">{post.user.initials}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-sm truncate font-medium">{post.user.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <Badge variant="outline" className="text-xs px-1.5 py-0 h-5">
                          {post.category}
                        </Badge>
                        {post.skillLevel && post.category === "Sport / Gym" && (
                          <Badge variant="secondary" className="text-xs px-1.5 py-0 h-5">
                            {post.skillLevel}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0 px-3 pb-3">
                  {post.image && (
                    <ImageWithFallback
                      src={post.image}
                      alt={post.activityName}
                      className="w-full h-32 object-cover rounded-lg mb-2"
                    />
                  )}
                  
                  <p className="mb-2 text-sm">{post.description}</p>
                  
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{post.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3 w-3 flex-shrink-0" />
                      <span>{post.date} {post.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="h-3 w-3 flex-shrink-0" />
                      <span>{post.maxAttendees - post.spotsNeeded}/{post.maxAttendees} people going</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-3">
                    <Button 
                      onClick={() => onViewActivity(post.id)}
                      className="flex-1 h-8 text-xs"
                    >
                      +1 Join
                    </Button>
                    <Button variant="outline" size="icon" className="border-2 h-8 w-8">
                      <MessageCircle className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="my-posts" className="space-y-4">
            <div className="text-center py-12 text-muted-foreground">
              <Plus className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>You haven't created any activities yet.</p>
              <Button onClick={onCreatePost} className="mt-4">
                Create Your First Activity
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="joined" className="space-y-4">
            <div className="text-center py-12 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>You haven't joined any activities yet.</p>
              <p className="text-sm">Browse the feed above to find activities to join!</p>
            </div>
          </TabsContent>
        </Tabs>
        </div>
      </div>
    </div>
  );
}
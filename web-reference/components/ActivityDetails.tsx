import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Users, 
  MessageCircle, 
  Shield, 
  ExternalLink,
  Flag,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface ActivityDetailsProps {
  activityId: string;
  onBack: () => void;
  onJoin: () => void;
  onViewChat?: (activityId: string) => void;
}

const mockActivity = {
  id: "1",
  host: {
    name: "Alex Chen",
    initials: "AC",
    avatarColor: "bg-blue-500"
  },
  category: "Sport / Gym",
  activityName: "Tennis",
  skillLevel: "Intermediate",
  title: "Tennis at Rock Creek Park",
  description: "Looking for someone to play doubles tennis with! I'm an intermediate player and would love to have a fun, competitive game. I have extra rackets if you need one. We can grab drinks after if the weather's good!",
  location: "Rock Creek Park Tennis Courts, DC",
  fullAddress: "5200 Glover Rd NW, Washington, DC 20015",
  date: "Today",
  time: "6:00 PM - 8:00 PM",
  attendees: [
    { name: "Alex Chen", initials: "AC", avatarColor: "bg-blue-500", isHost: true },
    { name: "Jamie Smith", initials: "JS", avatarColor: "bg-purple-500", isHost: false },
    { name: "Sam Wilson", initials: "SW", avatarColor: "bg-pink-500", isHost: false }
  ],
  maxAttendees: 4,
  eventLink: null,
  image: "https://images.unsplash.com/photo-1564769353575-73f33a36d84f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZW5uaXMlMjBjb3VydCUyMHNwb3J0c3xlbnwxfHx8fDE3NTkxNTI2ODR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  requestStatus: null as null | "pending" | "accepted"
};

export function ActivityDetails({ activityId, onBack, onJoin, onViewChat }: ActivityDetailsProps) {
  const [requestStatus, setRequestStatus] = useState(mockActivity.requestStatus);
  const [showChat, setShowChat] = useState(false);

  const handleJoin = () => {
    setRequestStatus("pending");
    onJoin();
  };

  const spotsLeft = mockActivity.maxAttendees - mockActivity.attendees.length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-black sticky top-0 z-50 shadow-sm">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between">
          <Button variant="ghost" onClick={onBack} className="p-0 h-auto text-white hover:bg-white/20 text-sm sm:text-base">
            <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
            <span>Back to Feed</span>
          </Button>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 h-8 w-8 sm:h-10 sm:w-10">
            <Flag className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Safety Banner */}
        <Card className="bg-muted border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-black rounded-full p-2">
                <Shield className="h-5 w-5 flex-shrink-0 text-white" />
              </div>
              <p className="text-sm">
                <strong>Safety First!</strong> Meet in public spaces. Report suspicious users if something feels wrong. 🛡️
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Activity Image */}
        {mockActivity.image && (
          <ImageWithFallback
            src={mockActivity.image}
            alt={mockActivity.title}
            className="w-full h-64 object-cover rounded-lg"
          />
        )}

        {/* Activity Header */}
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <Badge variant="outline" className="mb-2">
                {mockActivity.activityName}
              </Badge>
              <h1 className="text-2xl mb-2">{mockActivity.title}</h1>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">
                {spotsLeft} {spotsLeft === 1 ? 'spot' : 'spots'} left
              </p>
            </div>
          </div>

          <p className="text-muted-foreground">{mockActivity.description}</p>

          {/* Event Details */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <p>{mockActivity.location}</p>
                <p className="text-sm text-muted-foreground">{mockActivity.fullAddress}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <p>{mockActivity.date} • {mockActivity.time}</p>
            </div>
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-muted-foreground" />
              <p>{mockActivity.attendees.length}/{mockActivity.maxAttendees} people going</p>
            </div>
            {mockActivity.eventLink && (
              <div className="flex items-center gap-3">
                <ExternalLink className="h-5 w-5 text-muted-foreground" />
                <a href={mockActivity.eventLink} className="text-blue-600 hover:underline">
                  Event Link
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Host Info */}
        <Card>
          <CardHeader>
            <CardTitle>Host</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-4">
              <div className={`h-12 w-12 ${mockActivity.host.avatarColor} rounded-full flex items-center justify-center flex-shrink-0`}>
                <span className="text-white font-semibold">{mockActivity.host.initials}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{mockActivity.host.name}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Tap to message the host
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Attendees */}
        <Card>
          <CardHeader>
            <CardTitle>Who's Going ({mockActivity.attendees.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockActivity.attendees.map((attendee, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className={`h-10 w-10 ${attendee.avatarColor} rounded-full flex items-center justify-center flex-shrink-0`}>
                    <span className="text-white text-sm font-semibold">{attendee.initials}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span>{attendee.name}</span>
                      {attendee.isHost && (
                        <Badge variant="secondary" className="text-xs">Host</Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat Section (only if joined) */}
        {requestStatus === "accepted" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Group Chat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-4">
                <div className="text-sm text-muted-foreground text-center">
                  You joined the activity! Start chatting with other attendees.
                </div>
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-sm">
                    <strong>Alex:</strong> Great to have everyone! Looking forward to the game 🎾
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <input 
                  className="flex-1 px-3 py-2 border rounded-md text-sm"
                  placeholder="Type a message..."
                />
                <Button size="sm">Send</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="sticky bottom-6 bg-background p-4 border rounded-lg shadow-lg">
          {requestStatus === "accepted" ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span>You're going!</span>
              </div>
              <div className="flex gap-2 ml-auto">
                <Button variant="outline">Leave Activity</Button>
                <Button onClick={() => setShowChat(!showChat)}>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Chat
                </Button>
              </div>
            </div>
          ) : requestStatus === "pending" ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-yellow-600">
                <AlertCircle className="h-5 w-5" />
                <span>Request Pending</span>
              </div>
              <div className="flex gap-2 ml-auto">
                <Button variant="outline">Cancel Request</Button>
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button onClick={handleJoin} className="flex-1" disabled={spotsLeft === 0}>
                {spotsLeft === 0 ? 'Activity Full' : '+1 Join Activity'}
              </Button>
              <Button variant="outline" size="icon">
                <MessageCircle className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  ArrowLeft, 
  CheckCircle, 
  Clock, 
  Users, 
  Shield, 
  Calendar,
  MessageCircle,
  Star,
  Bell
} from "lucide-react";

interface NotificationsPageProps {
  onBack: () => void;
}

const mockNotifications = {
  all: [
    {
      id: "1",
      type: "request_accepted",
      title: "Request Accepted",
      message: "Alex accepted your request to join Tennis at Rock Creek Park",
      time: "2 hours ago",
      icon: CheckCircle,
      color: "text-green-600"
    },
    {
      id: "2",
      type: "activity_updated",
      title: "Activity Updated",
      message: "Drake Concert Pregame time changed to 5:30 PM",
      time: "3 hours ago",
      icon: Calendar,
      color: "text-blue-600"
    },
    {
      id: "3",
      type: "activity_reminder",
      title: "Upcoming Activity",
      message: "Tennis at Rock Creek Park starts in 2 hours",
      time: "4 hours ago",
      icon: Clock,
      color: "text-amber-600"
    },
    {
      id: "4",
      type: "activity_cancelled",
      title: "Activity Cancelled",
      message: "Basketball Pickup Game has been cancelled",
      time: "1 day ago",
      icon: MessageCircle,
      color: "text-red-600"
    },
    {
      id: "5",
      type: "activity_reminder",
      title: "Upcoming Activity",
      message: "Coffee & Work session starts tomorrow at 10:00 AM",
      time: "1 day ago",
      icon: Clock,
      color: "text-amber-600"
    }
  ]
};

export function NotificationsPage({ onBack }: NotificationsPageProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-black sticky top-0 z-50 shadow-sm">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between">
          <Button variant="ghost" onClick={onBack} className="p-0 h-auto text-white hover:bg-white/20 text-sm sm:text-base">
            <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
            <span>Back to Feed</span>
          </Button>
          <h1 className="text-base sm:text-lg text-white">Notifications</h1>
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 text-xs sm:text-sm h-7 sm:h-8">
            Mark Read
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="space-y-2 sm:space-y-3">
          {mockNotifications.all.map((notification) => {
            const Icon = notification.icon;
            return (
              <Card key={notification.id} className="cursor-pointer hover:shadow-sm transition-shadow">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full bg-muted ${notification.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium text-sm">{notification.title}</h3>
                        <span className="text-xs text-muted-foreground">{notification.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          
          {mockNotifications.all.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No notifications yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
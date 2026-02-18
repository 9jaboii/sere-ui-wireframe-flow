import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ArrowLeft, Send, MessageCircle, Search, MoreVertical, Shield } from "lucide-react";

interface ChatsProps {
  onBack: () => void;
}

interface ChatPreview {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  activityTitle: string;
  isOnline: boolean;
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  isCurrentUser: boolean;
}

export function Chats({ onBack }: ChatsProps) {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const mockChats: ChatPreview[] = [
    {
      id: "1",
      name: "Sarah Johnson",
      avatar: "/api/placeholder/40/40",
      lastMessage: "Looking forward to the tennis match tomorrow!",
      timestamp: "2m ago",
      unreadCount: 2,
      activityTitle: "Tennis at Central Park",
      isOnline: true
    },
    {
      id: "2", 
      name: "Mike Chen",
      avatar: "/api/placeholder/40/40",
      lastMessage: "Should I bring anything for the hiking trip?",
      timestamp: "1h ago",
      unreadCount: 0,
      activityTitle: "Mountain Hiking Adventure",
      isOnline: false
    },
    {
      id: "3",
      name: "Emma Wilson",
      avatar: "/api/placeholder/40/40", 
      lastMessage: "Thanks for organizing the book club meetup!",
      timestamp: "3h ago",
      unreadCount: 1,
      activityTitle: "Book Club Discussion",
      isOnline: true
    },
    {
      id: "4",
      name: "Alex Rodriguez",
      avatar: "/api/placeholder/40/40",
      lastMessage: "Are we still meeting at 7 PM?",
      timestamp: "1d ago",
      unreadCount: 0,
      activityTitle: "Coffee & Networking",
      isOnline: false
    }
  ];

  const mockMessages: Record<string, Message[]> = {
    "1": [
      {
        id: "m1",
        senderId: "sarah",
        senderName: "Sarah Johnson",
        content: "Hi! I'm really excited about our tennis match tomorrow.",
        timestamp: "2:30 PM",
        isCurrentUser: false
      },
      {
        id: "m2", 
        senderId: "current",
        senderName: "You",
        content: "Me too! I've been practicing my serves. What time should we meet?",
        timestamp: "2:32 PM",
        isCurrentUser: true
      },
      {
        id: "m3",
        senderId: "sarah",
        senderName: "Sarah Johnson",
        content: "How about 10 AM? That way we can beat the afternoon heat.",
        timestamp: "2:35 PM",
        isCurrentUser: false
      },
      {
        id: "m4",
        senderId: "sarah", 
        senderName: "Sarah Johnson",
        content: "Looking forward to the tennis match tomorrow!",
        timestamp: "2:40 PM",
        isCurrentUser: false
      }
    ],
    "2": [
      {
        id: "m5",
        senderId: "mike",
        senderName: "Mike Chen",
        content: "Hey! Looking forward to the hike this weekend.",
        timestamp: "Yesterday",
        isCurrentUser: false
      },
      {
        id: "m6",
        senderId: "current", 
        senderName: "You",
        content: "Same here! It's going to be amazing weather.",
        timestamp: "Yesterday",
        isCurrentUser: true
      },
      {
        id: "m7",
        senderId: "mike",
        senderName: "Mike Chen", 
        content: "Should I bring anything for the hiking trip?",
        timestamp: "1h ago",
        isCurrentUser: false
      }
    ]
  };

  const filteredChats = mockChats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.activityTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedChat = mockChats.find(chat => chat.id === selectedChatId);
  const messages = selectedChatId ? mockMessages[selectedChatId] || [] : [];

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedChatId) {
      // In a real app, this would send the message to the backend
      console.log("Sending message:", newMessage);
      setNewMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-black border-b z-10 shadow-sm">
        <div className="flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-2.5 sm:py-3">
          <Button variant="ghost" size="icon" onClick={onBack} className="text-white hover:bg-white/20 h-8 w-8 sm:h-10 sm:w-10">
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          <h1 className="flex-1 text-base sm:text-lg text-white">Messages</h1>
          {selectedChatId && (
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 h-8 w-8 sm:h-10 sm:w-10">
              <MoreVertical className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          )}
        </div>
      </div>

      {/* Safety Warning */}
      <div className="bg-amber-50 border-b border-amber-200 px-3 sm:px-4 py-2 sm:py-3">
        <div className="flex items-center gap-2 text-amber-800">
          <Shield className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
          <p className="text-xs sm:text-sm">
            Keep conversations safe - meet in public places and trust your instincts
          </p>
        </div>
      </div>

      <div className="flex h-[calc(100vh-130px)]">
        {/* Chat List */}
        <div className={`${selectedChatId ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-80 border-r bg-background`}>
          {/* Search */}
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Chat Previews */}
          <div className="flex-1 overflow-y-auto">
            {filteredChats.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <h3>No conversations found</h3>
                <p className="text-sm text-muted-foreground">
                  {searchQuery ? "Try a different search term" : "Start chatting with activity participants"}
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {filteredChats.map((chat) => (
                  <div
                    key={chat.id}
                    className={`flex items-center gap-3 p-4 hover:bg-muted cursor-pointer transition-colors ${
                      selectedChatId === chat.id ? 'bg-muted' : ''
                    }`}
                    onClick={() => setSelectedChatId(chat.id)}
                  >
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={chat.avatar} />
                        <AvatarFallback>{chat.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      {chat.isOnline && (
                        <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 border-2 border-background rounded-full" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="truncate">{chat.name}</p>
                        <span className="text-xs text-muted-foreground">{chat.timestamp}</span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate mb-1">{chat.lastMessage}</p>
                      <Badge variant="outline" className="text-xs">
                        {chat.activityTitle}
                      </Badge>
                    </div>

                    {chat.unreadCount > 0 && (
                      <Badge variant="default" className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                        {chat.unreadCount}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Chat Messages */}
        <div className={`${selectedChatId ? 'flex' : 'hidden md:flex'} flex-col flex-1`}>
          {selectedChatId && selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center gap-3 p-4 border-b bg-background">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="md:hidden"
                  onClick={() => setSelectedChatId(null)}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={selectedChat.avatar} />
                  <AvatarFallback>{selectedChat.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p>{selectedChat.name}</p>
                  <p className="text-xs text-muted-foreground">{selectedChat.activityTitle}</p>
                </div>
                {selectedChat.isOnline && (
                  <Badge variant="outline" className="text-xs">Online</Badge>
                )}
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isCurrentUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.isCurrentUser
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.isCurrentUser
                          ? 'text-primary-foreground/70'
                          : 'text-muted-foreground'
                      }`}>
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t bg-background">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center">
              <div>
                <MessageCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3>Select a conversation</h3>
                <p className="text-sm text-muted-foreground">
                  Choose a chat from the sidebar to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
import { useState } from "react";
import { LandingPage } from "./components/LandingPage";
import { AuthForms } from "./components/AuthForms";
import { Profile } from "./components/Profile";
import { MainFeed } from "./components/MainFeed";
import { CreatePost } from "./components/CreatePost";
import { ActivityDetails } from "./components/ActivityDetails";
import { NotificationsPage } from "./components/NotificationsPage";
import { Chats } from "./components/Chats";
import { Toaster } from "./components/ui/sonner";

type Screen = 
  | "landing" 
  | "login" 
  | "signup" 
  | "feed" 
  | "create-post" 
  | "activity-details" 
  | "notifications"
  | "profile"
  | "chats";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("landing");
  const [selectedActivityId, setSelectedActivityId] = useState<string>("");
  const [isLogin, setIsLogin] = useState(true);

  const handleSignUp = () => {
    setIsLogin(false);
    setCurrentScreen("signup");
  };

  const handleLogin = () => {
    setIsLogin(true);
    setCurrentScreen("login");
  };

  const handleAuthSuccess = () => {
    // After signup/login, go directly to feed
    setCurrentScreen("feed");
  };

  const handleCreatePost = () => {
    setCurrentScreen("create-post");
  };

  const handlePostCreated = () => {
    setCurrentScreen("feed");
  };

  const handleViewActivity = (id: string) => {
    setSelectedActivityId(id);
    setCurrentScreen("activity-details");
  };

  const handleJoinActivity = () => {
    // Activity joined - stay on activity details to show pending status
  };

  const handleViewNotifications = () => {
    setCurrentScreen("notifications");
  };

  const handleViewProfile = () => {
    setCurrentScreen("profile");
  };

  const handleViewChats = () => {
    setCurrentScreen("chats");
  };

  const handleSignOut = () => {
    setCurrentScreen("landing");
  };

  const handleBackToFeed = () => {
    setCurrentScreen("feed");
  };

  const handleBackToLanding = () => {
    setCurrentScreen("landing");
  };

  const handleToggleAuthMode = () => {
    setIsLogin(!isLogin);
    setCurrentScreen(isLogin ? "signup" : "login");
  };

  return (
    <div className="min-h-screen bg-background">
      {currentScreen === "landing" && (
        <LandingPage 
          onSignUp={handleSignUp}
          onLogin={handleLogin}
        />
      )}

      {(currentScreen === "login" || currentScreen === "signup") && (
        <AuthForms
          isLogin={isLogin}
          onBack={handleBackToLanding}
          onAuthSuccess={handleAuthSuccess}
          onToggleMode={handleToggleAuthMode}
        />
      )}

      {currentScreen === "feed" && (
        <MainFeed
          onCreatePost={handleCreatePost}
          onViewActivity={handleViewActivity}
          onViewProfile={handleViewProfile}
          onViewNotifications={handleViewNotifications}
          onViewChats={handleViewChats}
        />
      )}

      {currentScreen === "create-post" && (
        <CreatePost
          onBack={handleBackToFeed}
          onPostCreated={handlePostCreated}
        />
      )}

      {currentScreen === "activity-details" && (
        <ActivityDetails
          activityId={selectedActivityId}
          onBack={handleBackToFeed}
          onJoin={handleJoinActivity}
        />
      )}

      {currentScreen === "notifications" && (
        <NotificationsPage onBack={handleBackToFeed} />
      )}

      {currentScreen === "profile" && (
        <Profile 
          onBack={handleBackToFeed} 
          onSignOut={handleSignOut}
        />
      )}

      {currentScreen === "chats" && (
        <Chats onBack={handleBackToFeed} />
      )}

      <Toaster />
    </div>
  );
}
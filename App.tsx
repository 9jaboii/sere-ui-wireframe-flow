import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Linking from 'expo-linking';
import { useAuthStore } from './stores/authStore';
import { supabase } from './lib/supabase';

// Screens
import MainFeedScreen from './screens/MainFeedScreen';
import CreatePostScreen from './screens/CreatePostScreen';
import ActivityDetailScreen from './screens/ActivityDetailScreen';
import ProfileScreen from './screens/ProfileScreen';
import ChatsScreen from './screens/ChatsScreen';
import ChatRoomScreen from './screens/ChatRoomScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import AuthScreen from './screens/AuthScreen';
import EditActivityScreen from './screens/EditActivityScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import SettingsScreen from './screens/SettingsScreen';
import FriendsScreen from './screens/FriendsScreen';
import InviteScreen from './screens/InviteScreen';

const Stack = createNativeStackNavigator();

const prefix = Linking.createURL('/');

const linking = {
  prefixes: [prefix, 'sere://'],
  config: {
    screens: {
      MainFeed: '',
      Profile: 'profile',
      Chats: 'chats',
      Notifications: 'notifications',
    },
  },
};

// Extract auth tokens from deep link URL and set session
async function handleDeepLink(url: string) {
  // Supabase auth callbacks contain tokens as URL fragments
  // e.g. sere://auth/callback#access_token=...&refresh_token=...
  if (!url) return;

  const hashIndex = url.indexOf('#');
  if (hashIndex === -1) return;

  const fragment = url.substring(hashIndex + 1);
  const params = new URLSearchParams(fragment);
  const accessToken = params.get('access_token');
  const refreshToken = params.get('refresh_token');

  if (accessToken && refreshToken) {
    await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  }
}

function LoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#000000" />
    </View>
  );
}

export default function App() {
  const { session, isLoading, initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  // Handle deep links for auth callbacks (email verification, OAuth)
  useEffect(() => {
    // Handle cold start deep link
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink(url);
    });

    // Handle warm deep links
    const subscription = Linking.addEventListener('url', (event) => {
      handleDeepLink(event.url);
    });

    return () => subscription.remove();
  }, []);

  if (isLoading) {
    return (
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <LoadingScreen />
      </SafeAreaProvider>
    );
  }

  if (!session) {
    return (
      <SafeAreaProvider>
        <StatusBar style="light" />
        <AuthScreen />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer linking={linking}>
        <StatusBar style="light" />
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#ffffff' },
          }}
        >
          <Stack.Screen name="MainFeed" component={MainFeedScreen} />
          <Stack.Screen name="CreatePost" component={CreatePostScreen} />
          <Stack.Screen name="ActivityDetail" component={ActivityDetailScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Chats" component={ChatsScreen} />
          <Stack.Screen name="ChatRoom" component={ChatRoomScreen} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} />
          <Stack.Screen name="EditActivity" component={EditActivityScreen} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="Friends" component={FriendsScreen} />
          <Stack.Screen name="Invite" component={InviteScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
});

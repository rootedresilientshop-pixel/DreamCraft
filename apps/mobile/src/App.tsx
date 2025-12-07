import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import IdeaDocumentationScreen from './screens/IdeaDocumentationScreen';
import CollaboratorBrowseScreen from './screens/CollaboratorBrowseScreen';
import ProfileScreen from './screens/ProfileScreen';
import SplashScreen from './screens/SplashScreen';
import CreateIdeaScreen from './screens/CreateIdeaScreen';
import IdeaDetailScreen from './screens/IdeaDetailScreen';
import CheckoutScreen from './screens/CheckoutScreen';
import NotificationsScreen from './screens/NotificationsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const HomeTabNavigator = () => {
  return (
      <Tab.Navigator
      screenOptions={({ route }: any) => ({
        tabBarIcon: ({ color, size }: any) => {
          const icons: any = {
            Home: <Text style={{ color: color as any, fontSize: (size || 16) as any }}>🏠</Text>,
            Ideas: <Text style={{ color: color as any, fontSize: (size || 16) as any }}>💡</Text>,
            Notifications: <Text style={{ color: color as any, fontSize: (size || 16) as any }}>🔔</Text>,
            Collaborators: <Text style={{ color: color as any, fontSize: (size || 16) as any }}>👥</Text>,
            Profile: <Text style={{ color: color as any, fontSize: (size || 16) as any }}>👤</Text>,
          };
          return icons[route.name];
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Ideas" component={IdeaDocumentationScreen} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
      <Tab.Screen name="Collaborators" component={CollaboratorBrowseScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { state } = useAuth();

  if (state.isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {state.userToken == null ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <>
            <Stack.Screen name="Home" component={HomeTabNavigator} />
            <Stack.Screen name="CreateIdea" component={CreateIdeaScreen} options={{ presentation: 'modal' }} />
            <Stack.Screen name="IdeaDetail" component={IdeaDetailScreen} options={{ presentation: 'card' }} />
            <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ presentation: 'card' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}

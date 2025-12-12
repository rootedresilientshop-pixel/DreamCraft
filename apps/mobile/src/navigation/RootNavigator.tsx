import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, StyleSheet } from "react-native";

// Screens
import LoginScreen from "../screens/LoginScreen";
import RoleSelectionScreen from "../screens/RoleSelectionScreen";
import CollaboratorProfileWizardScreen from "../screens/CollaboratorProfileWizardScreen";
import HomeScreen from "../screens/HomeScreen";
import CreatorHomeScreen from "../screens/CreatorHomeScreen";
import CollaboratorHomeScreen from "../screens/CollaboratorHomeScreen";
import IdeaDetailScreen from "../screens/IdeaDetailScreen";
import CreateIdeaScreen from "../screens/CreateIdeaScreen";
import CheckoutScreen from "../screens/CheckoutScreen";
import CollaboratorBrowseScreen from "../screens/CollaboratorBrowseScreen";
import NotificationsScreen from "../screens/NotificationsScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { Feather } from "@expo/vector-icons";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const screenOptions = {
  headerStyle: styles.header,
  headerTintColor: "#0099ff",
  headerTitleStyle: styles.headerTitle,
  cardStyle: { backgroundColor: "#0a0a0a" },
};

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RoleSelection"
        component={RoleSelectionScreen}
        options={{
          title: "Choose Your Role",
          headerLeft: () => null,
        }}
      />
      <Stack.Screen
        name="ProfileWizard"
        component={CollaboratorProfileWizardScreen}
        options={{
          title: "Complete Your Profile",
          headerLeft: () => null,
        }}
      />
    </Stack.Navigator>
  );
}

function CreatorTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => {
          let iconName: keyof typeof Feather.glyphMap = "home";

          if (route.name === "CreatorHome") iconName = "home";
          else if (route.name === "CreateIdea") iconName = "plus-circle";
          else if (route.name === "Notifications") iconName = "bell";
          else if (route.name === "Profile") iconName = "user";

          return <Feather name={iconName} size={24} color={color} />;
        },
        tabBarActiveTintColor: "#ff9800",
        tabBarInactiveTintColor: "#666",
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        headerStyle: styles.header,
        headerTintColor: "#ff9800",
        headerTitleStyle: styles.headerTitle,
        cardStyle: { backgroundColor: "#0a0a0a" },
      })}
    >
      <Tab.Screen
        name="CreatorHome"
        component={CreatorHomeScreen}
        options={{ title: "Create Ideas" }}
      />
      <Tab.Screen
        name="CreateIdea"
        component={CreateIdeaScreen}
        options={{ title: "New Idea" }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{ title: "Notifications" }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: "Profile" }}
      />
    </Tab.Navigator>
  );
}

function CollaboratorTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => {
          let iconName: keyof typeof Feather.glyphMap = "home";

          if (route.name === "CollaboratorHome") iconName = "home";
          else if (route.name === "Browse") iconName = "search";
          else if (route.name === "Notifications") iconName = "bell";
          else if (route.name === "Profile") iconName = "user";

          return <Feather name={iconName} size={24} color={color} />;
        },
        tabBarActiveTintColor: "#0099ff",
        tabBarInactiveTintColor: "#666",
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        headerStyle: styles.header,
        headerTintColor: "#0099ff",
        headerTitleStyle: styles.headerTitle,
        cardStyle: { backgroundColor: "#0a0a0a" },
      })}
    >
      <Tab.Screen
        name="CollaboratorHome"
        component={CollaboratorHomeScreen}
        options={{ title: "Collaborate" }}
      />
      <Tab.Screen
        name="Browse"
        component={CollaboratorBrowseScreen}
        options={{ title: "Browse Ideas" }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{ title: "Notifications" }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: "Profile" }}
      />
    </Tab.Navigator>
  );
}

interface RootNavigatorProps {
  isLoggedIn: boolean;
}

export default function RootNavigator({ isLoggedIn }: RootNavigatorProps) {
  const [userType, setUserType] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isLoggedIn) {
      // Get userType from AsyncStorage or SecureStore
      const loadUserType = async () => {
        try {
          const userStorage = require("expo-secure-store");
          const userData = await userStorage.getItemAsync("userData");
          if (userData) {
            const parsed = JSON.parse(userData);
            setUserType(parsed.userType || "creator");
          } else {
            setUserType("creator"); // default
          }
        } catch (err) {
          console.error("Failed to load user type:", err);
          setUserType("creator");
        }
      };
      loadUserType();
    }
  }, [isLoggedIn]);

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      {!isLoggedIn ? (
        <Stack.Group>
          <Stack.Screen
            name="AuthStack"
            component={AuthStack}
            options={{ headerShown: false }}
          />
        </Stack.Group>
      ) : userType === "creator" ? (
        <Stack.Group screenOptions={{ headerShown: true }}>
          <Stack.Screen
            name="CreatorTabs"
            component={CreatorTabNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="IdeaDetail"
            component={IdeaDetailScreen}
            options={{ title: "Idea Details" }}
          />
          <Stack.Screen
            name="Checkout"
            component={CheckoutScreen}
            options={{ title: "Checkout" }}
          />
        </Stack.Group>
      ) : (
        <Stack.Group screenOptions={{ headerShown: true }}>
          <Stack.Screen
            name="CollaboratorTabs"
            component={CollaboratorTabNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="IdeaDetail"
            component={IdeaDetailScreen}
            options={{ title: "Idea Details" }}
          />
          <Stack.Screen
            name="Checkout"
            component={CheckoutScreen}
            options={{ title: "Checkout" }}
          />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#111",
    borderBottomColor: "#222",
    borderBottomWidth: 1,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  tabBar: {
    backgroundColor: "#111",
    borderTopColor: "#222",
    borderTopWidth: 1,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: "500",
    marginTop: 4,
  },
});

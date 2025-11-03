import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import CustomHeader from '../components/CustomHeader';

// Import screens
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import ProfileScreen from '../screens/PorfileScreen';

// Define navigation types
export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
};

export type MainStackParamList = {
  Profile: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

// Create navigators
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const MainStack = createNativeStackNavigator<MainStackParamList>();
const RootStack = createNativeStackNavigator<RootStackParamList>();

// Auth Stack Navigator (Login & Signup)
function AuthNavigator() {
  return (
    <AuthStack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: true,
      }}>
      <AuthStack.Screen 
        name="Login" 
        component={LoginScreen}
        options={({ navigation }) => ({
          header: () => (
            <CustomHeader 
              title="Sign In" 
              showBackButton={false}
            />
          ),
        })}
      />
      <AuthStack.Screen 
        name="Signup" 
        component={SignupScreen}
        options={({ navigation }) => ({
          header: () => (
            <CustomHeader 
              title="Create Account" 
              showBackButton={true}
              navigation={navigation}
            />
          ),
        })}
      />
    </AuthStack.Navigator>
  );
}

// Main Stack Navigator (Profile only after login)
function MainNavigator() {
  const { logout } = useAuth();

  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: true,
      }}>
      <MainStack.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={({ navigation }) => ({
          header: () => (
            <CustomHeader 
              title="Profile" 
              showBackButton={false}
              rightButton={{
                label: 'Logout',
                onPress: logout,
              }}
            />
          ),
        })}
      />
    </MainStack.Navigator>
  );
}

// Root Navigator (switches between Auth and Main)
function RootNavigator() {
  const { isAuthenticated } = useAuth();

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <RootStack.Screen name="Auth" component={AuthNavigator} />
      ) : (
        <RootStack.Screen name="Main" component={MainNavigator} />
      )}
    </RootStack.Navigator>
  );
}

// Main App Navigation Component
export default function AppNavigation() {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}


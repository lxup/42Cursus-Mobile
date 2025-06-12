import React from 'react';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { createMaterialTopTabNavigator, MaterialTopTabNavigationEventMap, MaterialTopTabNavigationOptions } from '@react-navigation/material-top-tabs';
import { withLayoutContext } from "expo-router";
import { ParamListBase, TabNavigationState } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Tabs = createMaterialTopTabNavigator();
const MaterialTopTabs = withLayoutContext<
	MaterialTopTabNavigationOptions,
	typeof Tabs.Navigator,
	TabNavigationState<ParamListBase>,
	MaterialTopTabNavigationEventMap
>(Tabs.Navigator);


export default function Ex00Layout() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();

  return (
    <MaterialTopTabs
    tabBarPosition='bottom'
    screenOptions={{
      tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
      tabBarStyle: {
        paddingBottom: insets.bottom / 2,
      }
    }}
    >
      <MaterialTopTabs.Screen
      name="index"
      options={{
        tabBarIcon: ({ color } : { color: string }) => <IconSymbol size={28} name="house.fill" color={color} />,
        tabBarLabel: 'Currently',
        tabBarAccessibilityLabel: 'Currently',
      }}
      />
      <MaterialTopTabs.Screen
      name="today"
      options={{
        tabBarIcon: ({ color } : { color: string }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        tabBarLabel: 'Today',
        tabBarAccessibilityLabel: 'Today',
      }}
      />
      <MaterialTopTabs.Screen
      name="weekly"
      options={{
        tabBarIcon: ({ color } : { color: string }) => <IconSymbol size={28} name="calendar" color={color} />,
        tabBarLabel: 'Weekly',
        tabBarAccessibilityLabel: 'Weekly',
      }}
      />
    </MaterialTopTabs>
  );
}

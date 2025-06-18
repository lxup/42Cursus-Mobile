import { ActivityIndicator, ScrollView, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useLocation } from '@/context/LocationProvider';
import tw from '@/lib/tw';
import { useMeteo } from '@/queries/open-meteo';
import { useMemo } from 'react';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useThemeColor } from '@/hooks/useThemeColor';
import getWeatherCondition from '@/hooks/getWeatherCondition';
import { SymbolView } from 'expo-symbols';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CurrentlyScreen() {
  // Colors
  const textColor = useThemeColor({}, 'text');
  const mutedForegroundColor = useThemeColor({}, 'mutedForeground');
  // States
  const { activeLocation } = useLocation();
  const {
    data: meteo,
    isLoading,
    isError,
    refetch: refetchMeteo,
  } = useMeteo({
    latitude: activeLocation?.data?.latitude,
    longitude: activeLocation?.data?.longitude,
  });
  const weatherCondition = useMemo(() => {
    if (meteo?.current?.weatherCode === undefined) return undefined;
    return getWeatherCondition(meteo.current.weatherCode);
  }, [meteo]);

  return (
  <SafeAreaView edges={['left', 'right']} style={tw`flex-1`}>
    <ScrollView contentContainerStyle={tw`min-h-full justify-center items-center gap-4 p-4`}>
        {activeLocation ? (
          <>
            {/* HEADER */}
            <View style={tw`flex flex-col items-center gap-1`}>
              {activeLocation.source === 'geolocation' && <ThemedText style={tw`text-xs`}>MY POSITION</ThemedText>}
              <View style={tw`flex flex-col items-center`}>
                <ThemedText type="subtitle" style={tw`font-bold`}>{activeLocation.data?.address?.city}</ThemedText>
                <ThemedText style={tw`text-xs`}>
                  {activeLocation.data?.address?.region && <ThemedText style={[tw`text-xs`, { color: mutedForegroundColor }]}>{activeLocation.data?.address?.region}, </ThemedText>}
                  {activeLocation.data?.address?.country}
                </ThemedText>
              </View>
            </View>
            {isLoading ? (
              <ActivityIndicator />
            ) : meteo?.current ? (
              <View style={tw`flex flex-col items-center gap-1`}>
                <SymbolView
                  size={100}
                  name={weatherCondition?.icon || 'sun.max.fill'}
                  type="multicolor"
                />
                {meteo.current.temp && <ThemedText style={tw`text-6xl font-bold`}>{meteo.current.temp?.toFixed(0)}°C</ThemedText>}
                {weatherCondition && <ThemedText>{weatherCondition.label}</ThemedText>}
                {/* EXTRA DATA */}
                <View style={tw`flex flex-row items-center gap-2`}>
                  {meteo.current.windSpeed && (
                    <View style={tw`flex flex-row items-center gap-1`}>
                      <IconSymbol size={28} name="wind" color={textColor} />
                      <ThemedText style={tw`text-sm font-semibold`}>{meteo.current.windSpeed?.toFixed(1)} km/h</ThemedText>
                    </View>
                  )}
                </View>
              </View>
            ) : isError ? (
             <View style={tw`flex flex-col items-center border border-red-500 rounded p-4 gap-2`}>
                <View style={tw`flex flex-col items-center`}>
                  <ThemedText style={[{ color: mutedForegroundColor }]}>Error loading weather data</ThemedText>
                  <ThemedText style={[tw`text-xs`, { color: mutedForegroundColor }]}>Please check your internet connection or try again later.</ThemedText>
                </View>
                <TouchableOpacity onPress={() => refetchMeteo()} style={tw`p-2 bg-red-500 rounded-full`}>
                  <ThemedText>Retry</ThemedText>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <ThemedText style={[tw`text-center`, { color: mutedForegroundColor }]}>No weather data available</ThemedText>
              </>
            )}
          </>
        ) : (
          <ThemedText style={[tw`text-center`, { color: mutedForegroundColor }]}>Select a location</ThemedText>
        )}
    </ScrollView>
  </SafeAreaView>
  );
}

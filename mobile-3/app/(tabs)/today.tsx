import { ActivityIndicator, FlatList, ScrollView, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useLocation } from '@/context/LocationProvider';
import tw from '@/lib/tw';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useMeteo } from '@/queries/open-meteo';
import getWeatherCondition from '@/hooks/getWeatherCondition';
import { SymbolView } from 'expo-symbols';
import { useMemo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import LineChartTwo from '@/components/Charts';

export default function TodayScreen() {
  // Colors
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
  const meteoToday = useMemo(() => {
    if (!meteo?.hourly) return undefined;
    const today = new Date();
    return meteo.hourly.filter((item) => {
      const itemDate = new Date(item.time);
      return itemDate.getDate() === today.getDate() &&
             itemDate.getMonth() === today.getMonth() &&
             itemDate.getFullYear() === today.getFullYear();
    });
  }, [meteo]);

  return (
    <SafeAreaView edges={['left', 'right']} style={tw`flex-1`}>
      <ScrollView contentContainerStyle={tw`justify-center items-center gap-4 p-4`}>
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
          ) : meteoToday?.length ? (
            <>
              <View style={[tw`flex flex-col items-center justify-center gap-1 bg-red-500`, { height: 700 }]}>
                <ThemedText>Big VView</ThemedText>
              </View>
              {/* <LineChartTwo /> */}
              <FlatList
              data={meteoToday}
              keyExtractor={(item) => item.time}
              renderItem={({ item, index }) => {
                const weatherCondition = item.weatherCode !== undefined ? getWeatherCondition(item.weatherCode) : undefined;
                return (
                  <TouchableOpacity key={index} onPress={() => console.log(item)}>
                    <View style={tw`items-center`}>
                      <ThemedText style={tw`text-xs`}>{`${new Date(item.time).toLocaleTimeString([], { hour: '2-digit' })} h`}</ThemedText>
                      <SymbolView size={24} name={weatherCondition?.icon ?? 'sun.max.fill'} type="multicolor" />
                      <ThemedText style={tw`font-semibold`}>{item.temp?.toFixed(0)}°C</ThemedText>
                      {item.windSpeed && (
                        <View style={tw`flex-row items-center gap-1 justify-center`}>
                          <SymbolView size={16} name="wind" type="multicolor" />
                          <ThemedText style={{ fontSize: 10 }}>{item.windSpeed.toFixed(0)} km/h</ThemedText>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              }}
              horizontal
              style={tw`grow-0 pb-2`}
              contentContainerStyle={tw`gap-4`}
              />
            </>
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
            <ThemedText style={[tw`text-center`, { color: mutedForegroundColor }]}>No weather data available for today</ThemedText>
          )}
          </>
          // <FlatList
          // data={meteoToday}
          // keyExtractor={(item) => item.time}
          // ListHeaderComponent={() => (
          //   <View style={tw`flex flex-col items-center gap-1`}>
          //     {activeLocation.source === 'geolocation' && <ThemedText style={tw`text-xs`}>MY POSITION</ThemedText>}
          //     <View style={tw`flex flex-col items-center`}>
          //       <ThemedText type="subtitle" style={tw`font-bold`}>{activeLocation.data?.address?.city}</ThemedText>
          //       <ThemedText style={tw`text-xs`}>
          //         {activeLocation.data?.address?.region && <ThemedText style={[tw`text-xs`, { color: mutedForegroundColor }]}>{activeLocation.data?.address?.region}, </ThemedText>}
          //         {activeLocation.data?.address?.country}
          //       </ThemedText>
          //     </View>
          //   </View>
          // )}
          // renderItem={({ item, index }) => {
          //   const weatherCondition = item.weatherCode ? getWeatherCondition(item.weatherCode) : undefined;
          //   return (
          //     <View style={tw`flex-row items-center justify-between w-full px-4 py-2 ${index !== meteoToday?.length! - 1 ? 'border-b border-gray-200/50' : ''}`}>
          //       <View style={tw`flex-1 items-start`}>
          //         <ThemedText>{`${new Date(item.time).toLocaleTimeString([], { hour: '2-digit' })} h`}</ThemedText>
          //       </View>

          //       <View style={tw`flex-1 items-center`}>
          //         {item.windSpeed && (
          //           <View style={tw`flex-row items-center gap-2 justify-center`}>
          //             <SymbolView size={24} name="wind" type="multicolor" />
          //             <ThemedText>{item.windSpeed.toFixed(0)} km/h</ThemedText>
          //           </View>
          //         )}
          //       </View>

          //       <View style={tw`flex-1 items-end`}>
          //         <View style={tw`flex-row items-center gap-2 justify-end`}>
          //           {weatherCondition && (
          //             <SymbolView size={24} name={weatherCondition?.icon} type="multicolor" />
          //           )}
          //           <ThemedText>{item.temp?.toFixed(0)}°C</ThemedText>
          //         </View>
          //       </View>
          //     </View>
          //   )
          // }}
          // ListEmptyComponent={() => (
          //   isLoading ? (
          //     <ActivityIndicator style={[tw`p-2`]} />
          //   ) : isError ? (
          //     <View style={tw`flex flex-col items-center border border-red-500 rounded p-4 gap-2`}>
          //       <View style={tw`flex flex-col items-center`}>
          //         <ThemedText style={[{ color: mutedForegroundColor }]}>Error loading weather data</ThemedText>
          //         <ThemedText style={[tw`text-xs`, { color: mutedForegroundColor }]}>Please check your internet connection or try again later.</ThemedText>
          //       </View>
          //       <TouchableOpacity onPress={() => refetchMeteo()} style={tw`p-2 bg-red-500 rounded-full`}>
          //         <ThemedText>Retry</ThemedText>
          //       </TouchableOpacity>
          //     </View>
          //   ) : (
          //     <ThemedText style={[tw`text-center p-2`, { color: mutedForegroundColor }]} >No weather data available for today</ThemedText>
          //   )
          // )}
          // />
        ) : (
          <ThemedText style={[tw`text-center`, { color: mutedForegroundColor }]}>Select a location</ThemedText>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
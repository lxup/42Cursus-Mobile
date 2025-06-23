import { ActivityIndicator, FlatList, ScrollView, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useLocation } from '@/context/LocationProvider';
import tw from '@/lib/tw';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useMeteo } from '@/queries/open-meteo';
import getWeatherCondition from '@/hooks/getWeatherCondition';
import { SymbolView } from 'expo-symbols';
import { useMemo } from 'react';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LineChart, ruleTypes } from 'react-native-gifted-charts';

export default function TodayScreen() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  // Colors
  const backgroundColor = useThemeColor({}, 'background');
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
  const [minTempToday, maxTempToday] = useMemo(() => {
    if (!meteoToday?.length) return [-Infinity, -Infinity];
    const temps = meteoToday.map(item => item.temp!);
    const min = Math.min(...temps);
    const max = Math.max(...temps);
    return [min, max];
  }, [meteoToday]);
  const chartMaxValue = useMemo(() => {
    if (maxTempToday < 0) {
      return minTempToday - 2;
    }
    return maxTempToday + 2;
  }, [maxTempToday, minTempToday]);

  return (
    <SafeAreaView edges={['left', 'right']} style={tw`flex-1`}>
      <ScrollView contentContainerStyle={tw`relative min-h-full justify-center items-center gap-4`}>
        {activeLocation ? (
          <>
          {/* HEADER */}
          <View style={tw`flex flex-col items-center gap-1 w-full p-4`}>
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
              <View style={tw`px-4 w-full`}>
                <View style={[tw`p-4 rounded-md`, { paddingRight: 30, backgroundColor: backgroundColor }]}>
                  <LineChart
                  key={`today-chart-${width}-${insets.left}-${insets.right}`}
                  areaChart
                  data={meteoToday.map((item, index) => ({
                    value: item.temp!,
                    date: item.time,
                    label: index % 4 === 0 ? (
                      `${new Date(item.time).toLocaleTimeString([], { hour: '2-digit' })} h`
                    ) : undefined,
                  }))}
                  rotateLabel
                  adjustToWidth
                  width={width - 124 - insets.left - insets.right}
                  color={maxTempToday > 20 ? '#ffb300' : '#2196f3'}
                  startFillColor={maxTempToday > 20 ? 'rgba(105, 75, 20, 0.3)' : 'rgba(33, 150, 243, 0.3)'}
                  endFillColor={maxTempToday > 20 ? 'rgba(85, 67, 20, 0.01)' : 'rgba(33, 150, 243, 0.01)'}
                  thickness={2}
                  startOpacity={0.9}
                  endOpacity={0.2}
                  initialSpacing={0}
                  endSpacing={0}
                  noOfSections={6}
                  stepHeight={40}
                  maxValue={chartMaxValue}
                  rulesType={ruleTypes.SOLID}
                  rulesColor="gray"
                  yAxisColor="white"
                  yAxisThickness={0}
                  yAxisTextStyle={{color: 'gray', fontSize: 10 }}
                  yAxisLabelSuffix="°C"
                  yAxisTextNumberOfLines={2}
                  xAxisLabelTextStyle={{
                    fontSize: 10,
                    color: 'gray',
                    width: 40,
                    marginLeft: -20
                  }}
                  xAxisIndicesColor={'white'}
                  xAxisIndicesHeight={2}
                  xAxisIndicesWidth={1}
                  xAxisColor="lightgray"
                  pointerConfig={{
                    pointerStripHeight: 160,
                    pointerStripColor: 'lightgray',
                    pointerStripWidth: 2,
                    pointerColor: 'lightgray',
                    radius: 6,
                    pointerLabelWidth: 100,
                    pointerLabelHeight: 90,
                    persistPointer: true,
                    autoAdjustPointerLabelPosition: true,
                    pointerLabelComponent: (item: { date: string, value: number }[]) => {
                      const date = new Date(item[0].date);
                      const formattedDate = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                      return (
                        <View
                          style={{
                            height: 90,
                            width: 100,
                            justifyContent: 'center',
                            zIndex: 1000,
                            // marginTop: -30,
                            // marginLeft: -40,
                          }}>
                          <Text
                            style={{
                              color: 'white',
                              fontSize: 14,
                              marginBottom: 6,
                              textAlign: 'center',
                            }}>
                            {formattedDate}
                          </Text>
              
                          <View
                            style={{
                              paddingHorizontal: 14,
                              paddingVertical: 6,
                              borderRadius: 16,
                              backgroundColor: 'white',
                            }}>
                            <Text style={{fontWeight: 'bold', textAlign: 'center'}}>
                              {`${item[0].value.toFixed(0)}°C`}
                            </Text>
                          </View>
                        </View>
                      );
                    },
                  }}
                  isAnimated
                  animationDuration={500}
                  animationEasing="easeInOut"
                  />
                </View>
              </View>
              <FlatList
              data={meteoToday}
              keyExtractor={(item) => item.time}
              renderItem={({ item, index }) => {
                const weatherCondition = item.weatherCode !== undefined ? getWeatherCondition(item.weatherCode) : undefined;
                return (
                  <View key={index} style={[tw`items-center p-2 rounded-md`, { backgroundColor: backgroundColor }]}>
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
                );
              }}
              horizontal
              style={tw`grow-0 pb-4`}
              contentContainerStyle={tw`gap-4 px-4`}
              showsHorizontalScrollIndicator={false}
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
        ) : (
          <ThemedText style={[tw`text-center`, { color: mutedForegroundColor }]}>Select a location</ThemedText>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
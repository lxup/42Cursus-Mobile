import { ActivityIndicator, FlatList, ScrollView, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useLocation } from '@/context/LocationProvider';
import tw from '@/lib/tw';
import getWeatherCondition from '@/hooks/getWeatherCondition';
import { SymbolView } from 'expo-symbols';
import { useMemo } from 'react';
import { useMeteo } from '@/queries/open-meteo';
import { useThemeColor } from '@/hooks/useThemeColor';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LineChart, ruleTypes } from 'react-native-gifted-charts';

export default function WeeklyScreen() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  // Colors
  const backgroundColor = useThemeColor({}, 'background');
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
  const meteoWeekly = useMemo(() => {
    if (!meteo?.daily) return undefined;
    const today = new Date();
    return meteo.daily.filter((item) => {
      const date = new Date(item.time);
      return (
        date.getFullYear() > today.getFullYear() ||
        date.getMonth() > today.getMonth() ||
        date.getDate() >= today.getDate()
      );
    });
  }, [meteo]);
  // const maxTempWeekly = useMemo(() => {
  //   if (!meteoWeekly?.length) return -Infinity;
  //   return meteoWeekly.reduce((max, item) => Math.max(max, item.tempMax ?? -Infinity), -Infinity);
  // }, [meteoWeekly]);
  const [minTempWeekly, maxTempWeekly] = useMemo(() => {
    if (!meteoWeekly?.length) return [-Infinity, -Infinity];
    const temps = meteoWeekly.flatMap(item => [item.tempMax ?? -Infinity, item.tempMin ?? -Infinity]);
    const min = Math.min(...temps);
    const max = Math.max(...temps);
    return [min, max];
  }, [meteoWeekly]);
  const chartMaxValue = useMemo(() => {
    if (maxTempWeekly < 0) {
      return minTempWeekly - 2;
    }
    return maxTempWeekly + 2;
  }, [maxTempWeekly, minTempWeekly]);
  
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
          ) : meteoWeekly?.length ? (
            <>
             <View style={tw`px-4 w-full`}>
                <View style={[tw`p-4 rounded-md`, { paddingRight: 30, backgroundColor: backgroundColor }]}>
                  <LineChart
                  key={`weekly-chart-${width}-${insets.left}-${insets.right}`}
                  areaChart
                  data={meteoWeekly.map(item => ({
                    value: item.tempMax!,
                    date: item.time,
                  }))}
                  data2={meteoWeekly.map(item => ({
                    value: item.tempMin!,
                    date: item.time,
                  }))}
                  rotateLabel
                  adjustToWidth
                  width={width - 124 - insets.left - insets.right}
                  color1='#ffb300'
                  color2='#2196f3'
                  thickness={2}
                  startFillColor1='rgba(255, 179, 0, 0.3)'
                  startFillColor2='rgba(33, 150, 243, 0.3)'
                  endFillColor1='rgba(255, 179, 0, 0.01)'
                  endFillColor2='rgba(33, 150, 243, 0.01)'
                  startOpacity1={0.9}
                  startOpacity2={0.9}
                  endOpacity1={0.2}
                  endOpacity2={0.2}
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
                  xAxisLabelTexts={meteoWeekly.map(item => {
                    const date = new Date(item.time);
                    return date.toLocaleDateString([], { month: '2-digit', day: '2-digit' }); 
                  })}
                  xAxisColor={'white'}
                  xAxisIndicesColor="lightgray"
                  xAxisLabelTextStyle={{
                    fontSize: 10,
                    color: 'gray',
                  }}
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
                  animationEasing={'easeInOut'}
                  />
                </View>
              </View>
              <FlatList
              data={meteoWeekly}
              keyExtractor={(item) => item.time}
              renderItem={({ item, index }) => {
                const weatherCondition = item.weatherCode !== undefined ? getWeatherCondition(item.weatherCode) : undefined;
                return (
                  <View key={index} style={[tw`items-center p-2 rounded-md w-28`, { backgroundColor: backgroundColor }]}>
                    <ThemedText numberOfLines={1} style={tw`text-xs`}>{new Date(item.time).toLocaleDateString('en-US', { weekday: 'long' })}</ThemedText>
                    <SymbolView size={24} name={weatherCondition?.icon ?? 'sun.max.fill'} type="multicolor" />
                    {item.tempMax && (
                      <View style={tw`flex-row items-center gap-1`}>
                        <IconSymbol size={12} name="arrow.up" color={textColor} />
                        <ThemedText style={{ fontSize: 10 }}>{item.tempMax.toFixed(0)}°C</ThemedText>
                      </View>
                    )}
                    {item.tempMin && (
                      <View style={tw`flex-row items-center gap-1`}>
                        <IconSymbol size={12} name="arrow.down" color={textColor} />
                        <ThemedText style={{ fontSize: 10 }}>{item.tempMin.toFixed(0)}°C</ThemedText>
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

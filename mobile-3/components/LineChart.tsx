import React from 'react';
import { Text, useWindowDimensions, View } from 'react-native';
import { LineChart as GiftedLineChart } from 'react-native-gifted-charts';
import { ruleTypes } from 'gifted-charts-core';

interface LineChartProps extends React.ComponentProps<typeof GiftedLineChart> {
  data: {
    value: number;
    date: string;
  }[];
  scale?: 'hour' | 'day' | 'week' | 'month' | 'year';
}

const LineChart = ({
  data,
  scale = 'day',
  ...props
} : LineChartProps) => {
  const { width } = useWindowDimensions();
  return (
    <GiftedLineChart
    areaChart
    data={data.map((item, index) => ({
      value: item.value,
      date: item.date,
      label: index % 4 === 0 ? (
        scale === 'hour'
          ? `${new Date(item.date).toLocaleTimeString([], { hour: '2-digit' })} h`
          : scale === 'day'
          ? new Date(item.date).toLocaleDateString([], { month: 'short', day: 'numeric' })
          : scale === 'week'
          ? new Date(item.date).toLocaleDateString([], { weekday: 'short' })
          : scale === 'month'
          ? new Date(item.date).toLocaleDateString([], { month: 'short', day: 'numeric' })
          : new Date(item.date).toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' })
      ) : undefined,
    }))}
    rotateLabel
    adjustToWidth
    color="#ffb300"
    thickness={2}
    startFillColor="rgba(105, 75, 20, 0.3)"
    endFillColor="rgba(85, 67, 20, 0.01)"
    startOpacity={0.9}
    endOpacity={0.2}
    initialSpacing={0}
    endSpacing={0}
    noOfSections={6}
    stepHeight={40}
    maxValue={data.reduce((max, item) => Math.max(max, item.value), 0) + 2}
    rulesType={ruleTypes.SOLID}
    rulesColor="gray"
    yAxisColor="white"
    yAxisThickness={0}
    yAxisTextStyle={{color: 'gray', fontSize: 10 }}
    yAxisLabelSuffix="°C"
    yAxisTextNumberOfLines={2}
    xAxisLabelTextStyle={{
      color: 'gray',
      width: 80,
      marginLeft: -36
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
      // activatePointersOnLongPress: true,
      autoAdjustPointerLabelPosition: false,
      pointerLabelComponent: (item: { date: string, value: number }[]) => {
        const date = new Date(item[0].date);
        const formattedDate = scale === 'hour'
          ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : scale === 'day'
          ? date.toLocaleDateString([], { month: 'short', day: 'numeric' })
          : scale === 'week'
          ? date.toLocaleDateString([], { weekday: 'short' })
          : scale === 'month'
          ? date.toLocaleDateString([], { month: 'short', day: 'numeric' })
          : date.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
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
    {...props}
    />
  );
};

export default LineChart;

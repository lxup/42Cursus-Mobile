import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/context/AuthProvider";
import { useTheme } from "@/context/ThemeProvider";
import { useThemeColor } from "@/hooks/useThemeColor";
import tw from "@/lib/tw";
import { LegendList } from "@legendapp/list";
import { useCallback, useMemo, useState } from "react";
import {Calendar, CalendarUtils} from 'react-native-calendars';

const AgendaScreen = () => {
  const { user } = useAuth();
  const { inset } = useTheme();
  const INITIAL_DATE = CalendarUtils.getCalendarDateString(new Date());
  // Colors
  const backgroundColor = useThemeColor({}, 'background');
  const foregroundColor = useThemeColor({}, 'text');
  const accentColor = useThemeColor({}, 'accent');
  // States
  const [selected, setSelected] = useState(INITIAL_DATE);

  const getDate = useCallback((count: number) => {
    const date = new Date(INITIAL_DATE);
    const newDate = date.setDate(date.getDate() + count);
    return CalendarUtils.getCalendarDateString(newDate);
  }, [INITIAL_DATE]);
  const marked = useMemo(() => {
    return {
      [getDate(-1)]: {
        dotColor: 'red',
        marked: true
      },
      [selected]: {
        selected: true,
        disableTouchEvent: true,
        selectedColor: accentColor,
        selectedTextColor: foregroundColor,
      }
    };
  }, [selected, accentColor, foregroundColor, getDate]);
  // Handlers
  const handleDayPress = (day: { dateString: string }) => {
    setSelected(day.dateString);
  };
  return (
  <LegendList
    data={[]}
    renderItem={({ item }) => (
      <ThemedText>ok</ThemedText>
    )}
    ListHeaderComponent={() => (
      <Calendar
      testID={'agenda'}
      enableSwipeMonths
      onDayPress={handleDayPress}
      markedDates={marked}
      theme={{
        backgroundColor: 'transparent',
        calendarBackground: 'transparent',
        textSectionTitleColor: foregroundColor,
        selectedDayBackgroundColor: accentColor,
        selectedDayTextColor: foregroundColor,
        todayTextColor: accentColor,
        dayTextColor: foregroundColor,
        textDisabledColor: 'gray',
        monthTextColor: foregroundColor,
        indicatorColor: accentColor,
        arrowColor: accentColor,
      }}
      />
    )}
    style={[
      tw`flex-1 gap-2`,
      {
        paddingTop: inset.top,
        paddingBottom: inset.bottom,
        paddingLeft: inset.left,
        paddingRight: inset.right,
        backgroundColor: backgroundColor
      }
    ]}
  />
  );
};

export default AgendaScreen;
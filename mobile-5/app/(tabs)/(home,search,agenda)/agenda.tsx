import { ThemedText } from "@/components/ThemedText";
import { useAuth } from "@/context/AuthProvider";
import { useTheme } from "@/context/ThemeProvider";
import { useDiaryNotesDeleteMutation } from "@/features/user/userMutations";
import { useDiaryNotesInfiniteQuery } from "@/features/user/userQueries";
import getFeelingIcon from "@/hooks/getFeelingIcon";
import { useThemeColor } from "@/hooks/useThemeColor";
import tw from "@/lib/tw";
import { DiaryNote } from "@/types/type.db";
import { LegendList } from "@legendapp/list";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, Text, TouchableWithoutFeedback, View } from "react-native";
import {Calendar, CalendarUtils, DateData} from 'react-native-calendars';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, { SharedValue, useAnimatedStyle } from "react-native-reanimated";
import * as Burnt from 'burnt';
import { IconSymbol } from "@/components/ui/IconSymbol";

const RightAction = (prog: SharedValue<number>, drag: SharedValue<number>, item: DiaryNote) => {
  // Colors
  const accentColor = useThemeColor({}, 'accent');
  const foregroundColor = useThemeColor({}, 'text');
  // Mutations
  const deleteDiaryNote = useDiaryNotesDeleteMutation({
    userId: item.user_id,
  });
  // Styles
  const styleAnimation = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: drag.value + 50 }],
    };
  });
  // Handlers
  const handleDelete = async () => {
    try {
      await deleteDiaryNote.mutateAsync({
        id: item.id,
      });
      Burnt.toast({
        title: 'Deleted',
        preset: 'done',
      });
    } catch {
      Burnt.toast({
        title: 'Error',
        preset: 'error',
      });
    }
  };

  return (
    <Reanimated.View style={[tw`p-1`, styleAnimation]}>
      <TouchableWithoutFeedback onPress={handleDelete}>
        <View style={[tw`flex-1 items-center justify-center rounded-md`, { width: 50, backgroundColor: accentColor }]}>
          <IconSymbol name="trash" color={foregroundColor}/>
        </View>
      </TouchableWithoutFeedback>
    </Reanimated.View>
  );
};

const AgendaScreen = () => {
  const { user } = useAuth();
  const { inset } = useTheme();
  const router = useRouter();
  const INITIAL_DATE = CalendarUtils.getCalendarDateString(new Date());
  // Colors
  const mutedColor = useThemeColor({}, 'muted');
  const mutedForegroundColor = useThemeColor({}, 'mutedForeground');
  const backgroundColor = useThemeColor({}, 'background');
  const foregroundColor = useThemeColor({}, 'text');
  const accentColor = useThemeColor({}, 'accent');
  // States
  const [selected, setSelected] = useState(INITIAL_DATE);
  // Agenda
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
  const handleDayPress = (day: DateData) => {
    setSelected(day.dateString);
  };
  // Queries
  const {
    data,
    isLoading,
    isError,
    isRefetching,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useDiaryNotesInfiniteQuery({
    userId: user?.id,
    filters: {
      dateFrom: `${selected}T00:00:00`,
      dateTo: `${selected}T23:59:59.999`,
    },
  });
  return (
  <LegendList
    data={data?.pages.flat() || []}
    renderItem={({
      item,
      index
    } : {
      item: DiaryNote,
      index: number
    }) => {
      const feelingIcon = getFeelingIcon(item.feeling);
      return (
      <ReanimatedSwipeable
      key={index}
      containerStyle={tw`px-2 py-1`}
      friction={2}
      enableTrackpadTwoFingerGesture
      rightThreshold={40}
      renderRightActions={(prog, drag) => RightAction(prog, drag, item)}
    >
        <TouchableWithoutFeedback onPress={() => router.push({ pathname: `/note/[id]`, params: item })}>
          <View style={[tw`flex-row items-center gap-2 rounded-md p-2`, { backgroundColor: mutedColor }]}>
            <ThemedText style={tw`text-lg`}>{feelingIcon}</ThemedText>
            <View style={tw`flex-1`}>
              <ThemedText numberOfLines={1} style={tw`text-lg font-bold`}>{item.title}</ThemedText>
              <ThemedText numberOfLines={1} style={[tw`shrink text-sm`, { color: mutedForegroundColor }]}>
                {`${new Date(item.date).toLocaleDateString()} ${item.description ? item.description : ''}`}
              </ThemedText>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </ReanimatedSwipeable>
      )
    }}
    ListHeaderComponent={() => (
      <Calendar
      testID={'agenda'}
      current={selected}
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
    ListEmptyComponent={() => (
      isLoading ? (
        <ActivityIndicator />
      ) : isError ? (
        <Text style={[tw`text-center text-red-500`]}>Error loading notes</Text>
      ) : (
        <ThemedText style={[tw`text-center`, { color: mutedForegroundColor }]}>No notes available</ThemedText>
      )
    )}
    keyExtractor={(item: DiaryNote) => item.id.toString()}
    estimatedItemSize={data?.pages.flatMap((page) => page).length}
    refreshing={isRefetching}
    onEndReached={() => hasNextPage && fetchNextPage()}
    onEndReachedThreshold={0.3}
    onRefresh={refetch}
    style={[
      tw`flex-1`,
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
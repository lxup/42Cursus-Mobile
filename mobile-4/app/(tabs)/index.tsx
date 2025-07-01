import BottomSheetNewNote from "@/components/BottomSheets/sheets/BottomSheetNewNote";
import Header from "@/components/Header";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useBottomTabOverflow } from "@/components/ui/TabBarBackground";
import { useAuth } from "@/context/AuthProvider";
import { useTheme } from "@/context/ThemeProvider";
import { useDiaryNotesInfiniteQuery } from "@/features/user/userQueries";
import tw from "@/lib/tw";
import useBottomSheetStore from "@/stores/useBottomSheetStore";
import { Button } from "@react-navigation/elements";
import { ActivityIndicator, Text, TouchableWithoutFeedback, View } from "react-native";
import Reanimated, { SharedValue, useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import { LegendList } from "@legendapp/list"
import { useThemeColor } from "@/hooks/useThemeColor";
import { DiaryNote } from "@/types/type.db";
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { IconSymbol } from "@/components/ui/IconSymbol";
import * as Burnt from 'burnt';
import { useDiaryNotesDeleteMutation } from "@/features/user/userMutations";
import { useRouter } from "expo-router";
import getFeelingIcon from "@/hooks/getFeelingIcon";

const AddNoteButton = ({ addNoteButtonHeight, tabBarHeight } : { addNoteButtonHeight: SharedValue<number>, tabBarHeight: number }) => {
  const { openSheet } = useBottomSheetStore();
  return (
    <View
      style={[
        tw`absolute left-0 right-0 items-center justify-center`,
        { bottom: tabBarHeight + 12 }
      ]}
      onLayout={(e) => {
        addNoteButtonHeight.value = e.nativeEvent.layout.height;
      }}
    >
      <Button onPressIn={() => openSheet(BottomSheetNewNote)} style={tw`pointer-events-auto`}>
        Add
      </Button>
    </View>
  );
};

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

const CurrentlyScreen = () => {
  const { user } = useAuth();
  const tabBarHeight = useBottomTabOverflow();
  const { inset } = useTheme();
  const router = useRouter();
  // Colors
  const mutedColor = useThemeColor({}, 'muted');
  const mutedForegroundColor = useThemeColor({}, 'mutedForeground');
  // SharedValues for animations
  const addNoteButtonHeight = useSharedValue(0);
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
  });

  return (
  <ThemedView style={tw`flex-1 gap-2`}>
    <Header style={[tw`mx-2`, { paddingTop: inset.top, paddingLeft: inset.left, paddingRight: inset.right }]} />
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
      containerStyle={tw` px-2 py-1`}
      friction={2}
      enableTrackpadTwoFingerGesture
      rightThreshold={40}
      renderRightActions={(prog, drag) => RightAction(prog, drag, item)}
    >
        <TouchableWithoutFeedback onPress={() => router.push({ pathname: `/note/[id]`, params: item })}>
          <View style={[tw`flex-row items-center gap-2 rounded-md p-2`, { backgroundColor: mutedColor }]}>
            <IconSymbol name={feelingIcon?.icon!} color={feelingIcon?.color!} size={24} style={tw`self-center`} />
            <View>
              <ThemedText style={tw`text-lg font-bold`}>{item.title}</ThemedText>
              <ThemedText style={[tw`text-sm`, { color: mutedForegroundColor }]}>
                {`${new Date(item.date).toLocaleDateString()} ${item.description ? item.description : ''}`}
              </ThemedText>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </ReanimatedSwipeable>
      )
    }}
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
    // ItemSeparatorComponent={() => <View style={[tw`mx-2 rounded-full`, { height: 0.5, backgroundColor: mutedColor }]} />}
    contentContainerStyle={[{ paddingBottom: tabBarHeight + addNoteButtonHeight.get() + 12 }]}
    />
    <AddNoteButton  addNoteButtonHeight={addNoteButtonHeight} tabBarHeight={tabBarHeight} />
  </ThemedView>
  );
};

export default CurrentlyScreen;
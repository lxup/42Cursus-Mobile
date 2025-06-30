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
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { SharedValue, useSharedValue } from "react-native-reanimated";
import { LegendList } from "@legendapp/list"
import { useThemeColor } from "@/hooks/useThemeColor";
// import { FlashList } from "@shopify/flash-list";

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

type Item = {
  created_at: string;
  date: string;
  description: string;
  id: number;
  title: string;
  user_id: string;
}

export default function CurrentlyScreen() {
  const { user } = useAuth();
  const tabBarHeight = useBottomTabOverflow();
  const { inset } = useTheme();
  // Colors
  const foregroundColor = useThemeColor({}, 'text');
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
  <ThemedView style={tw`flex-1`}>
    <Header style={[tw`mx-2`, { paddingTop: inset.top, paddingLeft: inset.left, paddingRight: inset.right }]} />
    <LegendList
    data={data?.pages.flat() || []}
    renderItem={({
      item,
      index
    } : {
      item: Item,
      index: number
    }) => (
      <View key={index}>
        <ThemedText>{item.title}</ThemedText>
      </View>
    )}
    ListEmptyComponent={() => (
      isLoading ? (
        <ActivityIndicator />
      ) : isError ? (
        <Text style={tw`text-red-500`}>Error loading notes</Text>
      ) : (
        <ThemedText style={{ color: mutedForegroundColor }}>No notes available</ThemedText>
      )
    )}
    numColumns={2}
    keyExtractor={(item: Item) => item.id.toString()}
    estimatedItemSize={data?.pages.flatMap((page) => page).length}
    refreshing={isRefetching}
    onEndReached={() => hasNextPage && fetchNextPage()}
    onEndReachedThreshold={0.3}
    onRefresh={refetch}
    recycleItems={true}
    contentContainerStyle={tw`p-2 justify-center items-center`}
    />
    <AddNoteButton  addNoteButtonHeight={addNoteButtonHeight} tabBarHeight={tabBarHeight} />
  </ThemedView>
  );
}

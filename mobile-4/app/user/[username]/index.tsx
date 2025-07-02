import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import UserAvatar from "@/components/ui/UserAvatar";
import { useTheme } from "@/context/ThemeProvider";
import { useDiaryNotesInfiniteQuery, useUserQueryByUsername } from "@/features/user/userQueries";
import getFeelingIcon from "@/hooks/getFeelingIcon";
import { useThemeColor } from "@/hooks/useThemeColor";
import tw from "@/lib/tw";
import { DiaryNote } from "@/types/type.db";
import { LegendList } from "@legendapp/list";
import { router, useLocalSearchParams, useRouter } from "expo-router";
import { ActivityIndicator, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";

interface DiaryNotesListProps extends React.PropsWithChildren<{ userId: string }> {}

const DiaryNotesList = ({ userId, children } : DiaryNotesListProps) => {
  const router = useRouter();
  const { inset } = useTheme();
  // Colors
  const mutedColor = useThemeColor({}, 'muted');
  const mutedForegroundColor = useThemeColor({}, 'mutedForeground');
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
    userId: userId,
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
    <View key={index} style={tw`px-2 py-1`}>
      <TouchableWithoutFeedback onPress={() => router.push({ pathname: `/note/[id]`, params: item })}>
        <View style={[tw`flex-row items-center gap-2 rounded-md p-2`, { backgroundColor: mutedColor }]}>
          <ThemedText style={tw`text-lg`}>{feelingIcon}</ThemedText>
          <View>
            <ThemedText style={tw`text-lg font-bold`}>{item.title}</ThemedText>
            <ThemedText style={[tw`text-sm`, { color: mutedForegroundColor }]}>
              {`${new Date(item.date).toLocaleDateString()} ${item.description ? item.description : ''}`}
            </ThemedText>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
    )
  }}
  ListHeaderComponent={() => (children)}
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
  contentContainerStyle={{ paddingBottom: inset.bottom, paddingLeft: inset.left, paddingRight: inset.right }}
  />
  )
};

const UserScreen = () => {
  const { orientation } = useTheme();
  const userParams = useLocalSearchParams<any>();
  // Colors
  const backgroundColor = useThemeColor({}, 'background');
  const mutedForegroundColor = useThemeColor({}, 'mutedForeground');
  const {
    data: user,
    isLoading,
    isError,
  } = useUserQueryByUsername({
    username: userParams.username,
    initialData: {
      id: userParams.id,
      username: userParams.username,
      full_name: userParams.full_name,
      avatar_url: userParams.avatar_url,
      updated_at: userParams.updated_at,
    }
  });
  const isPresented = router.canGoBack();

  if (isLoading || user === undefined) {
		return (
			<ThemedView style={tw`flex-1 items-center justify-center`}>
				<ActivityIndicator />
			</ThemedView>
		)
	}
	if (isError) {
		return (
			<ThemedView style={tw`flex-1 items-center justify-center`}>
				<Text style={tw`text-red-500`}>Error loading user</Text>
			</ThemedView>
		)
	}
	if (!user) {
		return (
			<ThemedView style={tw`flex-1 items-center justify-center`}>
				<Text style={[tw``, { color: mutedForegroundColor }]}>User not found</Text>
			</ThemedView>
		)
	}

  return (
    <ThemedView style={tw`flex-1`}>
      <View style={tw`relative items-center justify-center p-4 gap-2`}>
        <UserAvatar avatar_url={user.avatar_url} full_name={user.full_name} style={tw`w-24 h-24`}/>
        <View style={tw`items-center`}>
          <ThemedText style={tw`text-lg font-bold`}>
            {user.full_name || user.username}
          </ThemedText>
          <ThemedText style={[tw`text-sm`, { color: mutedForegroundColor }]}>
            @{user.username}
          </ThemedText>
        </View>
        {isPresented && orientation === 'landscape' && (
          <TouchableOpacity
          onPress={() => router.back()}
          style={[
            tw`absolute top-4 right-4 p-2 rounded-full`,
            { backgroundColor: backgroundColor }
          ]}>
            <IconSymbol
            name="xmark"
            color={mutedForegroundColor}
            size={20}
            />
          </TouchableOpacity>
        )}
      </View>
      <DiaryNotesList userId={user.id} />
    </ThemedView>
  );
};

export default UserScreen;

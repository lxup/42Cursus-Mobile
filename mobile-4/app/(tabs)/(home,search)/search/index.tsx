import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import UserAvatar from "@/components/ui/UserAvatar";
import { useTheme } from "@/context/ThemeProvider";
import { useSearchUsersInfiniteQuery } from "@/features/user/userQueries";
import useDebounce from "@/hooks/useDebounce";
import { useThemeColor } from "@/hooks/useThemeColor";
import tw from "@/lib/tw";
import { LegendList } from "@legendapp/list";
import { Link, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, TextInput, TouchableOpacity, View } from "react-native";

const Search = () => {
	const router = useRouter();
	// Colors
	const foregroundColor = useThemeColor({}, 'text');
	const mutedColor = useThemeColor({}, 'muted');
	const mutedForegroundColor = useThemeColor({}, 'mutedForeground');
	const { inset } = useTheme();
	const [search, setSearch] = useState<string>("");
	const debouncedSearch = useDebounce(search, 500);
	const {
		data: users,
		isLoading,
		isError,
		fetchNextPage,
		hasNextPage,
		isRefetching,
		refetch
	} = useSearchUsersInfiniteQuery({
		query: debouncedSearch,
	});
  return (
    <ThemedView
		style={[
			{ paddingTop: inset.top },
			tw`flex-1 gap-4 px-2`
		]}
		>
			<View
			style={[
				{ backgroundColor: mutedColor },
				tw`flex-row items-center gap-2 rounded-md px-2 py-1`,
			]}
			>
				<IconSymbol name="magnifyingglass" color={foregroundColor} size={20} />
				<TextInput
				placeholder="Search users..."
				placeholderTextColor={mutedForegroundColor}
				style={[
					{ color: foregroundColor },
					tw`flex-1 py-2 pr-2`,
				]}
				textAlignVertical="center"
				value={search}
				onChangeText={setSearch}
				/>
        		{search && (<TouchableOpacity onPress={() => setSearch("")}>
					<IconSymbol size={15} name="xmark" color={foregroundColor} style={{ opacity: 0.8 }} />
				</TouchableOpacity>)}
			</View>
			<LegendList
			data={users?.pages.flat() || []}
			renderItem={({ item }) => (
				<TouchableOpacity
				onPress={() => {
					router.push({
						pathname: `/user/[username]`,
						params: {
							...item,
							username: item.username!
						}
					});
				}}
				style={[tw`w-full`]}
				>
					<View
					style={[
						tw`w-full flex-row items-center gap-2 rounded-md p-2`,
						{ backgroundColor: mutedColor },
					]}
					>
						<UserAvatar avatar_url={item.avatar_url} full_name={item.full_name} />
						<View>
							<ThemedText style={tw`text-lg font-bold`}>{item.full_name}</ThemedText>
							<ThemedText style={[tw`text-sm`, { color: mutedForegroundColor }]}>
								@{item.username}
							</ThemedText>
						</View>
					</View>
				</TouchableOpacity>
			)}
			ListEmptyComponent={() => (
				isLoading ? (
					<ActivityIndicator />
				) : isError ? (
					<ThemedText style={tw`text-center text-red-500`}>Error loading users</ThemedText>
				) : debouncedSearch.length === 0 ? (
					<ThemedText style={[tw`text-center`, { color: mutedForegroundColor }]}>Search for users by username</ThemedText>
				) : (
					<ThemedText style={[tw`text-center`, { color: mutedForegroundColor }]}>No users found</ThemedText>
				)
			)}
			keyExtractor={(item) => item.id.toString()}
			estimatedItemSize={50}
			refreshing={isRefetching}
			onEndReached={() => hasNextPage && fetchNextPage()}
			onEndReachedThreshold={0.3}
			onRefresh={refetch}
			contentContainerStyle={[{ paddingBottom: inset.bottom }]}
			/>
		</ThemedView>
  );
};

export default Search;
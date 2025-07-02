import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import UserAvatar from "@/components/ui/UserAvatar";
import { useUserQueryByUsername } from "@/features/user/userQueries";
import { useThemeColor } from "@/hooks/useThemeColor";
import tw from "@/lib/tw";
import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Text, View } from "react-native";

const UserScreen = () => {
  // const username = useLocalSearchParams().username;
  const userParams = useLocalSearchParams<any>();
  // Colors
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
      <View style={tw`items-center justify-center gap-2 p-4`}>
        <UserAvatar avatar_url={user.avatar_url} full_name={user.full_name} style={tw`w-24 h-24`}/>
        <View>
          <ThemedText style={tw`text-lg font-bold`}>
            {user.full_name || user.username}
          </ThemedText>
          <ThemedText style={[tw`text-sm`, { color: mutedForegroundColor }]}>
            @{user.username}
          </ThemedText>
        </View>
      </View>
      <View>

      </View>
    </ThemedView>
  );
};

export default UserScreen;

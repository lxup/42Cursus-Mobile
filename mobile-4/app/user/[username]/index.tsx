import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import tw from "@/lib/tw";
import { useLocalSearchParams } from "expo-router";

const UserScreen = () => {
  const username = useLocalSearchParams().username;

  return (
    <ThemedView style={tw`flex-1`}>
      <ThemedText>User: {username}</ThemedText>
    </ThemedView>
  );
};

export default UserScreen;

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import tw from "@/lib/tw";
import { View } from "react-native";


export default function CurrentlyScreen() {
  return (
  <ThemedView style={tw`flex-1`}>
    <ThemedText>Page 1</ThemedText>
  </ThemedView>
  );
}

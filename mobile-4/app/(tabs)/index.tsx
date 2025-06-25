import Header from "@/components/Header";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/context/ThemeProvider";
import tw from "@/lib/tw";

export default function CurrentlyScreen() {
  const { inset } = useTheme();
  return (
  <ThemedView style={[tw`flex-1`, { paddingTop: inset.top, paddingBottom: inset.bottom, paddingLeft: inset.left, paddingRight: inset.right }]}>
    <Header style={tw`px-2`} />
    <ThemedText>Page 1</ThemedText>
  </ThemedView>
  );
}

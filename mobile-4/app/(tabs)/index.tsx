import BottomSheetNewNote from "@/components/BottomSheets/sheets/BottomSheetNewNote";
import Header from "@/components/Header";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useBottomTabOverflow } from "@/components/ui/TabBarBackground";
import { useTheme } from "@/context/ThemeProvider";
import tw from "@/lib/tw";
import useBottomSheetStore from "@/stores/useBottomSheetStore";
import { Button } from "@react-navigation/elements";
import { ScrollView, View } from "react-native";
import { SharedValue, useSharedValue } from "react-native-reanimated";

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

export default function CurrentlyScreen() {
  const tabBarHeight = useBottomTabOverflow();
  const { inset } = useTheme();
  // SharedValues for animations
  const addNoteButtonHeight = useSharedValue(0);
  return (
  <ThemedView style={tw`flex-1`}>
    <Header style={[tw`px-2`, { paddingTop: inset.top, paddingLeft: inset.left, paddingRight: inset.right }]} />
    <ScrollView style={{ paddingBottom: tabBarHeight }}>
      <ThemedText>Page 1</ThemedText>
    </ScrollView>
    <AddNoteButton  addNoteButtonHeight={addNoteButtonHeight} tabBarHeight={tabBarHeight} />
  </ThemedView>
  );
}

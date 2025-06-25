import BottomSheetSignIn from "@/components/BottomSheets/sheets/BottomSheetSignIn";
import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useThemeColor } from "@/hooks/useThemeColor";
import tw from "@/lib/tw";
import useBottomSheetStore from "@/stores/useBottomSheetStore";
import { Button } from "@react-navigation/elements";
import { SFSymbol } from "expo-symbols";
import { useMemo } from "react";
import { ImageBackground, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Feature = {
	icon: SFSymbol;
	description: string;
}

const Welcome = () => {
	const { openSheet } = useBottomSheetStore();
	const accentColor = useThemeColor({}, 'accent');
	const features: Feature[] = useMemo(() => [
		{
			icon: "book",
			description: "Write about your day, your thoughts, and your feelings.",
		}
	], []);
	return (
	<ImageBackground
	source={require("@/assets/images/background/sunny.jpg")}
	style={{
		flex: 1,
	}}
	imageStyle={{
		opacity: 0.2,
	}}
	>
		<SafeAreaView style={tw`flex-1 items-center justify-end gap-8 px-4`}>
			<ThemedText type="title">Welcome to Journal</ThemedText>
			<View style={tw`gap-2 w-full`}>
				{features.map((feature, index) => (
					<View key={index} style={tw`flex-row items-center gap-2`}>
						<IconSymbol name={feature.icon} size={24} color={accentColor} />
						<ThemedText style={tw`shrink`}>{feature.description}</ThemedText>
					</View>
				))}
			</View>
			<Button style={tw`w-full`} onPressIn={() => openSheet(BottomSheetSignIn)}>
				Continue
			</Button>
		</SafeAreaView>
	</ImageBackground>
	);
};

export default Welcome;
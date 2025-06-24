import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useThemeColor } from "@/hooks/useThemeColor";
import tw from "@/lib/tw";
import { Button } from "@react-navigation/elements";
import { Link } from "expo-router";
import { SFSymbol } from "expo-symbols";
import { useMemo } from "react";
import { ImageBackground, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Feature = {
	icon: SFSymbol;
	description: string;
}

const Welcome = () => {
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
		<SafeAreaView style={tw`flex-1 items-center justify-end gap-2 px-4`}>
			<ThemedText type="title">Welcome to Journal</ThemedText>
			<View style={tw`gap-2 w-full`}>
				{features.map((feature, index) => (
					<View key={index} style={tw`flex-row items-center gap-2`}>
						<IconSymbol name={feature.icon} size={24} color={accentColor} />
						<ThemedText style={tw`shrink`}>{feature.description}</ThemedText>
					</View>
				))}
			</View>
			<Link href={"/signin"} asChild>
				<Button style={tw`w-full`}>
					Continue
				</Button>
			</Link>
		</SafeAreaView>
	</ImageBackground>
	);
};

export default Welcome;
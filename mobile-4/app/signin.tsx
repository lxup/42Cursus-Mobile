import { ThemedText } from "@/components/ThemedText";
import tw from "@/lib/tw";
import { useMemo } from "react";
import { View } from "react-native";
import { Image } from "expo-image";

type Provider = {
	name: string;
	path: string;
	// icon: NodeJS.Require;
}

const SignInModal = () => {
	const providers: Provider[] = useMemo(() => [
		{
			name: "Google",
			path: "@/assets/images/providers/google.png",
		},
	], []);
	return (
		<View style={tw`flex-1 items-center justify-center`}>
			<ThemedText>Sign-In</ThemedText>
			{providers.map((provider, index) => (
				<View key={index} style={tw`flex-row items-center gap-2`}>
					<Image source={provider.path} contentFit="cover" />
					<ThemedText>{provider.name}</ThemedText>
				</View>
			))}
		</View>
	)
};

export default SignInModal;
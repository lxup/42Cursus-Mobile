import { ThemedText } from "@/components/ThemedText";
import tw from "@/lib/tw";
import { useMemo } from "react";
import { TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import { useThemeColor } from "@/hooks/useThemeColor";

type Provider = {
	name: string;
	path: string;
	// icon: NodeJS.Require;
}

const SignInModal = () => {
	const mutedColor = useThemeColor({}, 'muted');
	const providers: Provider[] = useMemo(() => [
		{
			name: "Google",
			path: "@/assets/images/providers/google.png",
		},
		{
			name: "GitHub",
			path: "@/assets/images/providers/github.png",
		}
	], []);
	return (
		<View style={tw`flex-1 items-center justify-center gap-2`}>
			<ThemedText>Connect with</ThemedText>
			{providers.map((provider, index) => (
				<TouchableOpacity key={index} style={[tw`flex-row items-center justify-center border-2 overflow-hidden rounded-full w-full px-4 py-1 gap-2`, { borderColor: mutedColor }]}>
					<Image source={provider.path} style={tw`h-8 w-8`} contentFit="cover" />
					<ThemedText>{provider.name}</ThemedText>
				</TouchableOpacity>
			))}
		</View>
	)
};

export default SignInModal;
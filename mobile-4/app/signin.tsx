import { ThemedText } from "@/components/ThemedText";
import tw from "@/lib/tw";
import { View } from "react-native";

const SignIn = () => {
	return (
		<View style={tw`flex-1 items-center justify-center`}>
			<ThemedText>Sign In</ThemedText>
		</View>
	);
};

export default SignIn;
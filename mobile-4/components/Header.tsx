import { useAuth } from "@/context/AuthProvider";
import tw from "@/lib/tw";
import { TouchableOpacity, View } from "react-native";
import UserAvatar from "./ui/UserAvatar";
import useBottomSheetStore from "@/stores/useBottomSheetStore";
import { ThemedText } from "./ThemedText";
import BottomSheetUserNav from "./BottomSheets/sheets/BottomSheetUserNav";

interface HeaderProps extends React.ComponentPropsWithoutRef<typeof View> {

}

const Header = ({ style, ...props }: HeaderProps) => {
	const { user } = useAuth();
	const { openSheet } = useBottomSheetStore();
	return (
	<View style={[tw`flex-row items-center justify-between`, style]} {...props}>
		<ThemedText style={tw`text-lg font-bold`} numberOfLines={1}>Welcome {user?.full_name}</ThemedText>
		<TouchableOpacity onPress={() => openSheet(BottomSheetUserNav)}>
			<UserAvatar avatar_url={user?.avatar_url} full_name={user?.full_name} />
		</TouchableOpacity>
	</View>
	);
};

export default Header;
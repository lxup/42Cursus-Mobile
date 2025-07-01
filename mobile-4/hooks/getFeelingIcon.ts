import { Feeling } from "@/types/type.db";
import { SFSymbol } from "expo-symbols";
import { OpaqueColorValue } from "react-native";

type FeelingIcon = {
	icon: SFSymbol;
	color: string | OpaqueColorValue;
}

const getFeelingIcon = (feeling: Feeling): FeelingIcon => {
	switch (feeling) {
		case 'happy':
			return {
				icon: 'smiley',
				color: 'yellow',
			}
		default: // 'neutral'
			return {
				icon: 'questionmark',
				color: 'gray',
			}
	}
};

export default getFeelingIcon;
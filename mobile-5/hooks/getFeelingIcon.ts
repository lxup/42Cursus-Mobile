import { Feeling } from "@/types/type.db";

const getFeelingIcon = (feeling: Feeling): string => {
	switch (feeling) {
		case 'happy':
			return '😀';
		case 'angry':
			return '😡';
		case 'sad':
			return '😢';
		case 'tired':
			return '😴';
		case 'excited':
			return '🤗';
		default: // 'neutral'
			return '😐';
	}
};

export default getFeelingIcon;
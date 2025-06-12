import { useEffect, useState } from "react";
import { Dimensions } from "react-native";

const useOrientation = () => {
	const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
	useEffect(() => {
		const updateOrientation = () => {
			const { width, height } = Dimensions.get('window');
			setOrientation(width > height ? 'landscape' : 'portrait');
		};

		const subscription = Dimensions.addEventListener('change', updateOrientation);
		updateOrientation(); // Initial check

		return () => {
			subscription?.remove();
		};
	}
	, []);
	return orientation;
}

export default useOrientation;
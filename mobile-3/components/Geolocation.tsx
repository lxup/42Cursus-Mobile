import { Alert, TouchableOpacity } from "react-native"
import { IconSymbol } from "./ui/IconSymbol"
import { useThemeColor } from "@/hooks/useThemeColor";
import * as Location from 'expo-location';
import { useCallback, useEffect, useState } from "react";

interface GeolocationProps {
	onGeolocation?: (location: Location.LocationObject) => void;
}

const Geolocation = ({ onGeolocation }: GeolocationProps) => {
	const textColor = useThemeColor({}, "text");

	// States
	const [locationStatus, setLocationStatus] = useState<Location.PermissionStatus | null>(null);

	// Handlers
	const handleRequestLocationPermission = useCallback(async () => {
		let { status } = await Location.requestForegroundPermissionsAsync();
		setLocationStatus(status);
		return status;
	}, []);
	const handleGeolocation = async () => {
		let status = locationStatus;
		if (!status || status === 'undetermined') {
			status = await handleRequestLocationPermission();
		}
		if (status !== 'granted') {
			Alert.alert('Permission to access location was denied', 'Please enable location permissions in your device settings to use geolocation features.');
			return;
		}
		let location = await Location.getCurrentPositionAsync({});
		if (!location) {
			Alert.alert('Unable to retrieve location', 'Please try again later or check your device settings.');
			return;
		}
		onGeolocation?.(location);
	};

	useEffect(() => {
		const getLocationPermission = async () => {
			let { status } = await Location.getForegroundPermissionsAsync();
			setLocationStatus(status);
		};
		getLocationPermission();
	}, []);
	
	return (
		<TouchableOpacity onPress={handleGeolocation}>
			<IconSymbol size={24} name="location.fill" color={textColor} />
			{(locationStatus && locationStatus !== 'granted' && locationStatus !== 'undetermined') && (
				<IconSymbol size={10} name="exclamationmark.triangle.fill" color="red" style={{position: 'absolute', right: -2, bottom: -2}}/>
			)}
		</TouchableOpacity>
	)
}

export default Geolocation;
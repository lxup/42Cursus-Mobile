import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeColor } from "@/hooks/useThemeColor";
import { IconSymbol } from "../ui/IconSymbol";
import { useState } from "react";
import { useLocation } from "@/context/LocationProvider";
import Geolocation from "../Geolocation";
import * as Location from "expo-location";
import useOrientation from "@/hooks/useOrientation";

const PADDING = 8;

const TopBar = () => {
	const orientation = useOrientation();
	const { updateActiveLocation } = useLocation();
	const insets = useSafeAreaInsets();
	// Colors
	const textColor = useThemeColor({}, "text");
	const backgroundColor = useThemeColor({}, "background");
	const mutedColor = useThemeColor({}, "muted");
	// States
	const [search, setSearch] = useState("");
	// Handlers
	const handleSearch = () => {
		if (search.trim() === "") return;
		updateActiveLocation({
			id: `search-${Date.now()}`,
			name: search,
			source: 'search',
		});
		setSearch("");
	};
	const handleGeolocation = (location: Location.LocationObject) => {
		updateActiveLocation({
			id: `geolocation-${Date.now()}`,
			name: 'Geolocation',
			source: 'geolocation',
			data: location,
		});
	};
	return (
	<SafeAreaView
	edges={['top', 'left', 'right']}
	style={{
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		gap: 8,
		backgroundColor: backgroundColor,
		paddingTop: orientation === 'landscape' ? PADDING : undefined,
		paddingLeft: orientation === 'portrait' ? PADDING : undefined,
		paddingRight: orientation === 'portrait' ? PADDING : undefined,
		paddingBottom: PADDING,
	}}
	>
		{/* SEARCHBAR */}
		<View
		style={[{ backgroundColor: mutedColor }, styles.searchBar]}
		>
			<IconSymbol size={20} name="magnifyingglass" color={textColor} />
			<TextInput
			autoCapitalize="none"
			autoCorrect={false}
			autoComplete="off"
			placeholder="Search location, city, or address..."
			style={[
				styles.searchInput,
				{ color: textColor },
			]}
			textAlignVertical="center"
			value={search}
			onChangeText={setSearch}
			onSubmitEditing={handleSearch}
			/>
			{search && (<TouchableOpacity onPress={() => setSearch("")}>
				<IconSymbol size={15} name="xmark" color={textColor} style={{ opacity: 0.8 }} />
			</TouchableOpacity>)}
		</View>
		{/* GEOLOCATION */}
		<Geolocation onGeolocation={handleGeolocation} />
	</SafeAreaView>
	)
};

const styles = StyleSheet.create({
	searchBar: {
		flexDirection: 'row',
		alignItems: 'center',
		borderRadius: 8,
		gap: 4,
		paddingVertical: 4,
		paddingHorizontal: 8,
		flexShrink: 1,
	},
	searchInput: {
		flex: 1,
		paddingVertical: 8,
		paddingRight: 8,
	},
	results: {
		position: 'absolute',
		maxHeight: '50%',
		left: 0,
		right: 0,
		borderBottomLeftRadius: 8,
		borderBottomRightRadius: 8,
		paddingHorizontal: PADDING,
		zIndex: 10,
	}
});


export default TopBar;
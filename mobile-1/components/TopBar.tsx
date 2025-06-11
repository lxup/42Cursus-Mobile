import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeColor } from "@/hooks/useThemeColor";
import { IconSymbol } from "./ui/IconSymbol";
import { useState } from "react";
import { useLocation } from "@/context/LocationProvider";

const TopBar = () => {
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
	const handleGeolocation = () => {
		updateActiveLocation({
			id: `geolocation-${Date.now()}`,
			name: "Geolocation",
			source: 'geolocation',
		});
	};
	return (
		<View
		style={{
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'space-between',
			gap: 8,
			backgroundColor: backgroundColor,
			paddingTop: insets.top,
			paddingHorizontal: 16,
			paddingBottom: 8,
		}}
		>
			{/* SEARCHBAR */}
			<View
			style={[{ backgroundColor: mutedColor }, styles.searchBar]}
			>
				<IconSymbol size={20} name="magnifyingglass" color={textColor} />
				<TextInput
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
			<TouchableOpacity onPress={handleGeolocation}>
				<IconSymbol size={24} name="location.fill" color={textColor} />
			</TouchableOpacity>
		</View>
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
	}
});


export default TopBar;
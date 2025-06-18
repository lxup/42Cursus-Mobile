import { ActivityIndicator, Alert, StyleSheet, TextInput, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeColor } from "@/hooks/useThemeColor";
import { IconSymbol } from "../ui/IconSymbol";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "@/context/LocationProvider";
import Geolocation from "../Geolocation";
import * as Location from "expo-location";
import { useSearch } from "@/queries/open-meteo";
import { ThemedText } from "../ThemedText";
import useOrientation from "@/hooks/useOrientation";
import Animated, { useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import useDebounce from "@/hooks/useDebounce";
import tw from "@/lib/tw";
import { OpenMeteoSearchResult } from "@/types/OpenMeteo";

const PADDING = 8;

const TopBar = () => {
	const orientation = useOrientation();
	const { updateActiveLocation } = useLocation();
	const { height } = useWindowDimensions();
	// Colors
	const textColor = useThemeColor({}, "text");
	const backgroundColor = useThemeColor({}, "background");
	const mutedColor = useThemeColor({}, "muted");
	const mutedForegroundColor = useThemeColor({}, "mutedForeground");
	// States
	const [search, setSearch] = useState("");
	const debouncedSearch = useDebounce(search, 500);
	const [onSearch, setOnSearch] = useState(false);
	const [submitRequested, setSubmitRequested] = useState(false);
	const {
		data: results,
		isLoading: isLoadingResults,
		isError,
		refetch: refetchResults,
	} = useSearch({
		query: debouncedSearch,
	});
	// Refs
	const searchRef = useRef<TextInput>(null);
	// SharedValues
	const topbarHeight = useSharedValue(0);
	// Handlers
	const handleCloseSearch = useCallback(() => {
		setOnSearch(false);
		if (searchRef.current) {
			searchRef.current.blur();
		}
	}, [searchRef]);
	const handleResultPress = useCallback((item: OpenMeteoSearchResult) => {
		setSearch("");
		handleCloseSearch();
		updateActiveLocation({
			name: item.name,
			source: 'search',
			data: {
				address: {
					city: item.name,
					country: item.country,
					district: null,
					formattedAddress: `${item.name}, ${item.admin1}, ${item.country}`,
					isoCountryCode: item.country_code,
					name: item.name,
					postalCode: `${item.admin1_code}`,
					region: item.admin1,
					street: null,
					streetNumber: null,
					subregion: null,
					timezone: item.timezone,
				},
				latitude: item.latitude,
				longitude: item.longitude,
			}
		});
	}, [handleCloseSearch, updateActiveLocation]);
	const handleGeolocation = useCallback(async (location: Location.LocationObject) => {
		const reverseGeocodeAsync = async (coords: Location.LocationObjectCoords): Promise<Location.LocationGeocodedAddress | undefined> => {
			try {
				const geocode = await Location.reverseGeocodeAsync(coords);
				return geocode.at(0);
			} catch (error) {
				(void error);
				Alert.alert('Error', `Error reverse geocoding location`);
				return undefined;
			}
		};
		const address = await reverseGeocodeAsync(location.coords);
		updateActiveLocation({
			name: 'Geolocation',
			source: 'geolocation',
			data: {
				address: address,
				latitude: location.coords.latitude,
				longitude: location.coords.longitude,
			}
		});
	}, [updateActiveLocation]);
	// Styles
	const resultsContainerStyle = useAnimatedStyle(() => ({
		top: topbarHeight.get(),
		backgroundColor: backgroundColor,
		height:  height- topbarHeight.get(),
	}), [topbarHeight, backgroundColor, height]);

	useEffect(() => {
		if (submitRequested && !isLoadingResults && results !== undefined) {
			if (results && results.length > 0) {
				handleResultPress(results[0]);
			}
			setSubmitRequested(false);
		}
	}, [results, isLoadingResults, submitRequested, handleResultPress]);

	return (
	<>
		<SafeAreaView
		onLayout={(e) => {
			topbarHeight.value = e.nativeEvent.layout.height;
		}}
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
				ref={searchRef}
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
				onFocus={() => setOnSearch(true)}
				onSubmitEditing={(e) => {
					if (e.nativeEvent.text.trim() !== "") {
						setSubmitRequested(true)}
					}
				}
				/>
				{search && (
					<TouchableOpacity onPress={() => setSearch("")}>
						<IconSymbol size={15} name="xmark" color={textColor} style={{ opacity: 0.8 }} />
					</TouchableOpacity>
				)}
			</View>
			{onSearch ? (
				<TouchableOpacity onPress={handleCloseSearch}>
					<ThemedText>Cancel</ThemedText>
				</TouchableOpacity>
			) : (
				<Geolocation onGeolocation={handleGeolocation} />
			)}
		</SafeAreaView>
		{onSearch && (
			<Animated.FlatList
			style={[styles.results, resultsContainerStyle]}
			data={!submitRequested ? results : []}
			keyExtractor={(item) => item.id.toString()}
			renderItem={({ item }) => (
				<TouchableOpacity onPress={() => handleResultPress(item)}>
					<View style={[tw`flex-row items-center gap-2 p-2`]}>
						<ThemedText style={tw`font-bold`}>{item.name}</ThemedText>
						{item.admin1 && <ThemedText style={tw`text-sm text-gray-500`}>{item.admin1}</ThemedText>}
						{item.country && <ThemedText type="link">{item.country}</ThemedText>}
					</View>
				</TouchableOpacity>
			)}
			ListEmptyComponent={() => !submitRequested && (
				isLoadingResults ? (
					<ActivityIndicator style={[tw`p-2`]} />
				) : results?.length === 0 ? (
					<ThemedText style={[tw`text-center p-2`, { color: mutedForegroundColor }]} >No results found</ThemedText>
				) : isError ? (
					<View style={tw`flex flex-col items-center border border-red-500 rounded p-4 gap-2`}>
						<View style={tw`flex flex-col items-center`}>
							<ThemedText style={[{ color: mutedForegroundColor }]}>Error searching for locations</ThemedText>
							<ThemedText style={[tw`text-xs`, { color: mutedForegroundColor }]}>Please check your internet connection or try again later.</ThemedText>
						</View>
						<TouchableOpacity onPress={() => refetchResults()} style={tw`p-2 bg-red-500 rounded-full`}>
							<ThemedText>Retry</ThemedText>
						</TouchableOpacity>
					</View>
				) : (
					<ThemedText style={[tw`text-center p-2`, { color: mutedForegroundColor }]} >Search for a location...</ThemedText>
				)
			)}
			keyboardShouldPersistTaps="always"
			/>
		)}
	</>
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
		left: 0,
		right: 0,
		borderBottomLeftRadius: 8,
		borderBottomRightRadius: 8,
		paddingHorizontal: PADDING,
		zIndex: 10,
	}
});


export default TopBar;
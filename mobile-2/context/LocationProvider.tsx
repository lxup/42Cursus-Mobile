import { createContext, useContext, useState } from "react";
import * as TLocation from 'expo-location';

type Location = {
	name: string;
	source: 'geolocation' | 'search';
	data?: {
		address?: TLocation.LocationGeocodedAddress;
		latitude: number;
		longitude: number;
	};
}

type LocationContextProps = {
	activeLocation?: Location;
	updateActiveLocation: (location: Location) => void;
};

const LocationContext = createContext<LocationContextProps | undefined>(undefined);

const LocationProvider = ({ children }: { children: React.ReactNode }) => {
	const [activeLocation, setActiveLocation] = useState<Location | undefined>(undefined);

	const updateActiveLocation = (location: Location) => {
		setActiveLocation(location);
	};
	return (
		<LocationContext.Provider
		value={{
			activeLocation: activeLocation,
			updateActiveLocation: updateActiveLocation,
		}}
		>
			{children}
		</LocationContext.Provider>
	);
};

const useLocation = () => {
	const context = useContext(LocationContext);
	if (context === undefined) {
		throw new Error("useLocation must be used within an LocationProvider");
	}
	return context;
};

export {
	LocationProvider,
	useLocation
};
